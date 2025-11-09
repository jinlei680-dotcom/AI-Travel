import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const destination = body?.destination || "示例城市";
  const start_date = body?.start_date || new Date().toISOString().slice(0, 10);
  const end_date = body?.end_date || new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

  const data = {
    id: "generated-" + Math.random().toString(36).slice(2, 8),
    destination,
    start_date,
    end_date,
    days: [
      { date: start_date, items: [{ id: "1", time: "09:00", title: `${destination} 市区漫步` }] },
      { date: new Date(Date.parse(start_date) + 86400000).toISOString().slice(0, 10), items: [{ id: "2", time: "10:00", title: "特色美食体验" }] },
      { date: end_date, items: [{ id: "3", time: "14:00", title: "返程" }] },
    ],
    markers: [
      { position: [116.397428, 39.90923], title: `${destination} 打卡点1` },
      { position: [116.384, 39.923], title: `${destination} 打卡点2` },
    ],
  };

  return NextResponse.json(data);
}