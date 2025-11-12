"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { parseAmountFromText, detectCategory } from "../lib/amount";
import VoiceButton from "@/components/VoiceButton";

type PriceRange = [number, number];
type DiningItem = { name: string; priceRange?: PriceRange };
type LodgingItem = { name: string; price?: number };
type TransportSummary = { mode?: string; timeEstimate?: number; priceEstimate?: number };
type AttractionItem = { name: string; ticket?: number | string };
type PlanItem = { id: string; time?: string; title: string; note?: string; costEstimate?: number };
type PlanDay = {
  date: string;
  items: PlanItem[];
  dining?: DiningItem[];
  lodging?: LodgingItem[];
  transport?: TransportSummary;
  attractions?: AttractionItem[];
};

type BudgetPanelProps = {
  days: PlanDay[];
  initialTotalBudget?: number | null;
  planId: string | null;
};

function avgPrice(range?: PriceRange): number {
  if (!range || range.length !== 2) return 0;
  const a = Number(range[0]);
  const b = Number(range[1]);
  // 预算趋近上限：按区间上限估算餐饮支出，以更贴近实际预算
  if (Number.isFinite(a) && Number.isFinite(b)) return Math.max(a, b);
  return 0;
}

function ticketToNumber(t?: number | string): number {
  if (t == null) return 0;
  if (typeof t === "number" && Number.isFinite(t)) return t;
  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
}

export default function BudgetPanel({ days, initialTotalBudget, planId }: BudgetPanelProps) {
  useEffect(() => {
    console.log("[BudgetPanel] mounted");
    return () => console.log("[BudgetPanel] unmounted");
  }, []);
  const [totalBudget, setTotalBudget] = useState<number | null>(
    typeof initialTotalBudget === "number" ? initialTotalBudget : null
  );
  const [mode, setMode] = useState<"overview" | "expense">("expense");
  const [amountInput, setAmountInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("其他");
  const [noteInput, setNoteInput] = useState<string>("");
  const [parseText, setParseText] = useState<string>("");
  const [expenses, setExpenses] = useState<{ id: string; amount: number; category: string; note?: string; dateISO: string }[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 当父组件传入的初始总预算发生变化时，优先采用该值
  useEffect(() => {
    // 仅根据 props 更新总预算，不再读取本地存储
    if (typeof initialTotalBudget === "number") {
      setTotalBudget(initialTotalBudget);
    } else {
      setTotalBudget(null);
    }
  }, [initialTotalBudget]);

  // 读取当前计划的记账记录（数据库）
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !planId) { setExpenses([]); return; }
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) { setExpenses([]); return; }
      const { data, error } = await supabase
        .from("expenses")
        .select("id,amount,currency,category,note,created_at")
        .eq("trip_plan_id", planId)
        .order("created_at", { ascending: false });
      if (error) {
        setSaveError(error.message);
        setExpenses([]);
        return;
      }
      const mapped = (data || []).map((e: any) => ({ id: String(e.id), amount: Number(e.amount) || 0, category: dbCategoryToLabel(String(e.category || "misc")), note: e.note || undefined, dateISO: e.created_at || new Date().toISOString() }));
      setExpenses(mapped);
    })();
  }, [planId]);

  // 类别映射：中文 -> 数据库枚举
  const labelToDbCategory = (label: string): string => {
    switch ((label || "").trim()) {
      case "交通": return "transport";
      case "餐饮": return "food";
      case "住宿": return "hotel";
      case "门票": return "ticket";
      case "购物": return "shopping";
      case "活动": return "misc";
      case "其他": return "misc";
      default: return "misc";
    }
  };
  const dbCategoryToLabel = (cat: string): string => {
    switch ((cat || "").trim()) {
      case "transport": return "交通";
      case "food": return "餐饮";
      case "hotel": return "住宿";
      case "ticket": return "门票";
      case "shopping": return "购物";
      default: return "其他";
    }
  };

  const addExpense = async (amt: number, catLabel: string, note?: string, source: "manual" | "text" = "manual") => {
    if (!Number.isFinite(amt) || amt <= 0) { setSaveError("请输入有效金额"); return; }
    if (!planId) { setSaveError("缺少计划 ID，无法保存"); return; }
    const supabase = getSupabaseClient();
    if (!supabase) { setSaveError("Supabase 未初始化"); return; }
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) { setSaveError("请先登录"); return; }
    setSaveError(null);
    const dbCat = labelToDbCategory(catLabel || "其他");
    const { data, error } = await supabase
      .from("expenses")
      .insert({ trip_plan_id: planId, amount: Math.round(amt), currency: "CNY", category: dbCat, note: note || null, source })
      .select("id,amount,category,note,created_at")
      .single();
    if (error) { setSaveError(error.message); return; }
    const item = { id: String(data.id), amount: Number(data.amount) || Math.round(amt), category: dbCategoryToLabel(String(data.category || dbCat)), note: data.note || note, dateISO: data.created_at || new Date().toISOString() };
    setExpenses((prev) => [item, ...prev]);
  };

  const { byDay, totals } = useMemo(() => {
    const byDay: { date: string; transport: number; dining: number; lodging: number; tickets: number; activities: number; total: number }[] = [];
    let transport = 0, dining = 0, lodging = 0, tickets = 0, activities = 0;
    for (const d of days || []) {
      const t = Number(d.transport?.priceEstimate) || 0;
      const dine = (d.dining || []).reduce((s, it) => s + avgPrice(it.priceRange), 0);
      const lodge = (d.lodging || []).reduce((s, it) => s + (Number(it.price) || 0), 0);
      const tick = (d.attractions || []).reduce((s, it) => s + ticketToNumber(it.ticket), 0);
      const act = (d.items || []).reduce((s, it) => s + (Number(it.costEstimate) || 0), 0);
      const total = t + dine + lodge + tick + act;
      byDay.push({ date: d.date, transport: t, dining: dine, lodging: lodge, tickets: tick, activities: act, total });
      transport += t; dining += dine; lodging += lodge; tickets += tick; activities += act;
    }
    const grand = transport + dining + lodging + tickets + activities;
    return { byDay, totals: { transport, dining, lodging, tickets, activities, grand } };
  }, [days]);

  const maxCategory = Math.max(1, totals.grand, totals.transport, totals.dining, totals.lodging, totals.tickets, totals.activities);
  const expenseTotals = useMemo(() => {
    const group: Record<string, number> = {};
    let sum = 0;
    for (const e of expenses) { group[e.category] = (group[e.category] || 0) + e.amount; sum += e.amount; }
    return { group, sum };
  }, [expenses]);

  const balance = typeof totalBudget === 'number' ? Math.round(totalBudget - expenseTotals.sum) : null;

  // 使用 VoiceButton 进行语音识别，实时写入 parseText

  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">预算管理</div>
        {typeof totalBudget === "number" ? (
          <div className="text-xs text-zinc-600">总预算：<span className="font-semibold text-zinc-900">¥{Math.round(totalBudget)}</span></div>
        ) : (
          <div className="text-xs text-zinc-500">未设置总预算（偏好中可设置）</div>
        )}
      </div>

      {/* 视图切换按钮 */}
      <div className="mt-2 flex gap-2">
        <button onClick={() => setMode("overview")} className={["rounded border px-2 py-1 text-xs", mode==="overview"?"border-blue-500 bg-blue-50 text-blue-700":"border-zinc-300"].join(" ")}>估算</button>
        <button onClick={() => setMode("expense")} className={["rounded border px-2 py-1 text-xs", mode==="expense"?"border-blue-500 bg-blue-50 text-blue-700":"border-zinc-300"].join(" ")}>记账</button>
      </div>

      {mode === "overview" ? (
      <div className="mt-3 grid grid-cols-1 gap-3">
        <div>
          <div className="text-xs text-zinc-600">估算总支出</div>
          <div className="mt-1 text-sm">
            <span className="font-semibold">¥{Math.round(totals.grand)}</span>
            {typeof totalBudget === "number" && (
              <span className="ml-2 text-xs text-zinc-500">（剩余：¥{Math.round(totalBudget - totals.grand)}）</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "交通", value: totals.transport, color: "bg-blue-500" },
            { label: "餐饮", value: totals.dining, color: "bg-orange-500" },
            { label: "住宿", value: totals.lodging, color: "bg-purple-500" },
            { label: "门票", value: totals.tickets, color: "bg-emerald-500" },
            { label: "活动", value: totals.activities, color: "bg-pink-500" },
          ].map((c) => (
            <div key={c.label} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">{c.label}</span>
                <span className="text-zinc-900">¥{Math.round(c.value)}</span>
              </div>
              <div className="mt-1 h-2 rounded bg-zinc-100">
                <div className={["h-2 rounded", c.color].join(" ")}
                  style={{ width: `${Math.min(100, (c.value / maxCategory) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <div className="text-xs text-zinc-600 mb-1">按天估算</div>
          <div className="space-y-1">
            {byDay.map((d) => (
              <div key={d.date} className="flex items-center justify-between text-xs">
                <span className="text-zinc-600">{d.date}</span>
                <span className="text-zinc-900">¥{Math.round(d.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : (
      <div className="mt-3 space-y-6">
        {/* 上：输入与语音 */}
        <div className="space-y-3">
          <div className="relative w-full">
            <input
              className="border px-2 py-2 rounded text-sm w-full pr-12"
              placeholder="语音或手动输入内容（如：餐饮 58 元）"
              value={parseText}
              onChange={(e) => setParseText(e.target.value)}
            />
            <div className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 z-50">
              <VoiceButton onPartial={(t) => setParseText(t)} onTranscribe={(t) => setParseText(t)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input className="border px-2 py-2 rounded w-full" inputMode="numeric" placeholder="金额（元）" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} />
            <select className="border px-2 py-2 rounded w-full" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}>
              {['交通','餐饮','住宿','门票','购物','活动','其他'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className="border px-2 py-2 rounded w-full" placeholder="备注（可选）" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-zinc-900 text-white px-3 py-2 rounded text-xs" onClick={async () => {
              setSaveError(null);
              const cleaned = amountInput.replace(/[,，\s]/g, '').replace(/[元¥￥]/g, '');
              const n = Number(cleaned);
              if (Number.isFinite(n) && n > 0) {
                await addExpense(n, categoryInput, noteInput, "manual");
                setAmountInput(''); setNoteInput('');
                return;
              }
              if (parseText.trim()) {
                const amt = parseAmountFromText(parseText);
                const catLabel = detectCategory(parseText);
                if (amt && amt > 0) {
                  await addExpense(Math.round(amt), catLabel, noteInput || undefined, "text");
                  setParseText('');
                } else {
                  setSaveError('解析失败或金额无效');
                }
                return;
              }
              setSaveError('请输入金额或提供文本');
            }}>添加记账</button>
            {saveError && <span className="text-xs text-red-600">{saveError}</span>}
          </div>
        </div>

        {/* 下：统计与记录 */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded border bg-zinc-50 p-2">
              <div className="text-[11px] text-zinc-600">总预算</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">{typeof totalBudget === 'number' ? `¥${Math.round(totalBudget)}` : '未设置'}</div>
            </div>
            <div className="rounded border bg-zinc-50 p-2">
              <div className="text-[11px] text-zinc-600">已支出</div>
              <div className="mt-1 text-sm font-semibold text-rose-700">¥{Math.round(expenseTotals.sum)}</div>
            </div>
            <div className="rounded border bg-zinc-50 p-2">
              <div className="text-[11px] text-zinc-600">余额</div>
              <div className={["mt-1 text-sm font-semibold", (balance!==null && balance<0) ? "text-red-700" : "text-emerald-700"].join(" ")}>{balance!==null?`¥${Math.round(balance)}`:'—'}</div>
            </div>
          </div>

          {/* 分类金额：紧凑标签样式，避免占据过多空间 */}
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(expenseTotals.group).map(([label, value]) => {
              const pct = expenseTotals.sum > 0 ? Math.round((value / expenseTotals.sum) * 100) : 0;
              return (
                <div
                  key={label}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px]"
                  title={`${label} · ¥${Math.round(value)}（${pct}%）`}
                >
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-zinc-700">{label}</span>
                  <span className="ml-1 text-zinc-400">·</span>
                  <span className="ml-1 font-medium text-zinc-900">¥{Math.round(value)}</span>
                </div>
              );
            })}
          </div>

          <div>
            <div className="text-xs text-zinc-600">已记账</div>
            <div className="mt-1 space-y-1">
              {expenses.length === 0 ? (
                <div className="text-xs text-zinc-500">暂无记录</div>
              ) : expenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">{new Date(e.dateISO).toLocaleString()} · {e.category} · {e.note || '—'}</span>
                  <span className="text-zinc-900">¥{Math.round(e.amount)}</span>
                </div>
              ))}
            </div>
            {typeof totalBudget === 'number' && expenseTotals.sum > totalBudget ? (
              <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">已超支：超过预算 ¥{Math.round(expenseTotals.sum - totalBudget)}</div>
            ) : null}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
