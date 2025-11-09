"use client";
import React, { useEffect, useRef, useState } from "react";

type Marker = { position: [number, number]; title?: string };

type MapViewProps = {
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
  routePath?: [number, number][]; // 折线路径（lng,lat）数组
  className?: string;
};

export default function MapView({ center = [116.397428, 39.90923], zoom = 12, markers = [], routePath, className = "" }: MapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const mapRef = useRef<any>(null);

  // Lazy init: wait for AMap to be available even if script loads after render
  useEffect(() => {
    let timer: any;
    const tryInit = () => {
      const amap = (window as any).AMap;
      if (!amap || !ref.current) {
        setReady(false);
        return;
      }
      if (!mapRef.current) {
        setReady(true);
        mapRef.current = new amap.Map(ref.current, {
          zoom,
          center,
          viewMode: "2D",
        });
      }
      // update overlays
      try { mapRef.current.clearMap(); } catch {}
      markers.forEach((m) => {
        const marker = new amap.Marker({ position: m.position, title: m.title });
        mapRef.current.add(marker);
      });
      if (routePath && routePath.length >= 2) {
        const polyline = new amap.Polyline({
          path: routePath,
          strokeColor: "#2563eb",
          strokeWeight: 5,
          strokeOpacity: 0.9,
        });
        mapRef.current.add(polyline);
        try { mapRef.current.setFitView([polyline]); } catch {}
      } else {
        try { mapRef.current.setZoomAndCenter(zoom, center); } catch {}
      }
    };
    // attempt immediately and then poll briefly if not ready
    tryInit();
    if (!mapRef.current) {
      timer = setInterval(() => {
        tryInit();
        if (mapRef.current) clearInterval(timer);
      }, 200);
    }
    return () => {
      if (timer) clearInterval(timer);
      try { mapRef.current?.destroy?.(); } catch {}
      mapRef.current = null;
    };
  }, [center, zoom, markers, routePath]);

  return (
    <div className={["relative overflow-hidden rounded-xl border border-gray-200", className].join(" ")}
      style={{ height: "100%", width: "100%" }}
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          地图未加载，请配置 `NEXT_PUBLIC_AMAP_KEY`
        </div>
      )}
      <div ref={ref} className="w-full h-full" />
    </div>
  );
}