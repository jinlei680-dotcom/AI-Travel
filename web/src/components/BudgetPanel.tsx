"use client";
import React, { useEffect, useMemo, useState } from "react";

type PriceRange = [number, number];
type DiningItem = { name: string; priceRange?: PriceRange };
type LodgingItem = { name: string; price?: number };
type TransportSummary = { mode?: string; timeEstimate?: number; priceEstimate?: number };
type AttractionItem = { name: string; ticket?: number | string };
type PlanItem = { id: string; time?: string; title: string; note?: string };
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

export default function BudgetPanel({ days }: BudgetPanelProps) {
  const [totalBudget, setTotalBudget] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastPrefs");
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p?.budgetTotal === "number") setTotalBudget(p.budgetTotal);
      }
    } catch {}
  }, []);

  const { byDay, totals } = useMemo(() => {
    const byDay: { date: string; transport: number; dining: number; lodging: number; tickets: number; total: number }[] = [];
    let transport = 0, dining = 0, lodging = 0, tickets = 0;
    for (const d of days || []) {
      const t = Number(d.transport?.priceEstimate) || 0;
      const dine = (d.dining || []).reduce((s, it) => s + avgPrice(it.priceRange), 0);
      const lodge = (d.lodging || []).reduce((s, it) => s + (Number(it.price) || 0), 0);
      const tick = (d.attractions || []).reduce((s, it) => s + ticketToNumber(it.ticket), 0);
      const total = t + dine + lodge + tick;
      byDay.push({ date: d.date, transport: t, dining: dine, lodging: lodge, tickets: tick, total });
      transport += t; dining += dine; lodging += lodge; tickets += tick;
    }
    const grand = transport + dining + lodging + tickets;
    return { byDay, totals: { transport, dining, lodging, tickets, grand } };
  }, [days]);

  const maxCategory = Math.max(1, totals.grand, totals.transport, totals.dining, totals.lodging, totals.tickets);

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
    </div>
  );
}