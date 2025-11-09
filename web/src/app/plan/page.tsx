"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import VoiceButton from "@/components/VoiceButton";

function useRouteQuery(params: { origin?: string; destination?: string; type?: string; originCoord?: string; destinationCoord?: string }) {
  const { origin = "北京站", destination = "天安门", type = "driving", originCoord = "116.4336,39.9024", destinationCoord = "116.3975,39.9087" } = params;
  return useQuery({
    queryKey: ["route", origin, destination, originCoord, destinationCoord, type],
    queryFn: async () => {
      const u = new URL("/api/map/route", window.location.origin);
      u.searchParams.set("origin", originCoord);
      u.searchParams.set("destination", destinationCoord);
      u.searchParams.set("type", type);
      const res = await fetch(u.toString());
      if (res.status === 501) {
        // 后端未配置 AMAP_WEBSERVICE_KEY 时返回 501，占位忽略错误以避免打断页面
        return null;
      }
      if (!res.ok) {
        const msg = await res.text().catch(() => "route api error");
        throw new Error(msg || "route api error");
      }
      return res.json();
    },
    enabled: !!originCoord && !!destinationCoord,
  });
}

// 已移除搜索地点与城市的显式UI；仍保留内部解析以支持语音与手动查询

export default function PlanPage() {
  const [origin, setOrigin] = useState("北京站");
  const [destination, setDestination] = useState("天安门");
  const [originCoord, setOriginCoord] = useState("116.4336,39.9024");
  const [destinationCoord, setDestinationCoord] = useState("116.3975,39.9087");
  const [type, setType] = useState("driving");

  // 主页生成的行程数据（localStorage 注入）
  type PlanItem = { id: string; time?: string; title: string; note?: string };
  type PlanDay = { date: string; items: PlanItem[] };
  const [plan, setPlan] = useState<null | { destination: string; start_date: string; end_date: string; days: PlanDay[]; markers?: { position: [number, number]; title?: string }[] }>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastPlan");
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.destination && obj.days) setPlan(obj);
      }
    } catch {}
  }, []);

  const { data, isLoading, error, refetch } = useRouteQuery({ origin, destination, originCoord, destinationCoord, type });

  const routePath = data?.polyline ?? [];
  const planMarkers = useMemo(() => plan?.markers ?? [], [plan]);
  const center = routePath.length
    ? routePath[0]
    : planMarkers.length
    ? planMarkers[0].position
    : [116.397428, 39.90923];

  // 解析“从xxx到xxx”并生成路线
  const handleTranscribe = async (text: string) => {
    // 清理换行/多余空格/句末标点，并解析“从xxx到xxx”
    const cleaned = String(text)
      .replace(/[\n\r]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[，,。.!！?？]+$/g, "")
      .trim();
    const m = cleaned.match(/从\s*(.+?)\s*到\s*(.+)$/);
    if (!m) {
      // 不匹配则忽略
      return;
    }
    const fromName = m[1].trim();
    const toName = m[2].trim();

    const extractCity = (n: string) => {
      const cities = [
        "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"
      ];
      for (const c of cities) {
        if (n.includes(c)) return c;
      }
      const m = n.match(/([\u4e00-\u9fa5]+)市/);
      if (m) return m[1];
      return "";
    };
    const resolvePoi = async (name: string) => {
      const city = extractCity(name);
      const u = new URL("/api/map/search", window.location.origin);
      u.searchParams.set("query", name);
      if (city) u.searchParams.set("city", city);
      const resp = await fetch(u.toString());
      if (!resp.ok) return null;
      const jd = await resp.json().catch(() => null);
      const pois: any[] = jd?.pois || [];
      if (!pois.length) return null;
      const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
      const target = norm(name);
      const exact = pois.find((p: any) => norm(p.name) === target);
      if (exact) return { name, coord: `${exact.location.lng},${exact.location.lat}` };
      const byCity = city ? pois.find((p: any) => (p.cityname?.includes(city) || p.adname?.includes(city)) && norm(p.name).includes(target)) : null;
      const poi = byCity || pois[0];
      return { name, coord: `${poi.location.lng},${poi.location.lat}` };
    };

    // 先把左侧输入同步为语音文本
    setOrigin(fromName);
    setDestination(toName);
    const from = await resolvePoi(fromName);
    const to = await resolvePoi(toName);

    if (from) setOriginCoord(from.coord);
    if (to) setDestinationCoord(to.coord);

    // 触发路线查询
    refetch();
  };

  // 手动查询按钮：若坐标未与名称匹配，则自动解析坐标
  const handleQueryRoute = async () => {
    const extractCity = (n: string) => {
      const cities = [
        "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"
      ];
      for (const c of cities) {
        if (n.includes(c)) return c;
      }
      const m = n.match(/([\u4e00-\u9fa5]+)市/);
      if (m) return m[1];
      return "";
    };
    const resolvePoi = async (name: string) => {
      const city = extractCity(name);
      const u = new URL("/api/map/search", window.location.origin);
      u.searchParams.set("query", name);
      if (city) u.searchParams.set("city", city);
      const resp = await fetch(u.toString());
      if (!resp.ok) return null;
      const jd = await resp.json().catch(() => null);
      const pois: any[] = jd?.pois || [];
      if (!pois.length) return null;
      const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
      const target = norm(name);
      const exact = pois.find((p: any) => norm(p.name) === target);
      if (exact) return { name, coord: `${exact.location.lng},${exact.location.lat}` };
      const byCity = city ? pois.find((p: any) => (p.cityname?.includes(city) || p.adname?.includes(city)) && norm(p.name).includes(target)) : null;
      const poi = byCity || pois[0];
      return { name, coord: `${poi.location.lng},${poi.location.lat}` };
    };

    // 若坐标仍是默认或未更新，则尝试用名称解析
    if (!originCoord || originCoord === "116.4336,39.9024") {
      const from = await resolvePoi(origin);
      if (from) { setOrigin(from.name); setOriginCoord(from.coord); }
    }
    if (!destinationCoord || destinationCoord === "116.3975,39.9087") {
      const to = await resolvePoi(destination);
      if (to) { setDestination(to.name); setDestinationCoord(to.coord); }
    }

    refetch();
  };

  return (
    <div className="p-4 space-y-4">
      {plan && (
        <div className="rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">最新生成行程：{plan.destination}</div>
            <div className="text-xs text-zinc-500">{plan.start_date} → {plan.end_date}</div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              {plan.days.map((d) => (
                <div key={d.date} className="mb-2 rounded border border-zinc-200 p-2">
                  <div className="text-xs font-medium">{d.date}</div>
                  <ul className="mt-1 space-y-1">
                    {d.items.map((it) => (
                      <li key={it.id} className="text-xs text-zinc-700">
                        {it.time ? <span className="mr-2 text-zinc-500">{it.time}</span> : null}
                        {it.title}
                        {it.note ? <span className="ml-2 text-zinc-400">{it.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              <MapView markers={planMarkers} className="h-[280px]" />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <input className="border px-2 py-1" placeholder="起点" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <input className="border px-2 py-1" placeholder="终点" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <select className="border px-2 py-1" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="driving">驾车</option>
          <option value="walking">步行</option>
          <option value="bicycling">骑行</option>
        </select>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleQueryRoute}>查询路线</button>
        <VoiceButton onTranscribe={handleTranscribe} />
      </div>
      {error && <div className="text-red-600">{String((error as Error)?.message)}</div>}
      {isLoading && <div>加载中...</div>}
      <div className="relative h-[480px] border rounded overflow-hidden">
        <MapView center={center as [number, number]} zoom={12} routePath={routePath} markers={planMarkers} />
      </div>
      {data && (
        <div className="text-sm text-gray-700">
          <div>距离：{Math.round(data.distance)} 米</div>
          <div>预计耗时：{Math.round(data.duration / 60)} 分钟</div>
        </div>
      )}
    </div>
  );
}