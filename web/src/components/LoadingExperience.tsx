"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type Props = {
  title?: string;
  subtitle?: string;
  estimatedSeconds?: number;
  tips?: string[];
  steps?: string[];
  showCancel?: boolean;
  onCancel?: () => void;
};

const defaultSteps = [
  "分析目的地与偏好",
  "规划每日行程骨架",
  "估算交通与餐饮预算",
  "标注地图兴趣点",
  "润色细节并校验结构",
];

const defaultTips = [
  "可随时调整日期或预算，生成会自动适配",
  "更短日期通常返回更快，可先生成 1–2 天",
  "添加兴趣标签（美食/文化/自然）可提高匹配度",
  "若网络慢，可稍后在“最新生成行程”内查看结果",
  "生成完成后可在预算面板里查看费用汇总",
];

export default function LoadingExperience({ title = "正在为你生成行程", subtitle, estimatedSeconds = 60, tips = defaultTips, steps = defaultSteps, showCancel = false, onCancel }: Props) {
  const [progress, setProgress] = useState(5);
  const [stepIdx, setStepIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [hasLastPlan, setHasLastPlan] = useState(false);
  const startTs = useRef<number>(Date.now());

  const etaText = useMemo(() => {
    const elapsed = Math.floor((Date.now() - startTs.current) / 1000);
    const remain = Math.max(5, estimatedSeconds - elapsed);
    return `预计 ${remain}s 完成`;
  }, [estimatedSeconds, progress]);

  useEffect(() => {
    const t1 = setInterval(() => setProgress((p) => Math.min(99, p + Math.max(1, Math.round((100 - p) * 0.05)))), 1200);
    const t2 = setInterval(() => setStepIdx((i) => (i + 1) % steps.length), 3500);
    const t3 = setInterval(() => setTipIdx((i) => (i + 1) % tips.length), 4200);
    const t4 = setInterval(() => setElapsed(Math.floor((Date.now() - startTs.current) / 1000)), 1000);
    (async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return;
        const { data: rows } = await supabase
          .from("trip_plans")
          .select("id")
          .limit(1);
        setHasLastPlan(Array.isArray(rows) && rows.length > 0);
      } catch {}
    })();
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); };
  }, [steps.length, tips.length]);

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
            </div>
            {showCancel ? (
              <button className="text-sm text-zinc-500 hover:text-zinc-800" onClick={onCancel}>取消</button>
            ) : null}
          </div>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded bg-zinc-100">
              <div className="h-2 rounded bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>{steps[stepIdx]}</span>
              <span>已等待 {elapsed}s · {etaText}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Skeletons for day cards */}
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-md border border-zinc-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-100" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
              <span className="font-medium">提示：</span> {tips[tipIdx]}
            </div>
            <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">等候期间可做的事</span>
                {hasLastPlan ? (
                  <a href="/plan" className="text-blue-600 hover:underline text-xs">查看最近行程</a>
                ) : null}
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>试试语音输入构思下一个目的地</li>
                <li>准备你的预算或偏好标签（美食/文化/自然）</li>
                <li>若网络慢，可保持此页稍后返回查看</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
