"use client";
import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Card from "@/components/Card";
import VoiceButton from "@/components/VoiceButton";
import { useRouter } from "next/navigation";
import { savePlanToDatabase } from "@/lib/db";
import LoadingExperience from "@/components/LoadingExperience";
import { getSupabaseClient } from "@/lib/supabase";
import Button from "@/components/Button";

type PlanItem = { id: string; time?: string; title: string; note?: string };
type PlanDay = { date: string; items: PlanItem[] };
type PlanData = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: PlanDay[];
  markers?: { position: [number, number]; title?: string }[];
  source?: "llm" | "fallback";
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

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const toISO = (s: string) => {
    const x = s.trim();
    if (!x) return "";
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(x)) {
      const [y,m,d] = x.split("-");
      return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`;
    }
    const d1 = new Date(x);
    if (!isNaN(d1.getTime())) return fmt(d1);
    const mZh = x.match(/(?:(\d{4})年)?\s*(\d{1,2})月\s*(\d{1,2})[日号]?/);
    if (mZh) {
      const y = Number(mZh[1] || today.getFullYear());
      return `${y}-${pad2(Number(mZh[2]))}-${pad2(Number(mZh[3]))}`;
    }
    const m2 = x.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?$/);
    if (m2) {
      const y = m2[3] ? Number(m2[3].length === 2 ? `20${m2[3]}` : m2[3]) : today.getFullYear();
      return `${y}-${pad2(Number(m2[1]))}-${pad2(Number(m2[2]))}`;
    }
    return x.slice(0, 10);
  };

  // 提取日期范围（支持中文“到/至”、短横线、波浪线）
  let start = fmt(today);
  let end = fmt(new Date(today.getTime() + 2 * 86400000));
  const zhRange = t.match(/(?:(\d{4})年)?\s*(\d{1,2})月\s*(\d{1,2})[日号]?\s*(?:至|到|~|—|–|\-|到)\s*(?:(\d{4})年)?\s*(\d{1,2})月\s*(\d{1,2})[日号]?/);
  if (zhRange) {
    const sy = Number(zhRange[1] || today.getFullYear());
    const sm = pad2(Number(zhRange[2]));
    const sd = pad2(Number(zhRange[3]));
    const ey = Number(zhRange[4] || sy);
    const em = pad2(Number(zhRange[5]));
    const ed = pad2(Number(zhRange[6]));
    start = `${sy}-${sm}-${sd}`;
    end = `${ey}-${em}-${ed}`;
  } else {
    const isoMatches = Array.from(t.matchAll(/\b(20\d{2}-\d{1,2}-\d{1,2})\b/g)).map(m => toISO(m[1]));
    if (isoMatches.length >= 2) {
      start = isoMatches[0]; end = isoMatches[1];
    } else if (isoMatches.length === 1) {
      start = isoMatches[0]; const d1 = new Date(start); end = fmt(new Date(d1.getTime() + 2 * 86400000));
    } else {
      const compactMatches = Array.from(t.matchAll(/(\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?)/g)).map(m => toISO(m[1]));
      if (compactMatches.length >= 2) {
        start = compactMatches[0]; end = compactMatches[1];
      } else if (compactMatches.length === 1) {
        start = compactMatches[0]; const d1 = new Date(start); end = fmt(new Date(d1.getTime() + 2 * 86400000));
      }
    }
  }

  let pace: "relaxed" | "standard" = "standard";
  if (/悠闲|轻松|休闲|慢/.test(t)) pace = "relaxed";
  // 若用户输入“紧凑/高强度”等字样，仍按标准节奏处理
  // 预算提取（“预算5000元”、“预算：8000”、“¥6000”等）
  let budgetTotal: number | undefined = undefined;
  const mb = t.match(/预算[:：\s]*([\d,.]+)/) || t.match(/¥\s*([\d,.]+)/) || t.match(/([\d,.]+)\s*元/);
  if (mb) {
    const num = Number(String(mb[1]).replace(/[,]/g, ""));
    if (Number.isFinite(num) && num > 0) budgetTotal = num;
  }
  return { destination, start_date: start, end_date: end, preferences: { pace, ...(budgetTotal ? { budgetTotal } : {}) } };
}

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [plans, setPlans] = useState<Array<{ id: string; destination: string; start_date: string; end_date: string; created_at: string }>>([]);
  const router = useRouter();
  const subtitle = (() => {
    const s = parseSpecFromText(text || "");
    const d = s?.destination || "目的地";
    const sd = s?.start_date || "开始日期";
    const ed = s?.end_date || "结束日期";
    return `${d} · ${sd} → ${ed}`;
  })();

  const handleStart = async () => {
    const spec = parseSpecFromText(text);
    setLoading(true);
    setError(null);
    try {
      // 先检查登录状态
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase 环境变量未配置");
        setLoading(false);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setShowLoginPrompt(true);
        setLoading(false);
        return;
      }

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
      // 自动保存到数据库（前置已确保登录）
      try {
        const resSave = await savePlanToDatabase({
          destination: data.destination,
          start_date: data.start_date,
          end_date: data.end_date,
          days: data.days as any,
          markers: data.markers,
          budget_total: spec.preferences?.budgetTotal ?? null,
        });
        if (resSave?.tripPlanId) {
          // 写入用户最近选择的行程
          try {
            const supabase = getSupabaseClient();
            if (supabase) {
              const { data } = await supabase.auth.getSession();
              if (data.session) {
                await supabase
                  .from("users")
                  .upsert({ id: data.session.user.id, last_trip_plan_id: resSave.tripPlanId }, { onConflict: "id" });
              }
            }
          } catch {}
        }
        router.push("/plan");
      } catch (e) {
        // 保存失败依然进入本地行程查看页
        router.push("/plan");
      }
    } catch (e: any) {
      setError(e?.message || "生成失败");
    } finally {
      setLoading(false);
    }
  };

  // 加载用户的旅行计划记录（首页侧栏）
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: rows, error } = await supabase
        .from("trip_plans")
        .select("id,destination,start_date,end_date,created_at")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(rows)) {
        setPlans(rows as any[]);
      }
    });
  }, []);

  // 删除旅行规划（联动删除 itinerary_items -> itinerary_days -> trip_plans）
  const handleDeletePlan = async (id: string) => {
    if (!id) return;
    if (!window.confirm("确认删除该旅行规划记录？该操作不可撤销。")) return;
    const supabase = getSupabaseClient();
    if (!supabase) { setError("Supabase 未初始化"); return; }
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) { setError("请先登录"); return; }
      const { data: days, error: dayErr } = await supabase
        .from("itinerary_days")
        .select("id")
        .eq("trip_plan_id", id);
      if (dayErr) { setError(dayErr.message); return; }
      const dayIds = (days || []).map((d: any) => d.id);
      if (dayIds.length) {
        const { error: delItemsErr } = await supabase
          .from("itinerary_items")
          .delete()
          .in("day_id", dayIds);
        if (delItemsErr) { setError(delItemsErr.message); return; }
      }
      const { error: delDaysErr } = await supabase
        .from("itinerary_days")
        .delete()
        .eq("trip_plan_id", id);
      if (delDaysErr) { setError(delDaysErr.message); return; }
      const { error: delPlanErr } = await supabase
        .from("trip_plans")
        .delete()
        .eq("id", id);
      if (delPlanErr) { setError(delPlanErr.message); return; }

      // 本地移除，同时如果删除的是最近选择则清空数据库偏好
      setPlans((prev) => prev.filter((p) => String(p.id) !== String(id)));
      try {
        const supabase2 = getSupabaseClient();
        if (supabase2) {
          const { data } = await supabase2.auth.getSession();
          if (data.session) {
            await supabase2
              .from("users")
              .update({ last_trip_plan_id: null })
              .eq("id", data.session.user.id);
          }
        }
      } catch {}
    } catch (e: any) {
      setError(e?.message || "删除失败");
    }
  };

  return (
    <>
      {/* 悬浮抽屉：我的旅行规划记录（左侧统一样式） */}
      <div className="fixed left-0 top-28 z-40 group">
        <div className="rounded-r bg-blue-600 text-white px-3 py-2 text-sm shadow-md cursor-pointer hover:bg-blue-700">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6zm1 3h10v11H7V7zm2 2v2h6V9H9z"/></svg>
            我的记录
          </span>
        </div>
        <div className="hidden group-hover:block mt-2">
          <Card title="我的旅行规划记录" className="w-80 shadow-lg border-blue-100">
            <div className="max-h-80 overflow-auto space-y-2">
              {plans.length === 0 && (
                <div className="text-sm text-zinc-500">暂无记录，登录后生成行程即可出现</div>
              )}
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="w-full rounded border px-3 py-2 text-left text-sm border-zinc-200 hover:bg-zinc-50"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={async () => {
                        try {
                          const supabase = getSupabaseClient();
                          if (supabase) {
                            const { data } = await supabase.auth.getSession();
                            if (data.session) {
                              await supabase
                                .from("users")
                                .upsert({ id: data.session.user.id, last_trip_plan_id: p.id }, { onConflict: "id" });
                            }
                          }
                        } catch {}
                        router.push("/plan");
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-zinc-800">{p.destination}</div>
                      <div className="mt-1 text-xs text-zinc-600">{p.start_date} → {p.end_date}</div>
                    </button>
                    <button
                      onClick={() => handleDeletePlan(String(p.id))}
                      className="ml-2 text-xs text-red-600 hover:text-red-700"
                      aria-label="删除旅行规划"
                    >
                      删除
                    </button>
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500">{String(p.created_at).slice(0, 10)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 原首页内容：居中展示输入对话框（略微上移） */}
      <div className="mx-auto max-w-3xl px-4 min-h-screen flex flex-col items-center justify-center text-center mt-[-48px]">
      {loading ? <LoadingExperience title="正在为你生成行程" subtitle={subtitle} estimatedSeconds={120} /> : null}
      <h1 className="text-2xl font-semibold">AI 旅行助手</h1>
      <p className="mt-3 text-zinc-600">一个输入框，支持语音识别；点击开始规划。</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* 单输入框：语音按钮内嵌到输入框右侧 */}
      <div className="mt-6 relative w-full">
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
          开始规划
        </button>
      </div>
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="text-lg font-semibold">请先登录</div>
            <p className="mt-2 text-sm text-zinc-600">登录后才能进行行程规划并自动保存到数据库。</p>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>取消</Button>
              <Button onClick={() => router.push("/login")}>前往登录</Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
