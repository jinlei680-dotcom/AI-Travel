"use client";
import React, { useEffect, useRef, useState } from "react";

type Marker = { position: [number, number]; title?: string };

type MapViewProps = {
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
  className?: string;
};

export default function MapView({ center = [116.397428, 39.90923], zoom = 12, markers = [], className = "" }: MapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const amap = (window as any).AMap;
    if (!amap || !ref.current) {
      setReady(false);
      return;
    }
    setReady(true);
    const map = new amap.Map(ref.current, {
      zoom,
      center,
      viewMode: "2D",
    });

    markers.forEach((m) => {
      const marker = new amap.Marker({ position: m.position, title: m.title });
      map.add(marker);
    });

    return () => {
      // AMap doesn't require explicit destroy for basic usage, but we can clear map.
      try {
        map?.destroy?.();
      } catch {}
    };
  }, [center, zoom, markers]);

  return (
    <div className={["relative overflow-hidden rounded-xl border border-gray-200", className].join(" ")}
      style={{ minHeight: 300 }}
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