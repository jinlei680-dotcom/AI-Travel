"use client";
import React, { useEffect, useState } from "react";

export default function BeijingPlanDebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        const res = await fetch("/api/plan/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination: "北京",
            start_date: "2025-11-20",
            end_date: "2025-11-21",
            preferences: {
              budgetTotal: 6000,
              partySize: 2,
            },
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || "请求失败");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>北京 · 2人 · 2天 · 预算6000 — 接口返回</h1>
      {loading && <div>正在生成，请稍候（约需 1–2 分钟）…</div>}
      {error && (
        <pre style={{ color: "red", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{error}</pre>
      )}
      {data && (
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}