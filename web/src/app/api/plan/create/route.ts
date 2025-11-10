import { NextResponse } from "next/server";
import { z } from "zod";
import {
  PlanSpecInputSchema,
  normalizeSpec,
  PlanItem,
  PlanDay,
  PlanDataSchema,
  fmtDate,
  daysBetweenInclusive,
  defaultSlots,
  defaultSlotTime,
  repairDays,
} from "@/lib/itinerarySchema";

export const runtime = "nodejs";

const PlanSpecSchema = PlanSpecInputSchema;

type Marker = { position: [number, number]; title?: string };

function fmtDateLocal(d: Date) {
  return fmtDate(d);
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

async function parseJsonRequest(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch {
    try {
      const text = await req.text();
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
}

export async function POST(req: Request) {
  const raw = await parseJsonRequest(req);
  // Fallback: read from query string if body is empty or missing fields
  let merged = raw;
  try {
    const u = new URL(req.url);
    const qs: Record<string, string> = {};
    for (const [k, v] of u.searchParams.entries()) qs[k] = v;
    merged = { ...qs, ...raw };
    // If preferences comes from querystring, it will be a JSON string; try to parse it.
    if (typeof (merged as any).preferences === "string") {
      try {
        (merged as any).preferences = JSON.parse((merged as any).preferences);
      } catch {}
    }
  } catch {}
  const parsed = PlanSpecSchema.safeParse(merged);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_spec", issues: parsed.error.issues }, { status: 400 });
  }
  const { destination, start_date, end_date, preferences } = normalizeSpec(parsed.data);

  const start = new Date(start_date);
  const end = new Date(end_date);
  const allDays = daysBetweenInclusive(start, end);

  const pace = preferences?.pace || "standard";
  const slots = defaultSlots(pace);
  const interests = (preferences?.interests || []).slice(0, 6);
  const budgetTotal = typeof preferences?.budgetTotal === "number" ? preferences!.budgetTotal : undefined;
  const partySize = typeof preferences?.partySize === "number" ? preferences.partySize : undefined;

  // Prepare candidate POIs for context
  const candidateMarkers = await findCityMarkers(destination);
  const candidatePOIs = candidateMarkers.map((m) => ({ name: m.title || "地标", lng: m.position[0], lat: m.position[1] }));

  // 生成完整计划（包含 days 与可选 markers），若不可用则返回 null
  async function generatePlanWithDoubao(): Promise<{ days: PlanDay[]; markers?: Marker[] } | null> {
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;
    const base = process.env.DOUBAO_API_BASE || "";
    // 放宽提供方限制：允许任意 OpenAI 兼容端点（只要提供 base/model/key 即可）
    if (!apiKey || !model || !base) return null;
    const url = base.replace(/\/$/, "") + "/chat/completions";
    const schemaSnippet = {
      type: "object",
      properties: {
        id: { type: "string" },
        destination: { type: "string" },
        start_date: { type: "string" },
        end_date: { type: "string" },
        days: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    time: { type: "string" },
                    title: { type: "string" },
                    note: { type: "string" },
                    place: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        location: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } }, additionalProperties: false },
                        address: { type: "string" },
                        poiId: { type: "string" },
                        category: { type: "string" },
                      },
                      required: ["name"],
                      additionalProperties: false,
                    },
                    durationEstimate: { type: "number" },
                    costEstimate: { type: "number" },
                  },
                  required: ["time", "title", "place", "costEstimate"],
                  additionalProperties: false,
                },
              },
              routePath: {
                type: "array",
                items: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } }, required: ["lat", "lng"], additionalProperties: false },
              },
              transport: {
                type: "object",
                properties: {
                  mode: { type: "string" },
                  steps: { type: "array", items: { type: "string" } },
                  timeEstimate: { type: "number" },
                  priceEstimate: { type: "number" },
                },
                required: ["mode", "timeEstimate", "priceEstimate"],
                additionalProperties: false,
              },
              dining: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    cuisine: { type: "string" },
                    priceRange: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 },
                    rating: { type: "number" },
                    distance: { type: "number" },
                    booking: { type: "boolean" },
                    location: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } }, additionalProperties: false },
                    address: { type: "string" },
                    phone: { type: "string" },
                    opening_hours: { type: "string" },
                    website: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                  },
                  required: ["name", "priceRange"],
                  additionalProperties: false,
                },
              },
              lodging: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    area: { type: "string" },
                    price: { type: "number" },
                    rating: { type: "number" },
                    distanceToCore: { type: "number" },
                    amenities: { type: "array", items: { type: "string" } },
                    location: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } }, additionalProperties: false },
                    address: { type: "string" },
                    phone: { type: "string" },
                    opening_hours: { type: "string" },
                    website: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    stars: { type: "number" },
                    checkin_time: { type: "string" },
                    checkout_time: { type: "string" },
                    room_types: { type: "array", items: { type: "string" } },
                  },
                  required: ["name", "price"],
                  additionalProperties: false,
                },
              },
              attractions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    ticket: { oneOf: [{ type: "number" }, { type: "string" }] },
                    best_time: { type: "string" },
                    tips: { type: "string" },
                    photo_spots: { type: "array", items: { type: "string" } },
                    address: { type: "string" },
                    opening_hours: { type: "string" },
                    website: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    location: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } }, additionalProperties: false },
                    durationEstimate: { type: "number" },
                  },
                  required: ["name", "ticket"],
                  additionalProperties: false,
                },
              },
            },
            required: ["date", "items"],
            additionalProperties: false,
          },
        },
        markers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              position: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 },
              title: { type: "string" },
            },
            required: ["position"],
            additionalProperties: false,
          },
        },
      },
      required: ["destination", "start_date", "end_date", "days"],
      additionalProperties: false,
    };
    const sys = `你是一位资深的旅游规划师，请根据用户偏好生成结构化行程。严格只输出 JSON（不要输出任何非JSON文字与代码块）。必须严格遵循以下 Schema：${JSON.stringify(
      schemaSnippet
    )}。字段名与层级必须完全一致：顶层仅允许 id、destination、start_date、end_date、days、markers；每天(day)仅允许 date、items、routePath、transport、dining、lodging、attractions。禁止使用任何替代字段名（如 schedule/accommodation/food/hotel 等）。生成要求：\n- 顶层必须包含 destination、start_date、end_date、days（尽量提供 id 与 markers）。\n- 覆盖从 ${start_date} 到 ${end_date} 的每一天；每天必须包含住宿(lodging)至少 1 条，且是具体酒店中文名。\n- 每天按节奏 ${pace} 生成 ${slots.length} 个活动；每个时段 items 必须给出具体去的地点(place.name)，不可使用泛化描述（如“城市核心景区打卡”）。\n- 所有餐饮/住宿/景点必须返回准确中文名字（如能提供地址/营业时间/电话/网站/标签请一并给出）；name 字段必须为具体店名/景点名，不能是类别或模糊词（如“本地餐厅”、“市中心酒店”、“核心景区”等）。\n- 严格的地域约束：餐饮/住宿/景点/活动地点必须位于“${destination}”及其辖区内，禁止返回其它城市（例如与 ${destination} 无关的店名，如出现跨城请改为本地等价选项）。\n- items.title 应含具体地点名称，并填写 time；如可估算请提供 durationEstimate 与 costEstimate。\n- 给出交通(方式/耗时/费用)、餐饮(价格区间/定位)、住宿(价格/定位/星级/入住退房)、景点(门票/最佳游览时间/提示/打卡点/定位等)。\n- 活动内容逐日保持差异化，避免重复。尽量匹配兴趣偏好：${interests.join("/") || "无"}。\n- 参考时间：${slots.map((_, i) => defaultSlotTime(i)).join("、")}。\n- 预算约束：${budgetTotal !== undefined ? `用户总预算为 ¥${Math.round(budgetTotal)}。请按照该预算安排交通、餐饮、住宿与门票等支出；最终估算总费用与用户预算的差额不得超过 ¥1000。若超出，请调整选项以满足约束。` : `若用户提供预算，请严格按照预算进行安排，并确保最终估算总费用与预算差额不超过 ¥1000。`}\n- 费用字段请尽量给出可计算的数值：items.costEstimate（元）、transport.priceEstimate（元）、dining.priceRange（两端为元）、lodging.price（元）、attractions.ticket（元或可解析的字符串）。\n- markers 如提供，请按照 [lng,lat] 与 title 输出，优先使用参考POI或景点/餐饮/住宿位置。`;
    const sys2 = `你是一位资深的旅游规划师，只输出严格 JSON（不允许任何非JSON内容）。必须严格遵循以下 Schema：${JSON.stringify(schemaSnippet)}。字段名与层级必须与 Schema 完全一致：\n- 顶层仅允许 id、destination、start_date、end_date、days、markers。\n- 每天(day)允许字段：date、items、routePath、transport、dining、lodging、attractions。\n- 禁止使用任何替代字段名（如 schedule/accommodation/food/hotel 等）。\n生成规则（务必遵守以保证预算展示完整）：\n- 覆盖 ${start_date} 到 ${end_date} 每天；每天 lodging 只给 1 条且是具体酒店中文名；dining 最多 2 条；attractions 最多 2 条。\n- 每天按节奏 ${pace} 生成 ${slots.length} 个活动；items 每条必须包含 place.name 与 time，并给出 costEstimate（元）。\n- transport 必须包含 mode、timeEstimate（分钟）、priceEstimate（元）；dining 必须给出 priceRange [min,max]（元）；lodging 必须给出 price（元）；attractions 必须给出 ticket（可为数值或可解析字符串）。\n- 名称必须为具体店名/景点名，禁止模糊词（如“本地餐厅”、“市中心酒店”、“核心景区”等）。\n- 严格地域约束：所有地点必须在“${destination}”辖区内，若跨城请改为本地等价选项。\n- 预算约束：${budgetTotal !== undefined ? `总预算 ¥${Math.round(budgetTotal)}，请合理安排，最终估算与预算差额不超过 ¥1000。` : `若用户提供预算，确保最终估算与预算差额不超过 ¥1000。`}\n- markers 如提供，请按 [lng,lat] 与 title 输出。\n- 最终输出必须是完整闭合的 JSON，无尾逗号，无截断，无额外文本。`;
    const user = `目的地:${destination}; 日期范围:${start_date}~${end_date}; ${partySize !== undefined ? `出行人数:${Math.max(1, Math.round(partySize))}人; ` : ""}${budgetTotal !== undefined ? `预算总额:¥${Math.round(budgetTotal)}; ` : ""}参考POI:${candidatePOIs
      .map((p) => `${p.name}(${p.lng},${p.lat})`)
      .join(";")}`;
    const sysBudget = `人数与预算规则：若提供出行人数 partySize，则所有金额按“全体同行总额”给出（不是人均）。\n- dining.priceRange 两端均为本次就餐总额（人均×人数）。\n- transport.priceEstimate 为当日交通总额。\n- lodging.price 为每晚总房费；默认 2 人/间，房间数=ceil(partySize/2)。\n- attractions.ticket 为门票总额（人均票价需乘人数）。\n- 若提供预算 budgetTotal，合计费用目标在预算的 80%–100% 区间。`;
    const sysDiningRules = `结构化餐饮与时间安排规则：\n- 每天必须返回恰好 3 条 dining（早餐/午餐/晚餐），并且各自的 name 中须包含“早餐/午餐/晚餐”关键词以明确餐次。\n- items 的 time 必须覆盖全天多个时间段：至少包含早晨/上午、中午/下午、夜间。\n- 每条 items 必须包含 place.name 与 time，并提供可计算的 costEstimate（元）。`;
    const baseBody: any = {
      model,
      messages: [
        { role: "system", content: sys2 },
        { role: "system", content: sysBudget },
        { role: "system", content: sysDiningRules },
        { role: "user", content: user },
      ],
      temperature: Number(process.env.DOUBAO_TEMPERATURE ?? 0.2),
      max_tokens: Number(process.env.DOUBAO_MAX_TOKENS ?? 3500),
    };
    try {
      const tryCall = async (format: "object" | "schema" | "none") => {
        const body =
          format === "schema"
            ? { ...baseBody, response_format: { type: "json_schema", json_schema: { name: "plan_schema", schema: schemaSnippet } } }
            : format === "object"
            ? { ...baseBody, response_format: { type: "json_object" } }
            : baseBody;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        });
        const data = await resp.json().catch(() => null as any);
        return { resp, data } as const;
      };
      // First attempt: use json_object for structured output (更多端点支持此模式)
      let { resp, data } = await tryCall("object");
      if (!resp.ok) {
        console.warn("[plan/create] Doubao call #1 failed (json_object)", { status: resp.status, error: data?.error });
      }
      // If response_format.type not supported, try json_schema; if still not ok, try no format
      if (
        data && (
          data.error?.param === "response_format.type" ||
          /response_format\.type/.test(String(data.error?.message || "")) ||
          String(data.error?.param || "").startsWith("response_format.")
        )
      ) {
        ({ resp, data } = await tryCall("schema"));
        if (!resp.ok) {
          console.warn("[plan/create] Doubao call #2 failed (json_schema)", { status: resp.status, error: data?.error });
          ({ resp, data } = await tryCall("none"));
          if (!resp.ok) {
            console.warn("[plan/create] Doubao call #3 failed (no format)", { status: resp.status, error: data?.error });
          }
        }
      }
      if (!resp.ok || !data) {
        console.warn("[plan/create] Doubao call failed: no ok response or empty data", { ok: resp.ok, status: resp.status });
        return null;
      }
      const content = data?.choices?.[0]?.message?.content ?? "";
      let obj: any = null;
      if (typeof content === "string") {
        try {
          obj = JSON.parse(content);
        } catch {
          // 尝试更宽松的 JSON 提取：去除代码块围栏、截取花括号区域、移除可能的尾逗号
          let s = content;
          s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
          const m = s.match(/\{[\s\S]*\}/);
          if (m) {
            let candidate = m[0];
            candidate = candidate.replace(/,\s*([\}\]])/g, "$1");
            try { obj = JSON.parse(candidate); } catch {}
          }
        }
      } else {
        obj = content;
      }
      if (!obj) {
        console.warn("[plan/create] Doubao content parse failed or empty", { preview: typeof content === "string" ? String(content).slice(0, 200) : typeof content });
        return null;
      }
      const rawDays = Array.isArray(obj?.days) ? obj.days : [];
      // First path: well-formed days
      if (rawDays.length && Array.isArray(rawDays[0]?.items)) {
        let days = rawDays.map((d: any) => ({
          date: String(d.date || "").slice(0, 10) || fmtDateLocal(allDays[0]),
          items: (Array.isArray(d.items) ? d.items : []).map((it: any, idx: number) => ({
            id: `${String(d.date || fmtDateLocal(allDays[0]))}-${idx}`,
            time: String(it.time || ""),
            title: String(it.title || "待定"),
            note: it.note ? String(it.note) : undefined,
            place:
              it.place && typeof it.place === "object"
                ? {
                    name: String(it.place.name || ""),
                    location:
                      it.place.location && typeof it.place.location === "object"
                        ? { lat: Number(it.place.location.lat), lng: Number(it.place.location.lng) }
                        : undefined,
                    address: it.place.address ? String(it.place.address) : undefined,
                    poiId: it.place.poiId ? String(it.place.poiId) : undefined,
                    category: it.place.category ? String(it.place.category) : undefined,
                  }
                : undefined,
            durationEstimate: it.durationEstimate ? Number(it.durationEstimate) : undefined,
            costEstimate: it.costEstimate ? Number(it.costEstimate) : undefined,
          })),
          routePath: Array.isArray(d.routePath)
            ? d.routePath
                .map((p: any) => ({ lat: Number(p?.lat), lng: Number(p?.lng) }))
                .filter((p: any) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
            : undefined,
          transport:
            d.transport && typeof d.transport === "object"
              ? {
                  mode: String(d.transport.mode || "transit"),
                  steps: Array.isArray(d.transport.steps) ? d.transport.steps.map((s: any) => String(s)) : undefined,
                  timeEstimate: d.transport.timeEstimate ? Number(d.transport.timeEstimate) : undefined,
                  priceEstimate: d.transport.priceEstimate ? Number(d.transport.priceEstimate) : undefined,
                }
              : undefined,
          dining: Array.isArray(d.dining)
            ? d.dining.map((r: any) => ({
                name: String(r?.name || "餐馆"),
                cuisine: r?.cuisine ? String(r.cuisine) : undefined,
                priceRange: Array.isArray(r?.priceRange) && r.priceRange.length === 2 ? [Number(r.priceRange[0]), Number(r.priceRange[1])] : undefined,
                rating: r?.rating ? Number(r.rating) : undefined,
                distance: r?.distance ? Number(r.distance) : undefined,
                booking: typeof r?.booking === "boolean" ? r.booking : undefined,
                location: r?.location && typeof r.location === "object" ? { lat: Number(r.location.lat), lng: Number(r.location.lng) } : undefined,
                address: r?.address ? String(r.address) : undefined,
                phone: r?.phone ? String(r.phone) : undefined,
                opening_hours: r?.opening_hours ? String(r.opening_hours) : undefined,
                website: r?.website ? String(r.website) : undefined,
                tags: Array.isArray(r?.tags) ? r.tags.map((t: any) => String(t)) : undefined,
              }))
            : undefined,
          lodging: Array.isArray(d.lodging)
            ? d.lodging.map((h: any) => ({
                name: String(h?.name || "酒店"),
                area: h?.area ? String(h.area) : undefined,
                price: h?.price ? Number(h.price) : undefined,
                rating: h?.rating ? Number(h.rating) : undefined,
                distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined,
                amenities: Array.isArray(h?.amenities) ? h.amenities.map((a: any) => String(a)) : undefined,
                location: h?.location && typeof h.location === "object" ? { lat: Number(h.location.lat), lng: Number(h.location.lng) } : undefined,
                address: h?.address ? String(h.address) : undefined,
                phone: h?.phone ? String(h.phone) : undefined,
                opening_hours: h?.opening_hours ? String(h.opening_hours) : undefined,
                website: h?.website ? String(h.website) : undefined,
                tags: Array.isArray(h?.tags) ? h.tags.map((t: any) => String(t)) : undefined,
                stars: h?.stars ? Number(h.stars) : undefined,
                checkin_time: h?.checkin_time ? String(h.checkin_time) : undefined,
                checkout_time: h?.checkout_time ? String(h.checkout_time) : undefined,
                room_types: Array.isArray(h?.room_types) ? h.room_types.map((rt: any) => String(rt)) : undefined,
              }))
            : undefined,
          attractions: Array.isArray(d.attractions)
            ? d.attractions.map((a: any) => ({
                name: String(a?.name || "景点"),
                ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined,
                best_time: a?.best_time ? String(a.best_time) : undefined,
                tips: a?.tips ? String(a.tips) : undefined,
                photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p: any) => String(p)) : undefined,
                address: a?.address ? String(a.address) : undefined,
                opening_hours: a?.opening_hours ? String(a.opening_hours) : undefined,
                website: a?.website ? String(a.website) : undefined,
                tags: Array.isArray(a?.tags) ? a.tags.map((t: any) => String(t)) : undefined,
                location: a?.location && typeof a.location === "object" ? { lat: Number(a.location.lat), lng: Number(a.location.lng) } : undefined,
                durationEstimate: a?.durationEstimate ? Number(a.durationEstimate) : undefined,
              }))
            : undefined,
        }));
        // 目的地地域校验：过滤掉明显跨城的餐饮/住宿/景点/活动地点
        const cityKeywords = [
          "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"
        ];
        const destKey = cityKeywords.find((c) => destination.includes(c)) || destination;
        const includesOtherCity = (s?: string) => {
          if (!s) return false;
          const hasDest = s.includes(destKey);
          const other = cityKeywords.some((c) => s.includes(c) && c !== destKey);
          return !hasDest && other;
        };
        const bounds = (() => {
          if (!candidatePOIs.length) return null;
          const lats = candidatePOIs.map((p) => p.lat);
          const lngs = candidatePOIs.map((p) => p.lng);
          const padLat = 1.5;
          const padLng = 1.5;
          return { minLat: Math.min(...lats) - padLat, maxLat: Math.max(...lats) + padLat, minLng: Math.min(...lngs) - padLng, maxLng: Math.max(...lngs) + padLng };
        })();
        const inBounds = (loc?: { lat?: number; lng?: number }) => {
          if (!bounds || !loc || !Number.isFinite(loc.lat!) || !Number.isFinite(loc.lng!)) return true;
          return loc.lat! >= bounds.minLat && loc.lat! <= bounds.maxLat && loc.lng! >= bounds.minLng && loc.lng! <= bounds.maxLng;
        };
        const isLocal = (name?: string, address?: string, loc?: { lat?: number; lng?: number }) => {
          if (includesOtherCity(name) || includesOtherCity(address)) return false;
          if (!inBounds(loc)) return false;
          return true;
        };
        days = days.map((d: any) => ({
          ...d,
          items: d.items.map((it: any) => {
            const loc = it.place?.location;
            const nm = it.place?.name || it.title;
            if (it.place && !isLocal(nm, it.place?.address, loc)) {
              // 若地点明显跨城，保留标题但去掉 place 以避免误导
              const { place, ...rest } = it;
              return { ...rest };
            }
            return it;
          }),
          dining: Array.isArray(d.dining) ? d.dining.filter((r: any) => isLocal(r?.name, r?.address, r?.location)) : d.dining,
          lodging: Array.isArray(d.lodging) ? d.lodging.filter((h: any) => isLocal(h?.name, h?.address, h?.location)) : d.lodging,
          attractions: Array.isArray(d.attractions) ? d.attractions.filter((a: any) => isLocal(a?.name, a?.address, a?.location)) : d.attractions,
        }));
        // 解析 markers（若模型已提供）
        const rawMarkers = Array.isArray(obj?.markers) ? obj.markers : [];
        const markers: Marker[] | undefined = rawMarkers
          .map((m: any) => {
            const pos = Array.isArray(m?.position) ? m.position : null;
            const lng = Number(pos?.[0]);
            const lat = Number(pos?.[1]);
            if (Number.isFinite(lng) && Number.isFinite(lat)) {
              return { position: [lng, lat], title: m?.title ? String(m.title) : undefined } as Marker;
            }
            return null;
          })
          .filter(Boolean) as Marker[];
        return { days, markers };
      }
      // Second path: repair from flat or malformed structure
      const allDates = allDays.map((d) => fmtDateLocal(d));
      const days = repairDays({ rawDays, allDates, destination, pace });
      const rawMarkers = Array.isArray(obj?.markers) ? obj.markers : [];
      const markers: Marker[] | undefined = rawMarkers
        .map((m: any) => {
          const pos = Array.isArray(m?.position) ? m.position : null;
          const lng = Number(pos?.[0]);
          const lat = Number(pos?.[1]);
          if (Number.isFinite(lng) && Number.isFinite(lat)) {
            return { position: [lng, lat], title: m?.title ? String(m.title) : undefined } as Marker;
          }
          return null;
        })
        .filter(Boolean) as Marker[];
      return { days, markers };
    } catch {
      return null;
    }
  }

  // 针对较长日期范围的稳健策略：分日生成并合并。
  // 当一次性生成失败时，逐日调用模型，显著降低截断与结构不合规概率。
  async function generateByDaysIndividually(): Promise<{ days: PlanDay[]; markers?: Marker[] } | null> {
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;
    const base = process.env.DOUBAO_API_BASE || "";
    if (!apiKey || !model || !base) return null;
    const url = base.replace(/\/$/, "") + "/chat/completions";

    const concurrency = Math.max(1, Number(process.env.PER_DAY_CONCURRENCY ?? 2));
    const outDays: (PlanDay | null)[] = new Array(allDays.length).fill(null);
    const outMarkers: Marker[][] = new Array(allDays.length).fill([]);
    let idx = 0;

    const worker = async () => {
      while (true) {
        const pos = idx++;
        if (pos >= allDays.length) break;
        const d = allDays[pos];
        const sd = fmtDateLocal(d);
        const ed = fmtDateLocal(d);

        const schemaSnippet = {
          type: "object",
          properties: {
            id: { type: "string" },
            destination: { type: "string" },
            start_date: { type: "string" },
            end_date: { type: "string" },
            days: { type: "array", items: { type: "object", properties: { date: { type: "string" }, items: { type: "array" } }, required: ["date", "items"], additionalProperties: false } },
            markers: { type: "array", items: { type: "object", properties: { position: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 }, title: { type: "string" } }, required: ["position"], additionalProperties: false } },
          },
          required: ["destination", "start_date", "end_date", "days"],
          additionalProperties: false,
        } as any;
        const sys2 = `只输出严格 JSON；字段与层级必须与 Schema 完全一致：${JSON.stringify(schemaSnippet)}。生成 ${sd} 到 ${ed} 的单日行程；每天：lodging 仅 1 条且为具体酒店；dining ≤2；attractions ≤2；items 必须含 place.name、time 与 costEstimate；transport 必填 mode/timeEstimate/priceEstimate；所有地点必须在“${destination}”。预算约束：${budgetTotal !== undefined ? `总预算 ¥${Math.round(budgetTotal)}，确保与预算差额不超过 ¥1000。` : `若提供预算，确保与预算差额不超过 ¥1000。`}最终输出为完整闭合 JSON。`;
        const sysBudget2 = `人数与预算规则：若提供出行人数 partySize，则所有金额按“全体同行总额”给出（不是人均）。\n- dining.priceRange 两端均为本次就餐总额（人均×人数）。\n- transport.priceEstimate 为当日交通总额。\n- lodging.price 为每晚总房费；默认 2 人/间，房间数=ceil(partySize/2)。\n- attractions.ticket 为门票总额（人均票价需乘人数）。\n- 若提供预算 budgetTotal，合计费用目标在预算的 80%–100% 区间。`;
        const sysDiningRulesDay = `结构化餐饮与时间安排规则：\n- 当日必须返回恰好 3 条 dining（早餐/午餐/晚餐），并且各自的 name 中须包含“早餐/午餐/晚餐”关键词以明确餐次。\n- items 的 time 必须覆盖全天多个时间段：至少包含早晨/上午、中午/下午、夜间。\n- 每条 items 必须包含 place.name 与 time，并提供可计算的 costEstimate（元）。`;
        const user = `目的地:${destination}; 日期范围:${sd}~${ed}; ${partySize !== undefined ? `出行人数:${Math.max(1, Math.round(partySize))}人; ` : ""}参考POI:${candidatePOIs.map((p) => `${p.name}(${p.lng},${p.lat})`).join(";")}`;
        const baseBody: any = {
          model,
          messages: [
            { role: "system", content: sys2 },
            { role: "system", content: sysBudget2 },
            { role: "system", content: sysDiningRulesDay },
            { role: "user", content: user },
          ],
          temperature: Number(process.env.DOUBAO_TEMPERATURE ?? 0.2),
          // 单日生成不需要过高的 token 上限，降低可提升速度
          max_tokens: Math.min(Number(process.env.DOUBAO_MAX_TOKENS ?? 3500), 1800),
        };
        const tryCall = async (format: "object" | "schema" | "none") => {
          const body =
            format === "schema"
              ? { ...baseBody, response_format: { type: "json_schema", json_schema: { name: "plan_schema", schema: schemaSnippet } } }
              : format === "object"
              ? { ...baseBody, response_format: { type: "json_object" } }
              : baseBody;
          const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(body) });
          const data = await resp.json().catch(() => null as any);
          return { resp, data } as const;
        };
        let { resp, data } = await tryCall("object");
        if (!resp.ok) {
          ({ resp, data } = await tryCall("schema"));
          if (!resp.ok) {
            ({ resp, data } = await tryCall("none"));
          }
        }
        if (!resp.ok || !data) {
          outDays[pos] = null;
          outMarkers[pos] = [];
          continue;
        }
        const content = data?.choices?.[0]?.message?.content ?? "";
        let obj: any = null;
        if (typeof content === "string") {
          try { obj = JSON.parse(content); } catch {
            let s = content; s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
            const m = s.match(/\{[\s\S]*\}/); if (m) { let candidate = m[0]; candidate = candidate.replace(/,\s*([\}\]])/g, "$1"); try { obj = JSON.parse(candidate); } catch {}
            }
          }
        } else { obj = content; }
        const rawDays = Array.isArray(obj?.days) ? obj.days : [];
        if (rawDays.length && Array.isArray(rawDays[0]?.items)) {
          const single = rawDays[0];
          const parsed: PlanDay = {
            date: String(single.date || sd).slice(0, 10) || sd,
            items: (Array.isArray(single.items) ? single.items : []).map((it: any, idx2: number) => ({
              id: `${sd}-${idx2}`,
              time: String(it.time || ""),
              title: String(it.title || "待定"),
              note: it.note ? String(it.note) : undefined,
              place: it.place && typeof it.place === "object" ? { name: String(it.place.name || ""), location: it.place.location && typeof it.place.location === "object" ? { lat: Number(it.place.location.lat), lng: Number(it.place.location.lng) } : undefined, address: it.place.address ? String(it.place.address) : undefined, poiId: it.place.poiId ? String(it.place.poiId) : undefined, category: it.place.category ? String(it.place.category) : undefined } : undefined,
              durationEstimate: it.durationEstimate ? Number(it.durationEstimate) : undefined,
              costEstimate: it.costEstimate ? Number(it.costEstimate) : undefined,
            })),
            routePath: Array.isArray(single.routePath) ? single.routePath.map((p: any) => ({ lat: Number(p?.lat), lng: Number(p?.lng) })).filter((p: any) => Number.isFinite(p.lat) && Number.isFinite(p.lng)) : undefined,
            transport: single.transport && typeof single.transport === "object" ? { mode: String(single.transport.mode || "transit"), steps: Array.isArray(single.transport.steps) ? single.transport.steps.map((s: any) => String(s)) : undefined, timeEstimate: single.transport.timeEstimate ? Number(single.transport.timeEstimate) : undefined, priceEstimate: single.transport.priceEstimate ? Number(single.transport.priceEstimate) : undefined } : undefined,
            dining: Array.isArray(single.dining) ? single.dining.map((r: any) => ({ name: String(r?.name || "餐馆"), cuisine: r?.cuisine ? String(r.cuisine) : undefined, priceRange: Array.isArray(r?.priceRange) && r.priceRange.length === 2 ? [Number(r.priceRange[0]), Number(r.priceRange[1])] : undefined, rating: r?.rating ? Number(r.rating) : undefined, distance: r?.distance ? Number(r.distance) : undefined, booking: typeof r?.booking === "boolean" ? r.booking : undefined, location: r?.location && typeof r.location === "object" ? { lat: Number(r.location.lat), lng: Number(r.location.lng) } : undefined, address: r?.address ? String(r.address) : undefined, phone: r?.phone ? String(r.phone) : undefined, opening_hours: r?.opening_hours ? String(r.opening_hours) : undefined, website: r?.website ? String(r.website) : undefined, tags: Array.isArray(r?.tags) ? r.tags.map((t: any) => String(t)) : undefined })) : undefined,
            lodging: Array.isArray(single.lodging) ? single.lodging.map((h: any) => ({ name: String(h?.name || "酒店"), area: h?.area ? String(h.area) : undefined, price: h?.price ? Number(h.price) : undefined, rating: h?.rating ? Number(h.rating) : undefined, distanceToCore: h?.distanceToCore ? Number(h.distanceToCore) : undefined, amenities: Array.isArray(h?.amenities) ? h.amenities.map((a: any) => String(a)) : undefined, location: h?.location && typeof h.location === "object" ? { lat: Number(h.location.lat), lng: Number(h.location.lng) } : undefined, address: h?.address ? String(h.address) : undefined, phone: h?.phone ? String(h.phone) : undefined, opening_hours: h?.opening_hours ? String(h.opening_hours) : undefined, website: h?.website ? String(h.website) : undefined, tags: Array.isArray(h?.tags) ? h.tags.map((t: any) => String(t)) : undefined, stars: h?.stars ? Number(h.stars) : undefined, checkin_time: h?.checkin_time ? String(h.checkin_time) : undefined, checkout_time: h?.checkout_time ? String(h.checkout_time) : undefined, room_types: Array.isArray(h?.room_types) ? h.room_types.map((rt: any) => String(rt)) : undefined })) : undefined,
            attractions: Array.isArray(single.attractions) ? single.attractions.map((a: any) => ({ name: String(a?.name || "景点"), ticket: typeof a?.ticket === "number" ? a.ticket : a?.ticket ? String(a.ticket) : undefined, best_time: a?.best_time ? String(a.best_time) : undefined, tips: a?.tips ? String(a.tips) : undefined, photo_spots: Array.isArray(a?.photo_spots) ? a.photo_spots.map((p: any) => String(p)) : undefined, address: a?.address ? String(a.address) : undefined, opening_hours: a?.opening_hours ? String(a.opening_hours) : undefined, website: a?.website ? String(a.website) : undefined, tags: Array.isArray(a?.tags) ? a.tags.map((t: any) => String(t)) : undefined, location: a?.location && typeof a.location === "object" ? { lat: Number(a.location.lat), lng: Number(a.location.lng) } : undefined, durationEstimate: a?.durationEstimate ? Number(a.durationEstimate) : undefined })) : undefined,
          } as any;
          outDays[pos] = parsed;
          const rawMarkers = Array.isArray(obj?.markers) ? obj.markers : [];
          const markers: Marker[] = rawMarkers.map((m: any) => { const posi = Array.isArray(m?.position) ? m.position : null; const lng = Number(posi?.[0]); const lat = Number(posi?.[1]); if (Number.isFinite(lng) && Number.isFinite(lat)) { return { position: [lng, lat], title: m?.title ? String(m.title) : undefined } as Marker; } return null; }).filter(Boolean) as Marker[];
          outMarkers[pos] = markers;
        } else {
          outDays[pos] = null;
          outMarkers[pos] = [];
        }
      }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    if (outDays.every((d) => d !== null)) {
      const days = outDays.filter(Boolean) as PlanDay[];
      const merged: Marker[] = [];
      const seen = new Set<string>();
      for (const arr of outMarkers) {
        for (const m of arr) {
          const k = `${m.position[0].toFixed(6)}_${m.position[1].toFixed(6)}_${m.title || ""}`;
          if (seen.has(k)) continue; seen.add(k); merged.push(m);
        }
      }
      return { days, markers: merged };
    }
    return null;
  }

  let generated = await generatePlanWithDoubao();
  let days: PlanDay[] | null = generated?.days || null;
  let source: "llm" | "fallback" = days ? "llm" : "fallback";
  // 若一次性生成失败且日期超过2天，尝试分日生成以提升成功率
  if (!days && allDays.length > 2) {
    const perDay = await generateByDaysIndividually();
    if (perDay?.days?.length) {
      days = perDay.days;
      generated = perDay;
      source = "llm";
    }
  }
  if (!days) {
    // 本地回退生成
    const ps = Math.max(1, Number(partySize) || 1);
    days = allDays.map((d, i) => {
      const dateStr = fmtDateLocal(d);
      const pick = (j: number) => candidatePOIs[j % (candidatePOIs.length || 1)];
      const items: PlanItem[] = slots.map((slot, idx) => {
        const poi = pick(i * 3 + idx);
        return {
          id: `${dateStr}-${idx}`,
          time: defaultSlotTime(idx),
          title: `${poi.name} 深度体验 (${slot})`,
          note: idx === 0 ? "推荐乘船或湖畔步行，拍摄经典机位" : idx === 1 ? "文化打卡与美食探店结合" : "夜游街区，品尝当地小吃",
          place: { name: poi.name, location: { lat: poi.lat, lng: poi.lng } },
          durationEstimate: 90,
          costEstimate: (idx === 0 ? 50 : idx === 1 ? 80 : 30) * ps,
        } as any;
      });
      const isWuhan = /武汉|Wuhan/i.test(destination);
      const isHangzhou = /杭州|Hangzhou/i.test(destination);
      const dining = isWuhan
        ? [
            { name: "蔡林记(户部巷店)", cuisine: "武汉小吃", priceRange: [20 * ps, 40 * ps], rating: 4.5, location: candidatePOIs[0] ? { lat: candidatePOIs[0].lat, lng: candidatePOIs[0].lng } : undefined, address: "武昌区户部巷", phone: "027-xxx", opening_hours: "06:30-21:30", tags: ["热干面","老字号"] },
            { name: "四季美汤包(楚河汉街店)", cuisine: "汤包/小吃", priceRange: [25 * ps, 60 * ps], rating: 4.4, location: candidatePOIs[1] ? { lat: candidatePOIs[1].lat, lng: candidatePOIs[1].lng } : undefined, address: "楚河汉街", phone: "027-xxx", opening_hours: "07:00-21:30", tags: ["人气","本地人"] },
            { name: "周黑鸭(江汉路总店)", cuisine: "卤味", priceRange: [30 * ps, 80 * ps], rating: 4.3, location: candidatePOIs[2] ? { lat: candidatePOIs[2].lat, lng: candidatePOIs[2].lng } : undefined, address: "江汉路步行街", opening_hours: "10:00-22:00", tags: ["伴手礼"] },
          ]
        : isHangzhou
        ? [
            { name: "楼外楼(西湖店)", cuisine: "杭帮菜", priceRange: [80 * ps, 180 * ps], rating: 4.6, location: candidatePOIs[0] ? { lat: candidatePOIs[0].lat, lng: candidatePOIs[0].lng } : undefined, address: "西湖风景区孤山路30号", phone: "0571-xxx", opening_hours: "10:00-20:00", tags: ["老字号","湖景"] },
            { name: "外婆家(湖滨银泰)", cuisine: "家常菜", priceRange: [60 * ps, 120 * ps], rating: 4.5, location: candidatePOIs[1] ? { lat: candidatePOIs[1].lat, lng: candidatePOIs[1].lng } : undefined, address: "湖滨银泰in77", phone: "0571-xxx", opening_hours: "11:00-21:30", tags: ["人气","排队"] },
            { name: "知味观(总店)", cuisine: "小吃", priceRange: [20 * ps, 50 * ps], rating: 4.3, location: candidatePOIs[2] ? { lat: candidatePOIs[2].lat, lng: candidatePOIs[2].lng } : undefined, address: "延安路83号", opening_hours: "07:00-21:00", tags: ["早点","本地人"] },
          ]
        : [
            { name: `${destination} 当地菜馆 A`, cuisine: "地方菜", priceRange: [50 * ps, 120 * ps], rating: 4.4, location: candidatePOIs[0] ? { lat: candidatePOIs[0].lat, lng: candidatePOIs[0].lng } : undefined, tags: ["人气"] },
            { name: `${destination} 小吃街 B`, cuisine: "小吃", priceRange: [20 * ps, 60 * ps], rating: 4.2, location: candidatePOIs[1] ? { lat: candidatePOIs[1].lat, lng: candidatePOIs[1].lng } : undefined, tags: ["本地人"] },
            { name: `${destination} 特色餐厅 C`, cuisine: "特色菜", priceRange: [80 * ps, 180 * ps], rating: 4.3, location: candidatePOIs[2] ? { lat: candidatePOIs[2].lat, lng: candidatePOIs[2].lng } : undefined, tags: ["适合家庭"] },
          ];
      const lodgingArea = isWuhan ? "楚河汉街/东湖" : isHangzhou ? "湖滨/西湖" : "市中心";
      const rooms = Math.ceil(ps / 2);
      const lodging = [{ name: `${destination} 精品酒店·日${i + 1}`, area: lodgingArea, price: 420 * rooms, rating: 4.3, amenities: ["WiFi","早餐","空调"], stars: 4, checkin_time: "14:00", checkout_time: "12:00", location: candidatePOIs[i % (candidatePOIs.length || 1)] ? { lat: candidatePOIs[i % (candidatePOIs.length || 1)].lat, lng: candidatePOIs[i % (candidatePOIs.length || 1)].lng } : undefined }];
      const transport = { mode: "transit", steps: ["地铁与公交组合", "步行 10 分钟"], timeEstimate: 30, priceEstimate: 20 * ps };
      const aPick = (j: number) => candidatePOIs[j % (candidatePOIs.length || 1)];
      const attractions = [
        { name: `${aPick(i * 2).name || destination} 景点`, ticket: 60 * ps, best_time: "上午", tips: "提前购票，错峰入园", photo_spots: ["主入口", "观景台"], location: { lat: aPick(i * 2).lat, lng: aPick(i * 2).lng } },
        { name: `${aPick(i * 2 + 1).name || destination} 景点`, ticket: 80 * ps, best_time: "下午", tips: "注意防晒，补水", photo_spots: ["湖畔", "古街"], location: { lat: aPick(i * 2 + 1).lat, lng: aPick(i * 2 + 1).lng } },
      ];
      const routePath = candidatePOIs.length >= 2
        ? [
            { lat: pick(0).lat, lng: pick(0).lng },
            { lat: pick(1).lat, lng: pick(1).lng },
          ]
        : undefined;
      return { date: dateStr, items, dining, lodging, transport, attractions, routePath } as any;
    });
  }

  // —— 预算校正：将总估算控制在“总预算±1000”范围内（尽量贴近总预算） ——
  // 仅在提供了总预算时进行；优先通过餐饮价格区间伸缩来贴近目标，其次才尝试轻微调整住宿价格。
  function computeTotals(ds: PlanDay[]) {
    let transport = 0, dining = 0, lodging = 0, tickets = 0;
    for (const d of ds || []) {
      transport += Number(d.transport?.priceEstimate) || 0;
      // 与前端保持一致：餐饮按区间上限估算
      dining += (d.dining || []).reduce((s, it: any) => {
        const a = Number(it?.priceRange?.[0] || 0);
        const b = Number(it?.priceRange?.[1] || 0);
        const up = Number.isFinite(a) && Number.isFinite(b) ? Math.max(a, b) : 0;
        return s + up;
      }, 0);
      lodging += (d.lodging || []).reduce((s, it: any) => s + (Number(it?.price) || 0), 0);
      tickets += (d.attractions || []).reduce((s, it: any) => {
        const t = typeof it?.ticket === "number" ? it.ticket : Number(it?.ticket);
        return s + (Number.isFinite(t) ? t : 0);
      }, 0);
    }
    const grand = transport + dining + lodging + tickets;
    return { transport, dining, lodging, tickets, grand } as const;
  }

  function normalizeBudgetByTotal(ds: PlanDay[], budget?: number): PlanDay[] {
    if (!Number.isFinite(budget)) return ds;
    const b = Math.max(0, Number(budget));
    const lower = Math.max(0, b - 1000);
    const upper = b + 1000;
    const sums = computeTotals(ds);
    if (sums.grand >= lower && sums.grand <= upper) return ds;
    const target = b; // 尽量贴近用户总预算本身
    const nonDining = sums.transport + sums.lodging + sums.tickets;
    const diningTotal = Math.max(0, sums.dining);

    let out = ds;
    if (diningTotal > 0) {
      const desiredDining = Math.max(100, target - nonDining);
      const factor = Math.max(0.5, Math.min(3.0, desiredDining / diningTotal));
      out = ds.map((d) => ({
        ...d,
        dining: (d.dining || []).map((it: any) => {
          const a = Number(it?.priceRange?.[0] || 0);
          const b2 = Number(it?.priceRange?.[1] || 0);
          const na = Math.round(a * factor);
          const nb = Math.round(b2 * factor);
          const lo = Math.min(na, nb);
          const hi = Math.max(na, nb);
          return { ...it, priceRange: [lo, hi] } as any;
        }),
      }));
    }

    // 重新计算；若仍未进入范围，允许对住宿进行轻微比例调整（最多±25%）
    const sums2 = computeTotals(out);
    if (!(sums2.grand >= lower && sums2.grand <= upper) && sums2.lodging > 0) {
      const desiredLodging = Math.max(0, target - (sums2.transport + sums2.dining + sums2.tickets));
      const factorL = Math.max(0.75, Math.min(1.25, desiredLodging / sums2.lodging));
      out = out.map((d) => ({
        ...d,
        lodging: (d.lodging || []).map((l: any) => ({ ...l, price: Math.round((Number(l?.price) || 0) * factorL) })),
      }));
    }
    return out;
  }

  if (days && Number.isFinite(budgetTotal)) {
    days = normalizeBudgetByTotal(days!, budgetTotal);
  }

  const markers = (generated?.markers && generated.markers.length ? generated.markers : (candidateMarkers.length ? candidateMarkers : await findCityMarkers(destination)));

  const data = {
    id: `generated-${Math.random().toString(36).slice(2, 8)}`,
    destination,
    start_date,
    end_date,
    days: days!,
    markers,
    source,
  };

  // Validate final data strictly; if invalid, attempt minimal repair and return
  const validated = PlanDataSchema.safeParse(data);
  if (!validated.success) {
    // Minimal repair: ensure dates coverage
    const allDates = allDays.map((d) => fmtDateLocal(d));
    const repairedDays = repairDays({ rawDays: data.days, allDates, destination, pace });
    const repaired = { ...data, days: repairedDays };
    const reparsed = PlanDataSchema.safeParse(repaired);
    if (!reparsed.success) {
      return NextResponse.json({ error: "generation_failed", issues: reparsed.error.issues }, { status: 500 });
    }
    return NextResponse.json(repaired);
  }
  return NextResponse.json(validated.data);
}
