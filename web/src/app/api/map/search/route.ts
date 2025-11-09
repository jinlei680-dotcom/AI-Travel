export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("query") || "").trim();
  const city = (searchParams.get("city") || "").trim();
  const key = process.env.AMAP_WEBSERVICE_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "AMAP_WEBSERVICE_KEY not configured" }), { status: 500 });
  }

  if (!q) {
    return Response.json({ q, city, pois: [] });
  }

  const params = new URLSearchParams({
    key,
    keywords: q,
    ...(city ? { city } : {}),
    citylimit: "true",
    offset: "20",
  });
  const url = `https://restapi.amap.com/v3/place/text?${params.toString()}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    return new Response(JSON.stringify({ error: `amap http ${resp.status}` }), { status: 502 });
  }
  const data = await resp.json();
  const pois = (data?.pois || []).map((p: any) => {
    const [lngStr, latStr] = String(p.location || "").split(",");
    const lng = Number(lngStr);
    const lat = Number(latStr);
    return {
      id: p.id,
      name: p.name,
      location: { lng, lat },
      address: p.address || p.adname || "",
      type: p.type || p.typecode || "",
    };
  });

  return Response.json({ q, city, pois });
}