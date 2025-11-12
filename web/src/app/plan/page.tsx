"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";
import LoadingExperience from "@/components/LoadingExperience";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Input from "@/components/Input";
import BudgetPanel from "@/components/BudgetPanel";
import type { PlanDay } from "@/lib/itinerarySchema";
import { getSupabaseClient } from "@/lib/supabase";
import { savePlanToDatabase } from "@/lib/db";

function useRouteQuery(params: { origin?: string; destination?: string; type?: string; originCoord?: string; destinationCoord?: string; city?: string }) {
  const { origin = "北京站", destination = "天安门", type = "driving", originCoord = "116.4336,39.9024", destinationCoord = "116.3975,39.9087", city = "" } = params;
  const isValid = (s?: string) => !!s && /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(s);
  return useQuery({
    queryKey: ["route", origin, destination, originCoord, destinationCoord, type, city],
    queryFn: async () => {
      // 保险：若坐标无效则不发起请求（避免 400）
      if (!isValid(originCoord) || !isValid(destinationCoord)) return null;
      const u = new URL("/api/map/route", window.location.origin);
      u.searchParams.set("origin", originCoord);
      u.searchParams.set("destination", destinationCoord);
      u.searchParams.set("type", type);
      if (type === "transit" && city) u.searchParams.set("city", city);
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
    enabled: isValid(originCoord) && isValid(destinationCoord),
  });
}

// 已移除搜索地点与城市的显式UI；仍保留内部解析以支持语音与手动查询

type TripPlanRow = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_total: number | null;
  preferences: any | null;
  created_at: string;
};

export default function PlanPage() {
  const [origin, setOrigin] = useState("北京站");
  const [destination, setDestination] = useState("天安门");
  const [originCoord, setOriginCoord] = useState("116.4336,39.9024");
  const [destinationCoord, setDestinationCoord] = useState("116.3975,39.9087");
  const [type, setType] = useState("driving");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [highlightItemId, setHighlightItemId] = useState<string | null>(null);
  const [routeHint, setRouteHint] = useState<string>("");
  const [focusMarkers, setFocusMarkers] = useState<{ position: [number, number]; title?: string }[]>([]);
  const [filterText, setFilterText] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");
  const [showPrefs, setShowPrefs] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [destInput, setDestInput] = useState("");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [pace, setPace] = useState<"relaxed" | "standard" | "tight">("standard");
  const [interestsText, setInterestsText] = useState("");
  const [budgetInput, setBudgetInput] = useState<string>("");

  // 数据库中的用户行程记录列表与当前选中
  const [plans, setPlans] = useState<TripPlanRow[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // 页面展示的行程与预算来自数据库
  const [plan, setPlan] = useState<null | { destination: string; start_date: string; end_date: string; days: PlanDay[]; markers?: { position: [number, number]; title?: string }[]; source?: "llm" | "fallback" }>(null);
  const [displayBudgetTotal, setDisplayBudgetTotal] = useState<number | null>(null);

  // 删除旅行规划（联动删除 itinerary_items -> itinerary_days -> trip_plans）
  const handleDeletePlan = async (id: string) => {
    if (!id) return;
    if (!window.confirm("确认删除该旅行规划记录？该操作不可撤销。")) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) { setGenError("请先登录"); return; }
      // 删除关联的 items -> days -> plan
      const { data: days } = await supabase
        .from("itinerary_days")
        .select("id")
        .eq("trip_plan_id", id);
      const dayIds: string[] = (days || []).map((d: any) => d.id);
      if (dayIds.length) {
        await supabase.from("itinerary_items").delete().in("day_id", dayIds);
      }
      await supabase.from("itinerary_days").delete().eq("trip_plan_id", id);
      const { error: delErr } = await supabase.from("trip_plans").delete().eq("id", id);
      if (delErr) { setGenError(delErr.message); return; }
      setPlans((prev: TripPlanRow[]) => prev.filter((p: TripPlanRow) => String(p.id) !== String(id)));
      if (selectedPlanId === id) {
        setSelectedPlanId(null);
        // 清空用户最近选择记录
        await supabase
          .from("users")
          .update({ last_trip_plan_id: null })
          .eq("id", session.session.user.id);
      }
    } catch (e: any) {
      setGenError(e?.message || "删除失败");
    }
  };

  // 解析预算输入，支持 6000、6,000、6000元、约6000 等常见格式
  const parseBudgetInput = (s: string): number | null => {
    if (!s) return null;
    const trimmed = String(s).trim();
    const cleaned = trimmed
      .replace(/[,，]/g, "")
      .replace(/[元¥￥\s]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  // 载入用户的所有行程记录（侧栏）
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: rows, error } = await supabase
        .from("trip_plans")
        .select("id,destination,start_date,end_date,budget_total,preferences,created_at")
        .order("created_at", { ascending: false });
       if (!error && Array.isArray(rows)) {
         const list = rows as TripPlanRow[];
         setPlans(list);
         // 用数据库用户偏好恢复最近选中的行程；如果不存在则选最新一条
         let initialId: string | null = null;
         const { data: prefRow } = await supabase
           .from("users")
           .select("last_trip_plan_id")
           .eq("id", data.session.user.id)
           .single();
         const prefId = prefRow?.last_trip_plan_id ? String(prefRow.last_trip_plan_id) : null;
         if (prefId && list.some((p) => String(p.id) === prefId)) {
           initialId = prefId;
         } else if (list.length) {
           initialId = String(list[0].id);
         }
         if (initialId) setSelectedPlanId(initialId);
       }
    });
  }, []);

  // 根据 selectedPlanId 加载详情到 plan（优先 preferences.plan_raw，回退到 days/items 重组）
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !selectedPlanId) return;
    (async () => {
      const { data: row } = await supabase
        .from("trip_plans")
        .select("id,destination,start_date,end_date,budget_total,preferences")
        .eq("id", selectedPlanId)
        .single();
      if (!row) return;
      const tp = row as TripPlanRow;
      // 显示预算优先使用数据库值，保证“总预算”随记录变化
      setDisplayBudgetTotal(typeof tp.budget_total === "number" ? tp.budget_total : null);
      if (typeof tp.budget_total === "number") setBudgetInput(String(tp.budget_total));
      if (tp.preferences?.pace) setPace(tp.preferences.pace);
      if (Array.isArray(tp.preferences?.interests)) setInterestsText(tp.preferences.interests.join(", "));
      const raw = tp.preferences?.plan_raw;
      if (raw && raw.destination && Array.isArray(raw.days)) {
        setPlan({ destination: raw.destination, start_date: raw.start_date, end_date: raw.end_date, days: raw.days, markers: raw.markers, source: "llm" });
        return;
      }
      const { data: dayRows } = await supabase
        .from("itinerary_days")
        .select("id,date,day_index")
        .eq("trip_plan_id", tp.id)
        .order("day_index", { ascending: true });
      const days: any[] = [];
      for (const d of (dayRows || []) as any[]) {
        const { data: items } = await supabase
          .from("itinerary_items")
          .select("id,start_time,estimated_cost,notes")
          .eq("day_id", d.id)
          .order("start_time", { ascending: true });
        const mapped = (items || []).map((it: any, idx: number) => {
          const text = String(it?.notes || "行程项目");
          const m = text.match(/^\[(\d{2}:\d{2})\]\s*(.+)$/);
          const time = it?.start_time || (m ? m[1] : undefined);
          const title = m ? m[2] : text;
          return { id: String(it.id || `${d.id}-${idx}`), time: time || undefined, title, note: undefined, costEstimate: it?.estimated_cost ? Number(it.estimated_cost) : undefined };
        });
        days.push({ date: d.date, items: mapped });
      }
      setPlan({ destination: tp.destination, start_date: tp.start_date, end_date: tp.end_date, days });
    })();
  }, [selectedPlanId]);

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

  // 坐标校验与解析
  const isValidCoord = (s?: string) => {
    if (!s) return false;
    const m = s.match(/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/);
    return !!m;
  };
  const parseCoord = (s: string): { lng: number; lat: number } | null => {
    if (!isValidCoord(s)) return null;
    const [lngStr, latStr] = s.split(",").map(v => v.trim());
    const lng = Number(lngStr);
    const lat = Number(latStr);
    if (Number.isFinite(lng) && Number.isFinite(lat)) return { lng, lat };
    return null;
  };

  // 推断城市用于公交/地铁查询
  const deriveCity = (n: string) => {
    const cities = ["北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"];
    for (const c of cities) { if (n.includes(c)) return c; }
    const m = n.match(/([\u4e00-\u9fa5]+)市/);
    if (m) return m[1];
    return "";
  };
  const transitCity = type === "transit" ? (deriveCity(destination) || deriveCity(origin) || deriveCity(plan?.destination || "")) : "";

  const { data, isLoading, error, refetch } = useRouteQuery({ origin, destination, originCoord, destinationCoord, type, city: transitCity });

  const routePath = data?.polyline ?? [];
  const routePathSafe = useMemo(() => {
    return Array.isArray(routePath)
      ? routePath.filter((p: any) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]))
      : [];
  }, [routePath]);
  const planMarkers = useMemo(() => plan?.markers ?? [], [plan]);
  // 经过前端校验与纠偏后的标记
  const [validatedMarkers, setValidatedMarkers] = useState<{ position: [number, number]; title?: string }[]>([]);
  const markersToRender = focusMarkers.length ? focusMarkers : (validatedMarkers.length ? validatedMarkers : planMarkers);
  const center = focusMarkers.length
    ? focusMarkers[0].position
    : routePathSafe.length
    ? routePathSafe[0]
    : planMarkers.length
    ? planMarkers[0].position
    : [116.397428, 39.90923];

  // 计算两点间距离（米）
  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // m
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 根据名称查询坐标（优先限定城市范围）
  const queryPoiCoord = async (name: string) => {
    if (!name) return null;
    const cities = [
      "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"
    ];
    const extractCity = (n: string) => {
      for (const c of cities) { if ((plan?.destination || "").includes(c) || n.includes(c)) return c; }
      const m = n.match(/([\u4e00-\u9fa5]+)市/);
      if (m) return m[1];
      return (plan?.destination || "");
    };
    const city = extractCity(name || plan?.destination || "");
    try {
      const u = new URL("/api/map/search", window.location.origin);
      u.searchParams.set("query", name);
      if (city) u.searchParams.set("city", city);
      const resp = await fetch(u.toString());
      if (!resp.ok) return null;
      const jd = await resp.json().catch(() => null);
      const pois: any[] = jd?.pois || [];
      if (!pois.length) return null;
      const poi = pois[0];
      const lng = Number(poi.location?.lng);
      const lat = Number(poi.location?.lat);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { lat, lng, name: poi.name };
    } catch { return null; }
  };

  // 校验并纠偏坐标：若偏差较大或不合法，改用搜索结果
  const verifyAndCorrectCoord = async (name?: string, lat?: number, lng?: number) => {
    const fallback = async () => {
      const r = await queryPoiCoord(String(name || ""));
      return r ? { lat: r.lat, lng: r.lng, name: name || r.name } : { lat, lng, name };
    };
    if (!Number.isFinite(lat!) || !Number.isFinite(lng!)) return await fallback();
    const r = await queryPoiCoord(String(name || ""));
    if (!r) return { lat, lng, name };
    const dist = haversine(Number(lat), Number(lng), r.lat, r.lng);
    // 阈值：3km（同城内若超过则认为不准确）
    if (dist > 3000) return { lat: r.lat, lng: r.lng, name };
    return { lat, lng, name };
  };

  // 对后端 markers 做一次前端校验与纠偏
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const results: { position: [number, number]; title?: string }[] = [];
      for (const m of planMarkers.slice(0, 20)) {
        const [lng, lat] = m.position || [] as any;
        const v = await verifyAndCorrectCoord(m.title, lat, lng);
        const out: [number, number] = [Number(v.lng ?? lng), Number(v.lat ?? lat)];
        if (Number.isFinite(out[0]) && Number.isFinite(out[1])) {
          results.push({ position: out, title: m.title });
        }
      }
      if (!cancelled) setValidatedMarkers(results);
    };
    run();
    return () => { cancelled = true; };
  }, [planMarkers, plan?.destination]);

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

    // 不主动 refetch，等待坐标状态更新后由 useQuery 自动触发
  };

  // 根据经纬度在地图上定位并高亮
  const handleLocatePoint = async (lat: number, lng: number, title?: string) => {
    const fixed = await verifyAndCorrectCoord(title, lat, lng);
    if (!Number.isFinite(Number(fixed.lat)) || !Number.isFinite(Number(fixed.lng))) return;
    setFocusMarkers([{ position: [Number(fixed.lng), Number(fixed.lat)], title }]);
    // 清除路线以突出标记
    setOriginCoord("");
    setDestinationCoord("");
  };

  // 交换起点与终点（名称与坐标），并只保留两个端点标记
  const handleSwapEnds = () => {
    const oName = origin;
    const dName = destination;
    const oCoord = originCoord;
    const dCoord = destinationCoord;

    setOrigin(dName);
    setDestination(oName);
    setOriginCoord(dCoord);
    setDestinationCoord(oCoord);

    const po = parseCoord(dCoord);
    const pd = parseCoord(oCoord);
    if (po && pd) {
      setFocusMarkers([
        { position: [po.lng, po.lat], title: dName },
        { position: [pd.lng, pd.lat], title: oName },
      ]);
    } else {
      setFocusMarkers([]);
    }
  };

  // 根据名称解析坐标并定位（优先使用计划目的地作为城市范围）
  const locateByPlaceName = async (name: string) => {
    const extractCity = (n: string) => {
      const cities = [
        "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","贵阳","南宁","海口","唐山","保定"
      ];
      for (const c of cities) { if ((plan?.destination || "").includes(c) || n.includes(c)) return c; }
      const m = n.match(/([\u4e00-\u9fa5]+)市/);
      if (m) return m[1];
      return (plan?.destination || "");
    };
    const city = extractCity(name || plan?.destination || "");
    const u = new URL("/api/map/search", window.location.origin);
    u.searchParams.set("query", name);
    if (city) u.searchParams.set("city", city);
    const resp = await fetch(u.toString());
    if (!resp.ok) return;
    const jd = await resp.json().catch(() => null);
    const pois: any[] = jd?.pois || [];
    if (!pois.length) return;
    const poi = pois[0];
    const lng = Number(poi.location?.lng);
    const lat = Number(poi.location?.lat);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      handleLocatePoint(lat, lng, name);
    }
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
      const city = extractCity(name) || extractCity(plan?.destination || "");
      const u = new URL("/api/map/search", window.location.origin);
      u.searchParams.set("query", name);
      if (city) u.searchParams.set("city", city);
      const resp = await fetch(u.toString());
      if (!resp.ok) return null;
      const jd = await resp.json().catch(() => null);
      const pois: any[] = jd?.pois || [];
      if (!pois.length) return null;
      const norm = (s: string) => s.replace(/[\s()（）\-]/g, "").toLowerCase();
      const target = norm(name);
      const exact = pois.find((p: any) => norm(p.name) === target);
      if (exact) return { name, coord: `${exact.location.lng},${exact.location.lat}` };
      const byCity = city ? pois.find((p: any) => (p.cityname?.includes(city) || p.adname?.includes(city)) && norm(p.name).includes(target)) : null;
      const poi = byCity || pois[0];
      return { name, coord: `${poi.location.lng},${poi.location.lat}` };
    };

    // 1) 兼容手动输入“lng,lat”；否则按名称解析（带城市兜底）
    const originManual = parseCoord(origin);
    const destManual = parseCoord(destination);
    const nextOrigin = originManual ? `${originManual.lng},${originManual.lat}` : (await (async () => { const from = await resolvePoi(origin); if (from) { setOrigin(from.name); return from.coord; } return null; })());
    const nextDest = destManual ? `${destManual.lng},${destManual.lat}` : (await (async () => { const to = await resolvePoi(destination); if (to) { setDestination(to.name); return to.coord; } return null; })());

    if (!nextOrigin || !nextDest) {
      setRouteHint("未能解析完整的起点或终点，请输入更精确的名称或坐标（lng,lat）。");
      return;
    }

    // 批量更新坐标后由 useQuery 自动触发，并只标出起点与终点
    setOriginCoord(nextOrigin);
    setDestinationCoord(nextDest);
    const o = parseCoord(nextOrigin);
    const d = parseCoord(nextDest);
    if (o && d) {
      setFocusMarkers([
        { position: [o.lng, o.lat], title: origin },
        { position: [d.lng, d.lat], title: destination },
      ]);
    } else {
      setFocusMarkers([]);
    }
    setRouteHint("");
  };

  // 点击时间线条目：解析前后两点并在地图上绘制当天局部路线
  const handleItemClick = async (dayIndex: number, itemIndex: number) => {
    if (!plan || !plan.days[dayIndex]) return;
    setSelectedDay(dayIndex);
    const day = plan.days[dayIndex];
    const cur = day.items[itemIndex];
    setHighlightItemId(cur.id ?? null);

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
    const fromName = (prev as any)?.place?.name || prev?.title || (day.items[0] as any)?.place?.name || day.items[0]?.title || origin;
    const toName = (cur as any)?.place?.name || cur.title;
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
    // 不主动 refetch，等待坐标状态更新后由 useQuery 自动触发
  };

  return (
    <>
      {/* 悬浮抽屉：我的旅行规划记录（左侧与首页一致样式） */}
      <div className="fixed left-0 top-28 z-40 group">
        <div className="rounded-r bg-blue-600 text-white px-3 py-2 text-sm shadow-md cursor-pointer hover:bg-blue-700">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6zm1 3h10v11H7V7zm2 2v2h6V9H9z"/></svg>
            我的记录
          </span>
        </div>
        <div className="hidden group-hover:block mt-2">
          <Card title="我的旅行规划记录" className="w-80 shadow-lg border-blue-100">
            <div className="max-h-80 overflow-auto space-y-2">
              {plans.length === 0 && (
                <div className="text-sm text-zinc-500">暂无记录，登录后生成行程即可出现</div>
              )}
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={["w-full rounded border px-3 py-2 text-left text-sm", selectedPlanId === p.id ? "border-blue-500 bg-blue-50" : "border-zinc-200 hover:bg-zinc-50"].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={async () => {
                        const supabase = getSupabaseClient();
                        if (supabase) {
                          const { data } = await supabase.auth.getSession();
                          if (data.session) {
                            await supabase
                              .from("users")
                              .upsert({ id: data.session.user.id, last_trip_plan_id: p.id }, { onConflict: "id" });
                          }
                        }
                        setSelectedPlanId(p.id);
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-zinc-800">{p.destination}</div>
                      <div className="mt-1 text-xs text-zinc-600">{p.start_date} → {p.end_date}</div>
                    </button>
                    <button onClick={() => handleDeletePlan(String(p.id))} className="ml-2 text-xs text-red-600 hover:text-red-700">删除</button>
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500">{String(p.created_at).slice(0, 10)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
      {plan && (
        <Card title="最新生成行程" actions={<Button size="sm" variant="secondary" onClick={() => setShowPrefs(true)}>偏好与重新生成</Button>}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium flex items-center gap-2">
              <span>{plan.destination}</span>
              {plan.source === "fallback" ? (
                <Badge variant="warning" className="ml-1">使用兜底数据</Badge>
              ) : null}
            </div>
            <Badge variant="gray">{plan.start_date} → {plan.end_date}</Badge>
          </div>
          {/* 已移除顶部筛选控件以保持头部简洁 */}
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:min-h-[70vh] lg:items-stretch">
            {/* 左侧：日程导航（紧凑摘要） + 左下预算管理；侧栏记录改为悬浮抽屉 */}
            <div className="flex flex-col gap-2 h-full">
              {plan.days.map((d, di) => {
                const diningCount = Array.isArray(d.dining) ? d.dining.length : 0;
                const lodgingCount = Array.isArray(d.lodging) ? d.lodging.length : 0;
                const attractionCount = Array.isArray(d.attractions) ? d.attractions.length : 0;
                const transportShort = d.transport ? `${d.transport.mode || "-"} · ${typeof d.transport.timeEstimate === "number" ? `${Math.round(d.transport.timeEstimate)}m` : "--"} · ${typeof d.transport.priceEstimate === "number" ? `￥${Math.round(d.transport.priceEstimate)}` : "--"}` : "无交通信息";
                const previewItems = (d.items || [])
                  .slice(0, 2)
                  .map((it: any) => `${it.time ? it.time + " " : ""}${(it?.place?.name) || it.title}`)
                  .join(" · ");
                return (
                  <button key={d.date} className={["w-full mb-2 rounded border p-2 text-left", di === selectedDay ? "border-blue-500 bg-blue-50" : "border-zinc-200 hover:bg-zinc-50"].join(" ")}
                    onClick={() => setSelectedDay(di)}>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium">{d.date}</div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                        <span>🍽️{diningCount}</span>
                        <span>🏨{lodgingCount}</span>
                        <span>📍{attractionCount}</span>
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-600 truncate">{previewItems || "无活动预览"}</div>
                    <div className="mt-1 text-[11px] text-zinc-600">{transportShort}</div>
                  </button>
                );
              })}
              {/* 紧凑预算管理：默认展开，占据剩余空间 */}
              <div className="mt-2 rounded border border-zinc-200 bg-white/70 p-2 text-[12px] text-zinc-700 flex-1 flex flex-col">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-medium text-zinc-800">预算管理</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <BudgetPanel key={selectedPlanId || 'none'} planId={selectedPlanId} days={plan.days as any} initialTotalBudget={displayBudgetTotal} />
                </div>
              </div>
            </div>
            {/* 右侧：选中当天的详细信息（折叠集中显示） */}
            <div className="flex flex-col h-full">
              <Card title={`${plan.days[selectedDay]?.date || ""} 详细`} className="flex-1">
                {(() => {
                  const d = plan.days[selectedDay];
                  if (!d) return <div className="text-xs text-zinc-500">无当天数据</div>;
                  const matchText = (it: any) => {
                    const q = filterText.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      String((it?.place?.name || it.title || "")).toLowerCase().includes(q) ||
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
                    <div>
                      {/* 主要行程 */}
                      <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                        <div className="font-medium text-indigo-800 text-[13px]">主要行程</div>
                        {items.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {items.map((it: any, ii) => (
                              <li
                                key={it.id || `${d.date}-${ii}`}
                                className={[
                                  "cursor-pointer rounded px-2 py-1 text-xs",
                                  highlightItemId === it.id ? "bg-indigo-100 text-indigo-700" : "text-zinc-700 hover:bg-zinc-100",
                                ].join(" ")}
                                onClick={() => handleItemClick(selectedDay, ii)}
                              >
                                {it.time ? (
                                  <span className="mr-2 inline-flex items-center rounded border border-indigo-200 bg-white/80 px-2 py-0.5 text-[11px] text-indigo-700">
                                    {it.time}
                                  </span>
                                ) : null}
                                <span className="mr-1">{it?.place?.name ? "📍" : "📝"}</span>
                                {it?.place?.name || it.title}
                                {it.note ? <span className="ml-2 text-zinc-400">{it.note}</span> : null}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-1 text-[12px] text-indigo-700">该筛选下暂无活动</div>
                        )}
                      </div>
                      {/* 交通信息 */}
                      {d.transport && (
                        <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-[12px] text-zinc-700">
                          <div className="font-medium text-blue-800">交通</div>
                          <div className="mt-1">方式：{String(d.transport.mode || "").trim() || "-"}</div>
                          {Array.isArray(d.transport.steps) && d.transport.steps.length ? (
                            <div className="mt-1">步骤：{d.transport.steps.join("，")}</div>
                          ) : null}
                          <div className="mt-1">耗时：{typeof d.transport.timeEstimate === "number" ? `${Math.round(d.transport.timeEstimate)} 分钟` : "-"}</div>
                          <div className="mt-1">费用：{typeof d.transport.priceEstimate === "number" ? `${Math.round(d.transport.priceEstimate)} 元` : "-"}</div>
                        </div>
                      )}
                      {/* 餐饮列表 */}
                      {Array.isArray(d.dining) && d.dining.length ? (
                        <div className="mt-2 rounded-lg border border-orange-100 bg-orange-50/60 p-3 text-[12px] text-zinc-700">
                          <div className="font-medium text-orange-800">餐饮</div>
                          <ul className="mt-1 space-y-1">
                            {d.dining.map((r: any, idx: number) => (
                              <li
                                key={`${d.date}-dining-${idx}`}
                                className="flex items-center justify-start cursor-pointer hover:bg-zinc-100 px-1 rounded"
                                onClick={() => {
                                  if (r.location && typeof r.location.lat === "number" && typeof r.location.lng === "number") {
                                    handleLocatePoint(r.location.lat, r.location.lng, r.name);
                                  } else {
                                    locateByPlaceName(r.name);
                                  }
                                }}
                              >
                                <div>
                                  <span className="mr-1">🍽️</span><span className="text-zinc-800">{r.name}</span>
                                  {r.cuisine ? <span className="ml-2 text-zinc-500">{r.cuisine}</span> : null}
                                  {Array.isArray(r.priceRange) && r.priceRange.length === 2 ? (
                                    <span className="ml-2 text-zinc-600">￥{r.priceRange[0]}–{r.priceRange[1]}</span>
                                  ) : null}
                                  {typeof r.rating === "number" ? (
                                    <span className="ml-2 text-amber-600">评分 {r.rating}</span>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {/* 住宿列表 */}
                      {Array.isArray(d.lodging) && d.lodging.length ? (
                        <div className="mt-2 rounded-lg border border-purple-100 bg-purple-50/60 p-3 text-[12px] text-zinc-700">
                          <div className="font-medium text-purple-800">住宿</div>
                          <ul className="mt-1 space-y-1">
                            {d.lodging.map((h: any, idx: number) => (
                              <li
                                key={`${d.date}-lodging-${idx}`}
                                className="flex items-center justify-start cursor-pointer hover:bg-zinc-100 px-1 rounded"
                                onClick={() => {
                                  if (h.location && typeof h.location.lat === "number" && typeof h.location.lng === "number") {
                                    handleLocatePoint(h.location.lat, h.location.lng, h.name);
                                  } else {
                                    locateByPlaceName(h.name);
                                  }
                                }}
                              >
                                <div>
                                  <span className="mr-1">🏨</span><span className="text-zinc-800">{h.name}</span>
                                  {h.area ? <span className="ml-2 text-zinc-500">{h.area}</span> : null}
                                  {typeof h.price === "number" ? <span className="ml-2 text-zinc-600">￥{h.price}</span> : null}
                                  {typeof h.rating === "number" ? <span className="ml-2 text-amber-600">评分 {h.rating}</span> : null}
                                  {Array.isArray(h.amenities) && h.amenities.length ? (
                                    <span className="ml-2 text-zinc-500">{h.amenities.join("、")}</span>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {/* 景点列表 */}
                      {Array.isArray(d.attractions) && d.attractions.length ? (
                        <div className="mt-2 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-[12px] text-zinc-700">
                          <div className="font-medium text-emerald-800">景点</div>
                          <ul className="mt-1 space-y-1">
                            {d.attractions.map((a: any, idx: number) => (
                              <li
                                key={`${d.date}-attraction-${idx}`}
                                className="cursor-pointer hover:bg-zinc-100 px-1 rounded"
                                onClick={() => {
                                  if (a.location && typeof a.location.lat === "number" && typeof a.location.lng === "number") {
                                    handleLocatePoint(a.location.lat, a.location.lng, a.name);
                                  } else {
                                    locateByPlaceName(a.name);
                                  }
                                }}
                              >
                                <span className="mr-1">📍</span><span className="text-zinc-800">{a.name}</span>
                                {typeof a.ticket === "number" ? <span className="ml-2 text-zinc-600">门票 ￥{a.ticket}</span> : a.ticket ? <span className="ml-2 text-zinc-600">门票 {String(a.ticket)}</span> : null}
                                {a.best_time ? <span className="ml-2 text-zinc-500">最佳时段 {a.best_time}</span> : null}
                                {a.tips ? <span className="ml-2 text-zinc-500">{a.tips}</span> : null}
                                {Array.isArray(a.photo_spots) && a.photo_spots.length ? (
                                  <div className="mt-0.5 text-zinc-600">拍照点：{a.photo_spots.join("、")}</div>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <p className="mt-3 text-[11px] text-zinc-500">小提示：点击具体的地点会自动在地图中定位，支持一键导航。</p>
                    </div>
                  );
                })()}
              </Card>
            </div>
          </div>
        </Card>
      )}
      
      {error && <div className="text-red-600">{String((error as Error)?.message)}</div>}
      {isLoading && <div>加载中...</div>}
      <Card title={(
        <div className="flex items-center gap-2">
          <span>地图与路线</span>
          {(() => {
            const distM = Number((data as any)?.distance || 0);
            const durS = Number((data as any)?.duration || 0);
            const formatDist = (m: number) => {
              if (!Number.isFinite(m) || m <= 0) return null;
              if (m < 1000) return `${Math.round(m)} 米`;
              const km = m / 1000;
              const decimals = km >= 10 ? 0 : 1;
              return `${km.toFixed(decimals)} 公里`;
            };
            const formatDur = (s: number) => {
              if (!Number.isFinite(s) || s <= 0) return null;
              const mins = Math.round(s / 60);
              if (mins < 60) return `${mins} 分钟`;
              const h = Math.floor(mins / 60);
              const m = mins % 60;
              return m ? `${h} 小时 ${m} 分钟` : `${h} 小时`;
            };
            const dText = formatDist(distM);
            const tText = formatDur(durS);
            return (dText || tText) ? (
              <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-gray-100 text-gray-700 ring-gray-200">
                {dText || "--"} · {tText || "--"}
              </span>
            ) : null;
          })()}
        </div>
      )} actions={(
        <div className="flex items-center gap-2">
          <Input placeholder="起点" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-52" />
          <Input placeholder="终点" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-52" />
          <div className="hidden sm:flex items-center rounded-md border border-gray-200 bg-white shadow-sm">
            {(["driving","walking","transit"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setType(v)}
                className={["px-3 py-1.5 text-sm",
                  type===v ? "bg-indigo-600 text-white rounded-md" : "text-gray-700 hover:bg-gray-100"].join(" ")}
              >{v==="driving"?"驾车":v==="walking"?"步行":"公交地铁"}</button>
            ))}
          </div>
          <Button onClick={handleQueryRoute} size="sm">导航</Button>
          <Button onClick={handleSwapEnds} size="sm">切换起终点</Button>
          {/* 语音输入已移除 */}
          {routeHint && <div className="text-xs text-red-600">{routeHint}</div>}
        </div>
      )}>
        <div className="relative h-[520px] rounded-lg bg-gradient-to-br from-zinc-50 to-white">
          <MapView
            center={center as [number, number]}
            zoom={12}
            routePath={routePath}
            markers={markersToRender}
            segmentLabels={useMemo(() => {
              if (type !== "transit" || !data || !Array.isArray((data as any).segments)) return [];
              const segs: any[] = (data as any).segments;
              return segs
                .map((seg) => {
                  const pos = seg?.pos;
                  const dist = Math.round(Number(seg?.distance || 0));
                  const mins = Math.round(Number(seg?.duration || 0) / 60);
                  const head = seg?.kind === "walk" ? "步行" : seg?.kind === "bus" ? "公交" : seg?.kind === "rail" ? "地铁/铁路" : "换乘";
                  const tail = seg?.kind === "bus" || seg?.kind === "rail"
                    ? [seg?.name, [seg?.from, seg?.to].filter(Boolean).join(" → ")].filter(Boolean).join(" · ")
                    : seg?.name || "";
                  const text = [head, tail, `${dist}米`, `${mins}分钟`].filter(Boolean).join(" · ");
                  if (Array.isArray(pos) && Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
                    return { position: [pos[0], pos[1]] as [number, number], text };
                  }
                  return null;
                })
                .filter(Boolean) as { position: [number, number]; text: string }[];
            }, [type, data])}
          />
        </div>
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
            {(["relaxed","standard"] as const).map((p) => (
              <button key={p} onClick={() => setPace(p)} className={["rounded border px-2 py-1 text-xs", pace===p?"border-blue-500 bg-blue-50 text-blue-700":"border-zinc-300"].join(" ")}>{p==="relaxed"?"悠闲":"标准"}</button>
            ))}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <input className="border px-2 py-1 rounded w-full" placeholder="兴趣偏好（逗号分隔，如：美食, 博物馆, 徒步）" value={interestsText} onChange={(e) => setInterestsText(e.target.value)} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <input className="border px-2 py-1 rounded w-full" type="text" inputMode="numeric" placeholder="总预算（元）" value={budgetInput} onChange={(e) => { setBudgetInput(e.target.value); const v = parseBudgetInput(e.target.value); setDisplayBudgetTotal(typeof v === "number" ? v : null); }} />
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
                  const parsedBudget = parseBudgetInput(budgetInput);
                  const body = {
                    destination: destInput || destination,
                    start_date: startInput || plan?.start_date || "",
                    end_date: endInput || plan?.end_date || "",
                    preferences: { pace, ...(interests.length ? { interests } : {}), ...(typeof parsedBudget === "number" ? { budgetTotal: parsedBudget } : {}) },
                  };
                  const res = await fetch("/api/plan/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                  if (!res.ok) { const msg = await res.text().catch(() => "生成失败"); throw new Error(msg || "生成失败"); }
                  const data = await res.json();
                  setPlan(data);
                  // 保存到数据库并选中该记录（与首页生成逻辑保持一致）
                  try {
                    const budgetVal = typeof parsedBudget === "number" ? parsedBudget : null;
                    const saveRes = await savePlanToDatabase({
                      destination: body.destination,
                      start_date: body.start_date,
                      end_date: body.end_date,
                      days: data.days,
                      markers: data.markers,
                      budget_total: budgetVal,
                    });
                    if (saveRes?.tripPlanId) {
                      // 将新生成的行程记录为用户最近选择
                      try {
                        const supabase = getSupabaseClient();
                        if (supabase) {
                          const { data } = await supabase.auth.getSession();
                          if (data.session) {
                            await supabase
                              .from("users")
                              .upsert({ id: data.session.user.id, last_trip_plan_id: saveRes.tripPlanId }, { onConflict: "id" });
                          }
                        }
                      } catch {}
                      setSelectedPlanId(saveRes.tripPlanId);
                    }
                  } catch {}
                  // 刷新预算显示
                  if (typeof parsedBudget === "number") setDisplayBudgetTotal(parsedBudget);
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
      {generating ? (
        <LoadingExperience
          title="正在生成行程计划..."
          subtitle={`${(destInput || plan?.destination || destination) || ""}（${(startInput || plan?.start_date || "开始")} → ${(endInput || plan?.end_date || "结束")}）`}
          showCancel
          onCancel={() => setGenerating(false)}
        />
      ) : null}
    </div>
    </>
  );
}
