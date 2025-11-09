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
    : "https://restapi.amap.com/v3/direction/driving";

  const params = new URLSearchParams({ key, origin: originParam, destination: destinationParam });
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

  if (type === "walking") {
    const route = data?.route;
    const path = route?.paths?.[0];
    distance = Number(path?.distance || 0);
    duration = Number(path?.duration || 0);
    const steps = path?.steps || [];
    steps.forEach((s: any) => {
      const pts = String(s.polyline || "").split(";").map((p) => p.split(",").map(Number));
      pts.forEach(([lng, lat]: number[]) => {
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) polyline.push([lng, lat]);
      });
    });
  } else if (type === "bicycling") {
    // v4 返回格式不同，尝试解析 path/steps
    const dataPaths = data?.data?.paths || [];
    const path = dataPaths[0];
    distance = Number(path?.distance || 0);
    duration = Number(path?.duration || 0);
    const steps = path?.steps || [];
    steps.forEach((s: any) => {
      const pts = String(s.polyline || "").split(";").map((p) => p.split(",").map(Number));
      pts.forEach(([lng, lat]: number[]) => {
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) polyline.push([lng, lat]);
      });
    });
  } else {
    const route = data?.route;
    const path = route?.paths?.[0];
    distance = Number(path?.distance || 0);
    duration = Number(path?.duration || 0);
    const steps = path?.steps || [];
    steps.forEach((s: any) => {
      const pts = String(s.polyline || "").split(";").map((p) => p.split(",").map(Number));
      pts.forEach(([lng, lat]: number[]) => {
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) polyline.push([lng, lat]);
      });
    });
  }

  return Response.json({ origin, destination, type, polyline, distance, duration });
}
