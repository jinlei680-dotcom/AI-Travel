"use client";
import React, { useEffect, useRef, useState } from "react";

type Marker = { position: [number, number]; title?: string };
type SegmentLabel = { position: [number, number]; text: string };

type MapViewProps = {
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
  routePath?: [number, number][]; // 折线路径（lng,lat）数组
  segmentLabels?: SegmentLabel[]; // 公交/地铁分段标签（地图上直接显示）
  className?: string;
};

export default function MapView({ center = [116.397428, 39.90923], zoom = 12, markers = [], routePath, segmentLabels = [], className = "" }: MapViewProps) {
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
        // 始终在地图上展示地点名称（而不仅是鼠标悬停的 title）
        try {
          if (m.title) {
            // 优先使用 Marker 的内置 label，以确保在不同 SDK 版本下兼容
            if (typeof marker.setLabel === "function") {
              const offset = new amap.Pixel(0, -20);
              marker.setLabel({ content: String(m.title), direction: "top", offset });
            } else {
              // 退化为 Text 覆盖物
              const text = new amap.Text({
                text: String(m.title),
                position: m.position,
                style: {
                  background: "rgba(255,255,255,0.9)",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                  color: "#111827",
                },
                verticalAlign: "bottom",
                zIndex: 110,
              });
              mapRef.current.add(text);
            }
          }
        } catch {}
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

        // 直接在地图上标注各段信息
        segmentLabels.forEach((lab) => {
          if (!Array.isArray(lab.position)) return;
          const pos = lab.position;
          if (!Number.isFinite(pos[0]) || !Number.isFinite(pos[1])) return;
          try {
            const text = new amap.Text({
              text: String(lab.text),
              position: pos as any,
              style: {
                background: "rgba(255,255,255,0.95)",
                padding: "2px 6px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
                color: "#111827",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              },
              verticalAlign: "bottom",
              zIndex: 115,
            });
            mapRef.current.add(text);
          } catch {}
        });
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
  }, [center, zoom, markers, routePath, segmentLabels]);

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