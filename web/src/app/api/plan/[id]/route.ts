import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  // Placeholder data for demo and UI scaffold
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const start = fmt(today);
  const end = fmt(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000));

  const data = {
    id,
    destination: "示例城市",
    start_date: start,
    end_date: end,
    days: [
      { date: start, items: [{ id: "1", time: "09:00", title: "抵达与入住", note: "酒店办理入住" }] },
      { date: fmt(new Date(today.getTime() + 1 * 86400000)), items: [{ id: "2", time: "10:00", title: "城市地标参观" }] },
      { date: end, items: [{ id: "3", time: "14:00", title: "返程" }] },
    ],
    markers: [
      { position: [116.397428, 39.90923], title: "天安门" },
      { position: [116.384, 39.923], title: "故宫" },
    ],
  };

  return NextResponse.json(data);
}
