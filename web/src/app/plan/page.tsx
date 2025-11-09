"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "@/components/MapView";

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
      if (!res.ok) throw new Error("route api error");
      return res.json();
    },
    enabled: !!originCoord && !!destinationCoord,
  });
}

function useSearchQuery(params: { query?: string; city?: string }) {
  const { query = "", city = "北京" } = params;
  return useQuery({
    queryKey: ["search", query, city],
    queryFn: async () => {
      const u = new URL("/api/map/search", window.location.origin);
      u.searchParams.set("query", query);
      u.searchParams.set("city", city);
      const res = await fetch(u.toString());
      if (!res.ok) throw new Error("search api error");
      return res.json();
    },
    enabled: !!query,
  });
}

export default function PlanPage() {
  const [origin, setOrigin] = useState("北京站");
  const [destination, setDestination] = useState("天安门");
  const [originCoord, setOriginCoord] = useState("116.4336,39.9024");
  const [destinationCoord, setDestinationCoord] = useState("116.3975,39.9087");
  const [type, setType] = useState("driving");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("北京");

  const { data, isLoading, error, refetch } = useRouteQuery({ origin, destination, originCoord, destinationCoord, type });
  const { data: searchData, isLoading: searchLoading, error: searchError, refetch: refetchSearch } = useSearchQuery({ query, city });

  const routePath = data?.polyline ?? [];
  const center = routePath.length ? routePath[0] : [116.397428, 39.90923];
  const searchMarkers = (searchData?.pois ?? []).map((p: any) => ({ position: [p.location.lng, p.location.lat] as [number, number], title: p.name }));

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input className="border px-2 py-1" placeholder="起点" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <input className="border px-2 py-1" placeholder="终点" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <select className="border px-2 py-1" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="driving">驾车</option>
          <option value="walking">步行</option>
          <option value="bicycling">骑行</option>
        </select>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => refetch()}>查询路线</button>
      </div>
      <div className="flex gap-2 items-center">
        <input className="border px-2 py-1" placeholder="搜索地点" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input className="border px-2 py-1 w-28" placeholder="城市" value={city} onChange={(e) => setCity(e.target.value)} />
        <button className="bg-gray-700 text-white px-3 py-1 rounded" onClick={() => refetchSearch()}>搜索</button>
      </div>
      {error && <div className="text-red-600">{String((error as Error)?.message)}</div>}
      {isLoading && <div>加载中...</div>}
      {searchError && <div className="text-red-600">{String((searchError as Error)?.message)}</div>}
      {searchLoading && <div>搜索中...</div>}
      <div className="relative h-[480px] border rounded overflow-hidden">
        <MapView center={center as [number, number]} zoom={12} routePath={routePath} markers={searchMarkers} />
      </div>
      {data && (
        <div className="text-sm text-gray-700">
          <div>距离：{Math.round(data.distance)} 米</div>
          <div>预计耗时：{Math.round(data.duration / 60)} 分钟</div>
        </div>
      )}
      {searchData && (
        <div className="text-sm text-gray-700 space-y-1">
          <div className="font-medium">搜索结果（点击设置起点/终点）：</div>
          {(searchData.pois ?? []).slice(0, 10).map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between border-b py-1">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-500">{p.address ?? "-"}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 border rounded" onClick={() => { setOrigin(p.name); setOriginCoord(`${p.location.lng},${p.location.lat}`); }}>设为起点</button>
                <button className="px-2 py-1 border rounded" onClick={() => { setDestination(p.name); setDestinationCoord(`${p.location.lng},${p.location.lat}`); }}>设为终点</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}