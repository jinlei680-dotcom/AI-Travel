function parsePoint(s?: string): [number, number] | null {
  if (!s) return null;
  const parts = s.split(",").map((v) => Number(v));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
  return [parts[0], parts[1]]; // [lng, lat]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const originStr = searchParams.get("origin") || "";
  const destinationStr = searchParams.get("destination") || "";
  const type = searchParams.get("type") || "driving";
  const city = (searchParams.get("city") || "").trim();

  const key = process.env.AMAP_WEBSERVICE_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "AMAP_WEBSERVICE_KEY not configured" }), { status: 500 });
  }

  const origin = parsePoint(originStr);
  const destination = parsePoint(destinationStr);
  if (!origin || !destination) {
    return new Response(JSON.stringify({ error: "origin/destination must be 'lng,lat'" }), { status: 400 });
  }

  const originParam = `${origin[0]},${origin[1]}`;
  const destinationParam = `${destination[0]},${destination[1]}`;

  // 选择对应的路径服务端点
  const endpoint = type === "walking"
    ? "https://restapi.amap.com/v3/direction/walking"
    : type === "bicycling"
    ? "https://restapi.amap.com/v4/direction/bicycling"
    : type === "transit"
    ? "https://restapi.amap.com/v3/direction/transit/integrated"
    : "https://restapi.amap.com/v3/direction/driving";

  const params = new URLSearchParams({ key, origin: originParam, destination: destinationParam });
  if (type === "transit" && city) params.set("city", city);
  const url = `${endpoint}?${params.toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    return new Response(JSON.stringify({ error: `amap http ${resp.status}` }), { status: 502 });
  }
  const data = await resp.json();

  // 解析返回数据，统一为 polyline、distance（米）、duration（秒）
  let polyline: [number, number][] = [];
  let distance = 0;
  let duration = 0;
  let segmentsOut: any[] = [];
  const pickMidPoint = (pts: [number, number][]): [number, number] | null => {
    if (!Array.isArray(pts) || pts.length === 0) return null;
    const mid = pts[Math.floor(pts.length / 2)];
    return Array.isArray(mid) && Number.isFinite(mid[0]) && Number.isFinite(mid[1]) ? mid : null;
  };

  // 将 "lng,lat;lng,lat;..." 安全解析为坐标数组；过滤无效/空点
  const safeParsePoints = (str?: string): [number, number][] => {
    if (!str) return [];
    return String(str)
      .split(";")
      .map((p) => p.split(",").map((v) => Number(v)))
      .filter((arr) => arr.length === 2 && Number.isFinite(arr[0]) && Number.isFinite(arr[1]))
      .map((arr) => [arr[0], arr[1]]);
  };

  if (type === "walking") {
    const route = data?.route;
    const path = route?.paths?.[0];
    distance = Number(path?.distance || 0);
    duration = Number(path?.duration || 0);
    const steps = path?.steps || [];
    steps.forEach((s: any) => {
      safeParsePoints(s.polyline).forEach(([lng, lat]) => polyline.push([lng, lat]));
    });
  } else if (type === "bicycling") {
    // v4 返回格式不同，尝试解析 path/steps
    const dataPaths = data?.data?.paths || [];
    const path = dataPaths[0];
    distance = Number(path?.distance || 0);
    duration = Number(path?.duration || 0);
    const steps = path?.steps || [];
    steps.forEach((s: any) => {
      safeParsePoints(s.polyline).forEach(([lng, lat]) => polyline.push([lng, lat]));
    });
  } else if (type === "transit") {
    // 公交/地铁综合换乘：解析 transits[0] 的 segments 中的步行与公交轨迹
    const route = data?.route;
    const transit = route?.transits?.[0];
    duration = Number(transit?.duration || 0);
    distance = Number(transit?.distance || 0);
    const segments = transit?.segments || [];
    segments.forEach((seg: any) => {
      const walkingSteps = seg?.walking?.steps || [];
      walkingSteps.forEach((s: any) => {
        const stepPts = safeParsePoints(s.polyline);
        stepPts.forEach(([lng, lat]) => polyline.push([lng, lat]));
        segmentsOut.push({
          kind: "walk",
          name: s?.road || "步行",
          distance: Number(s?.distance || 0),
          duration: Number(s?.duration || 0),
          pos: pickMidPoint(stepPts),
        });
      });
      const buslines = seg?.bus?.buslines || [];
      buslines.forEach((bl: any) => {
        const blPts = safeParsePoints(bl.polyline);
        blPts.forEach(([lng, lat]) => polyline.push([lng, lat]));
        segmentsOut.push({
          kind: "bus",
          name: bl?.name || "公交",
          distance: Number(bl?.distance || 0),
          duration: Number(bl?.duration || 0),
          from: bl?.departure_stop?.name || "",
          to: bl?.arrival_stop?.name || "",
          stations: Array.isArray(bl?.via_stops) ? bl.via_stops.length : Number(bl?.via_num || 0),
          pos: pickMidPoint(blPts),
        });
      });
      // 地铁通常也归于 buslines；若有 railwayPolyline 也尝试解析
      const railPts = safeParsePoints(seg?.railway?.railwayPolyline);
      railPts.forEach(([lng, lat]) => polyline.push([lng, lat]));
      if (seg?.railway) {
        const r = seg.railway;
        segmentsOut.push({
          kind: "rail",
          name: r?.name || "地铁/铁路",
          distance: Number(r?.distance || 0),
          duration: Number(r?.time || 0),
          from: r?.departure_station?.name || "",
          to: r?.arrival_station?.name || "",
          pos: pickMidPoint(railPts),
        });
      }
    });
  } else {
    const route = data?.route;
    const path = route?.paths?.[0];
    distance = Number(path?.distance || 0);
    duration = Number(path?.duration || 0);
    const steps = path?.steps || [];
    steps.forEach((s: any) => {
      safeParsePoints(s.polyline).forEach(([lng, lat]) => polyline.push([lng, lat]));
    });
  }

  return Response.json({ origin, destination, type, polyline, distance, duration, segments: segmentsOut });
}