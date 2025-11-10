"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import Card from "@/components/Card";
import Badge from "@/components/Badge";

type TripPlan = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_total: number | null;
  created_at: string;
};

type DayRow = { id: string; trip_plan_id: string; date: string; day_index: number };
type ItemRow = { id: string; day_id: string; start_time: string | null; end_time: string | null; estimated_cost: number | null; notes: string | null };

export default function PlanDetailPage() {
  const params = useParams();
  const planId = String(params?.id || "");
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [days, setDays] = useState<DayRow[]>([]);
  const [itemsByDay, setItemsByDay] = useState<Record<number, ItemRow[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase 环境变量未配置");
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data, error: authErr }) => {
      if (authErr) {
        setError(authErr.message);
        setLoading(false);
        return;
      }
      const userEmail = data.session?.user?.email ?? null;
      setEmail(userEmail);

      if (!data.session) {
        setLoading(false);
        return;
      }

      // 载入主行程
      const { data: planRow, error: planErr } = await supabase
        .from("trip_plans")
        .select("id,destination,start_date,end_date,budget_total,created_at")
        .eq("id", planId)
        .single();
      if (planErr) {
        setError(planErr.message);
        setLoading(false);
        return;
      }
      setPlan(planRow as TripPlan);

      // 载入天
      const { data: dayRows, error: dayErr } = await supabase
        .from("itinerary_days")
        .select("id,trip_plan_id,date,day_index")
        .eq("trip_plan_id", planId)
        .order("day_index", { ascending: true });
      if (dayErr) {
        setError(dayErr.message);
        setLoading(false);
        return;
      }
      const daysSafe = (dayRows ?? []) as DayRow[];
      setDays(daysSafe);

      // 载入每一天的条目
      const byDay: Record<number, ItemRow[]> = {};
      for (const d of daysSafe) {
        const { data: items, error: itemsErr } = await supabase
          .from("itinerary_items")
          .select("id,day_id,start_time,end_time,estimated_cost,notes")
          .eq("day_id", d.id)
          .order("start_time", { ascending: true });
        if (itemsErr) {
          setError(itemsErr.message);
          break;
        }
        byDay[d.day_index] = (items ?? []) as ItemRow[];
      }
      setItemsByDay(byDay);
      setLoading(false);
    });
  }, [planId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold">行程详情</h1>
        <p className="mt-3 text-zinc-500">加载中...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">请先登录</h1>
        <p className="mt-4 text-zinc-500">登录后可查看你保存的行程。</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold">行程详情</h1>
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold">行程详情</h1>
        <p className="mt-3 text-zinc-500">未找到行程</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">行程详情</h1>
        <Badge variant="gray">{email}</Badge>
      </div>

      <section className="mt-4">
        <Card title="基础信息">
          <div className="text-sm text-zinc-700">
            <div>目的地：{plan.destination}</div>
            <div>日期：{plan.start_date} → {plan.end_date}</div>
            <div>预算：{plan.budget_total ?? "未设置"}</div>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <Card title="每日安排">
          <div>
            {days.length === 0 && (
              <div className="p-3 text-sm text-zinc-500">尚未保存每日详情</div>
            )}
            {days.map((d) => (
              <div key={d.id} className="py-3 border-t border-zinc-200">
                <div className="mb-2 text-sm font-medium">第 {d.day_index + 1} 天 · {d.date}</div>
                <div className="flex flex-col gap-2">
                  {(itemsByDay[d.day_index] || []).map((it) => (
                    <div key={it.id} className="flex items-center justify-between rounded border border-zinc-200 p-2 text-sm">
                      <div className="text-zinc-800">{it.notes || "行程项目"}</div>
                      <div className="text-zinc-500">{it.start_time || "时间待定"}</div>
                    </div>
                  ))}
                  {(itemsByDay[d.day_index] || []).length === 0 && (
                    <div className="text-sm text-zinc-500">暂无项目</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}