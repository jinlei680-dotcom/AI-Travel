"use client";
import { useState } from "react";
import Input from "@/components/Input";
import VoiceButton from "@/components/VoiceButton";
import { useRouter } from "next/navigation";

type PlanItem = { id: string; time?: string; title: string; note?: string };
type PlanDay = { date: string; items: PlanItem[] };
type PlanData = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: PlanDay[];
  markers?: { position: [number, number]; title?: string }[];
};

function parseSpecFromText(text: string) {
  const t = text.trim();
  const cities = [
    "北京","天津","上海","重庆","广州","深圳","杭州","苏州","南京","武汉","成都","西安","青岛","大连","沈阳","长春","哈尔滨","济南","郑州","佛山","宁波","无锡","厦门","福州","合肥","长沙","南昌","昆明","石家庄","太原","兰州","呼和浩特","南宁","贵阳","海口","三亚","西宁","银川","乌鲁木齐"
  ];
  let destination = "北京";
  for (const c of cities) { if (t.includes(c)) { destination = c; break; } }
  const mCity = t.match(/([\u4e00-\u9fa5]+)市/);
  if (mCity) destination = mCity[1];

  const mDates = Array.from(t.matchAll(/(20\d{2}-\d{2}-\d{2})/g)).map(m => m[1]);
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  let start = fmt(today);
  let end = fmt(new Date(today.getTime() + 2 * 86400000));
  if (mDates.length >= 2) { start = mDates[0]; end = mDates[1]; }
  else if (mDates.length === 1) { start = mDates[0]; const d1 = new Date(mDates[0]); end = fmt(new Date(d1.getTime() + 2 * 86400000)); }

  let pace: "relaxed" | "standard" | "intense" = "standard";
  if (/悠闲|轻松|休闲|慢/.test(t)) pace = "relaxed";
  if (/紧凑|高强度|赶场|多安排/.test(t)) pace = "intense";
  return { destination, start_date: start, end_date: end, preferences: { pace } };
}

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStart = async () => {
    const spec = parseSpecFromText(text);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "生成失败");
        throw new Error(msg || "生成失败");
      }
      const data: PlanData = await res.json();
      try { localStorage.setItem("lastPlan", JSON.stringify(data)); } catch {}
      router.push("/plan");
    } catch (e: any) {
      setError(e?.message || "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">AI 旅行助手</h1>
      <p className="mt-3 text-zinc-600">一个输入框，支持语音识别；点击开始规划。</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* 单输入框：语音按钮内嵌到输入框右侧 */}
      <div className="mt-6 relative">
        <Input
          placeholder="例如：下周在杭州安排一个轻松的三天行程"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="pr-12"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <VoiceButton onTranscribe={(t) => setText(t)} />
        </div>
      </div>

      <div className="mt-4">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          onClick={handleStart}
          disabled={loading || !text.trim()}
        >
          {loading ? "生成中..." : "开始规划"}
        </button>
      </div>
    </div>
  );
}
