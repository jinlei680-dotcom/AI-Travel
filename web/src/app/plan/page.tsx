"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import VoiceButton from "@/components/VoiceButton";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

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
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [highlightItemId, setHighlightItemId] = useState<string | null>(null);
  const [focusMarkers, setFocusMarkers] = useState<{ position: [number, number]; title?: string }[]>([]);
  const [filterText, setFilterText] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");
  const [showPrefs, setShowPrefs] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [destInput, setDestInput] = useState("");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [pace, setPace] = useState<"relaxed" | "standard" | "intense">("standard");
  const [interestsText, setInterestsText] = useState("");

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
      const prefsRaw = localStorage.getItem("lastPrefs");
      if (prefsRaw) {
        const pj = JSON.parse(prefsRaw);
        if (pj?.pace) setPace(pj.pace);
        if (Array.isArray(pj?.interests)) setInterestsText(pj.interests.join(", "));
      }
    } catch {}
  }, []);

  useEffect(() => {
    // 行程更新时默认选中第 1 天并清空高亮
    setSelectedDay(0);
    setHighlightItemId(null);
    setFocusMarkers([]);
  }, [plan?.destination, plan?.start_date, plan?.end_date, plan?.days?.length]);

  useEffect(() => {
    if (showPrefs && plan) {
      setDestInput(plan.destination || "");
      setStartInput(plan.start_date || "");
      setEndInput(plan.end_date || "");
    }
  }, [showPrefs]);

  const { data, isLoading, error, refetch } = useRouteQuery({ origin, destination, originCoord, destinationCoord, type });

  const routePath = data?.polyline ?? [];
  const planMarkers = useMemo(() => plan?.markers ?? [], [plan]);
  const markersToRender = focusMarkers.length ? focusMarkers : planMarkers;
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

  // 点击时间线条目：解析前后两点并在地图上绘制当天局部路线
  const handleItemClick = async (dayIndex: number, itemIndex: number) => {
    if (!plan || !plan.days[dayIndex]) return;
    setSelectedDay(dayIndex);
    const day = plan.days[dayIndex];
    const cur = day.items[itemIndex];
    setHighlightItemId(cur.id);

    const extractCity = (n: string) => {
      const cities = [
        "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"
      ];
      for (const c of cities) { if ((plan?.destination || "").includes(c) || n.includes(c)) return c; }
      const m = n.match(/([\u4e00-\u9fa5]+)市/);
      if (m) return m[1];
      return "";
    };
    const resolvePoi = async (name: string) => {
      const city = extractCity(name || plan?.destination || "");
      const u = new URL("/api/map/search", window.location.origin);
      u.searchParams.set("query", name);
      if (city) u.searchParams.set("city", city);
      const resp = await fetch(u.toString());
      if (!resp.ok) return null;
      const jd = await resp.json().catch(() => null);
      const pois: any[] = jd?.pois || [];
      if (!pois.length) return null;
      const poi = pois[0];
      return { name, coord: `${poi.location.lng},${poi.location.lat}`, pos: [poi.location.lng, poi.location.lat] as [number, number] };
    };

    // 前一个点（若不存在则使用当天第一个或默认起点名）
    const prev = day.items[itemIndex - 1];
    const fromName = prev?.title || day.items[0]?.title || origin;
    const toName = cur.title;
    const from = await resolvePoi(fromName);
    const to = await resolvePoi(toName);
    if (!to) return;

    if (from) {
      setOrigin(from.name);
      setOriginCoord(from.coord);
    }
    setDestination(to.name);
    setDestinationCoord(to.coord);
    setType("walking");
    setFocusMarkers([
      from?.pos ? { position: from.pos, title: from.name } : undefined,
      to.pos ? { position: to.pos, title: to.name } : undefined,
    ].filter(Boolean) as { position: [number, number]; title?: string }[]);
    refetch();
  };

  return (
    <div className="p-4 space-y-4">
      {plan && (
        <Card title="最新生成行程" actions={<Button size="sm" variant="secondary" onClick={() => setShowPrefs(true)}>偏好与重新生成</Button>}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{plan.destination}</div>
            <Badge variant="gray">{plan.start_date} → {plan.end_date}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input className="border px-2 py-1 rounded text-sm" placeholder="搜索活动..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            <select className="border px-2 py-1 rounded text-sm" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as any)}>
              <option value="all">所有时段</option>
              <option value="morning">上午(00-12)</option>
              <option value="afternoon">午后(12-17)</option>
              <option value="evening">晚上(17-24)</option>
            </select>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              {plan.days.map((d, di) => {
                const matchText = (it: any) => {
                  const q = filterText.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    String(it.title || "").toLowerCase().includes(q) ||
                    String(it.note || "").toLowerCase().includes(q)
                  );
                };
                const matchTime = (it: any) => {
                  if (timeFilter === "all") return true;
                  const m = String(it.time || "").match(/^(\d{1,2}):(\d{2})/);
                  if (!m) return true;
                  const h = Number(m[1]);
                  if (timeFilter === "morning") return h < 12;
                  if (timeFilter === "afternoon") return h >= 12 && h < 17;
                  if (timeFilter === "evening") return h >= 17;
                  return true;
                };
                const items = d.items.filter((it) => matchText(it) && matchTime(it));
                return (
                  <div key={d.date} className={["mb-2 rounded border p-2", di === selectedDay ? "border-blue-400 bg-blue-50" : "border-zinc-200"].join(" ")}
                       onClick={() => setSelectedDay(di)}>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium">{d.date}</div>
                      {di === selectedDay && <div className="text-[10px] text-blue-600">点击具体条目预览路线</div>}
                    </div>
                    <ul className="mt-1 space-y-1">
                      {items.map((it, ii) => (
                        <li key={it.id} className={["cursor-pointer rounded px-1 py-0.5 text-xs", highlightItemId === it.id ? "bg-blue-100 text-blue-700" : "text-zinc-700 hover:bg-zinc-100"].join(" ")}
                            onClick={() => handleItemClick(di, ii)}>
                          {it.time ? <span className="mr-2 text-zinc-500">{it.time}</span> : null}
                          {it.title}
                          {it.note ? <span className="ml-2 text-zinc-400">{it.note}</span> : null}
                        </li>
                      ))}
                      {items.length === 0 && (
                        <li className="text-[12px] text-zinc-500">该筛选下暂无活动</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div>
              <MapView markers={markersToRender} className="h-[280px]" />
            </div>
          </div>
        </Card>
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
      <Card title="地图与路线">
        <div className="relative h-[480px]">
          <MapView center={center as [number, number]} zoom={12} routePath={routePath} markers={markersToRender} />
        </div>
        {data && (
          <div className="mt-3 text-sm text-gray-700">
            <div>距离：{Math.round(data.distance)} 米</div>
            <div>预计耗时：{Math.round(data.duration / 60)} 分钟</div>
          </div>
        )}
      </Card>
      {showPrefs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-md border border-zinc-200 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">偏好设置与重新生成</div>
              <button className="text-zinc-500 hover:text-zinc-700" onClick={() => setShowPrefs(false)}>关闭</button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className="border px-2 py-1 rounded" placeholder="目的地" value={destInput} onChange={(e) => setDestInput(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border px-2 py-1 rounded" type="date" value={startInput} onChange={(e) => setStartInput(e.target.value)} />
                <input className="border px-2 py-1 rounded" type="date" value={endInput} onChange={(e) => setEndInput(e.target.value)} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <div className="text-xs text-zinc-600 mb-1">行程节奏</div>
                <div className="flex gap-2">
                  {(["relaxed","standard","intense"] as const).map((p) => (
                    <button key={p} onClick={() => setPace(p)} className={["rounded border px-2 py-1 text-xs", pace===p?"border-blue-500 bg-blue-50 text-blue-700":"border-zinc-300"].join(" ")}>{p==="relaxed"?"悠闲":p==="standard"?"标准":"紧凑"}</button>
                  ))}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <input className="border px-2 py-1 rounded w-full" placeholder="兴趣偏好（逗号分隔，如：美食, 博物馆, 徒步）" value={interestsText} onChange={(e) => setInterestsText(e.target.value)} />
              </div>
            </div>
            {genError && <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">{genError}</div>}
            <div className="mt-3 flex justify-end gap-2">
              <button className="border px-3 py-1 rounded" onClick={() => setShowPrefs(false)}>取消</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50" onClick={async () => {
                setGenerating(true);
                setGenError(null);
                try {
                  const interests = interestsText.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
                  const body = {
                    destination: destInput || destination,
                    start_date: startInput || plan?.start_date || "",
                    end_date: endInput || plan?.end_date || "",
                    preferences: { pace, ...(interests.length ? { interests } : {}) },
                  };
                  const res = await fetch("/api/plan/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                  if (!res.ok) { const msg = await res.text().catch(() => "生成失败"); throw new Error(msg || "生成失败"); }
                  const data = await res.json();
                  setPlan(data);
                  try { localStorage.setItem("lastPlan", JSON.stringify(data)); localStorage.setItem("lastPrefs", JSON.stringify({ pace, interests })); } catch {}
                  setShowPrefs(false);
                } catch (e: any) {
                  setGenError(e?.message || "生成失败");
                } finally {
                  setGenerating(false);
                }
              }} disabled={generating}>{generating?"生成中...":"重新生成"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}