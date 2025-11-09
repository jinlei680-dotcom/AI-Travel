import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "node";

const PlanSpecSchema = z.object({
  destination: z.string().min(1, "destination required"),
  start_date: z.string().min(8),
  end_date: z.string().min(8),
  preferences: z
    .object({
      pace: z.enum(["relaxed", "standard", "intense"]).optional(),
      interests: z.array(z.string()).optional(),
    })
    .optional(),
});

type Marker = { position: [number, number]; title?: string };
type PlanItem = { id: string; time?: string; title: string; note?: string; location?: [number, number] };
type PlanDay = { date: string; items: PlanItem[] };
type PlanData = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: PlanDay[];
  markers?: Marker[];
};

function daysBetweenInclusive(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const d = new Date(start);
  while (d.getTime() <= end.getTime()) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function findCityMarkers(city: string): Promise<Marker[]> {
  const key = process.env.AMAP_WEBSERVICE_KEY;
  if (!key) {
    return [
      { position: [116.397428, 39.90923], title: `${city} 地标A` },
      { position: [116.384, 39.923], title: `${city} 地标B` },
    ];
  }
  const params = new URLSearchParams({
    key,
    keywords: "景点",
    city,
    citylimit: "true",
    offset: "5",
  });
  const url = `https://restapi.amap.com/v3/place/text?${params.toString()}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const pois: any[] = data?.pois || [];
    return pois.slice(0, 5).map((p) => {
      const [lngStr, latStr] = String(p.location || "").split(",");
      const lng = Number(lngStr);
      const lat = Number(latStr);
      return { position: [lng, lat], title: p.name } as Marker;
    });
  } catch {
    return [
      { position: [116.397428, 39.90923], title: `${city} 地标A` },
      { position: [116.384, 39.923], title: `${city} 地标B` },
    ];
  }
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => ({}));
  const parsed = PlanSpecSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_spec", issues: parsed.error.issues }, { status: 400 });
  }
  const { destination, start_date, end_date, preferences } = parsed.data;

  const start = new Date(start_date);
  const end = new Date(end_date);
  const allDays = daysBetweenInclusive(start, end);

  const pace = preferences?.pace || "standard";
  const slots = pace === "relaxed" ? ["上午", "下午"] : pace === "intense" ? ["早晨", "上午", "午后", "傍晚"] : ["上午", "午后", "晚上"];

  async function generateDaysWithDoubao(): Promise<PlanDay[] | null> {
    const provider = process.env.LLM_PROVIDER;
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;
    const base = process.env.DOUBAO_API_BASE || "";
    if (provider !== "doubao" || !apiKey || !model || !base) return null;
    const url = base.replace(/\/$/, "") + "/chat/completions";
    const sys =
      "你是旅行行程生成助手。只输出 JSON，字段为 days:[{date,time,title,note}...]。日期范围覆盖用户给定的开始到结束日期，每天生成2-4个合理活动，避免泛泛描述。确保严格 JSON 格式。";
    const user = `目的地:${destination}; 开始:${start_date}; 结束:${end_date}; 偏好:${preferences?.pace || "standard"}`;
    const body = {
      model,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: Number(process.env.DOUBAO_TEMPERATURE ?? 0.2),
      max_tokens: Number(process.env.DOUBAO_MAX_TOKENS ?? 1200),
      response_format: { type: "json_object" },
    };
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data) return null;
      // Ark 格式：choices[0].message.content 为字符串（JSON）
      const content = data?.choices?.[0]?.message?.content ?? "";
      const obj = typeof content === "string" ? JSON.parse(content) : content;
      const rawDays = Array.isArray(obj?.days) ? obj.days : [];
      // 规范化为 PlanDay[]
      const days: PlanDay[] = rawDays.map((d: any) => ({
        date: String(d.date || "").slice(0, 10) || fmtDate(allDays[0]),
        items: (Array.isArray(d.items) ? d.items : []).map((it: any, idx: number) => ({
          id: `${String(d.date || fmtDate(allDays[0]))}-${idx}`,
          time: String(it.time || ""),
          title: String(it.title || "待定"),
          note: it.note ? String(it.note) : undefined,
        })),
      }));
      return days.length ? days : null;
    } catch {
      return null;
    }
  }

  let days: PlanDay[] | null = await generateDaysWithDoubao();
  if (!days) {
    // 本地回退生成
    days = allDays.map((d, i) => {
      const dateStr = fmtDate(d);
      const items: PlanItem[] = slots.map((slot, idx) => ({
        id: `${dateStr}-${idx}`,
        time: idx === 0 ? "09:00" : idx === 1 ? "13:30" : idx === 2 ? "17:00" : "19:30",
        title: `${destination} ${slot}行程`,
        note: i === 0 && idx === 0 ? "抵达与入住/领取交通卡" : undefined,
      }));
      return { date: dateStr, items };
    });
  }

  const markers = await findCityMarkers(destination);

  const data: PlanData = {
    id: `generated-${Math.random().toString(36).slice(2, 8)}`,
    destination,
    start_date,
    end_date,
    days: days!,
    markers,
  };

  return NextResponse.json(data);
}