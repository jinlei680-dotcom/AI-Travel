"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

type TripPlan = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget_total: number | null;
  created_at: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [plans, setPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New plan form state
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase 环境变量未配置");
      setLoading(false);
      return;
    }

    // Load session
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

      // Load plans
      const { data: rows, error: qErr } = await supabase
        .from("trip_plans")
        .select("id,destination,start_date,end_date,budget_total,created_at")
        .order("created_at", { ascending: false });
      if (qErr) {
        setError(qErr.message);
      } else {
        setPlans(rows ?? []);
      }
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    if (!destination || !startDate || !endDate) {
      setError("请完善目的地与起止日期");
      return;
    }
    setCreating(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError("请先登录");
      setCreating(false);
      return;
    }
    const userId = sessionData.session.user.id;
    const { data, error: insErr } = await supabase
      .from("trip_plans")
      .insert({
        user_id: userId,
        destination,
        start_date: startDate,
        end_date: endDate,
      })
      .select("id,destination,start_date,end_date,budget_total,created_at")
      .single();
    setCreating(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    setPlans((prev) => [data as TripPlan, ...prev]);
    setDestination("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-zinc-500">加载中...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">请先登录</h1>
        <p className="mt-4 text-zinc-500">登录后即可管理你的旅行行程。</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
        >
          前往登录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <span className="text-sm text-zinc-500">{email}</span>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-6">
        <h2 className="text-lg font-medium">新建行程</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="目的地"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-900 dark:text-zinc-100"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-900 dark:text-zinc-100"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {creating ? "创建中..." : "新建行程"}
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">我的行程</h2>
        <div className="mt-3 divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {plans.length === 0 && (
            <div className="p-4 text-sm text-zinc-500">尚未创建任何行程</div>
          )}
          {plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm font-medium">{p.destination}</div>
                <div className="text-xs text-zinc-500">
                  {p.start_date} → {p.end_date}
                </div>
              </div>
              <Link
                href={`/dashboard/${p.id}`}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                详情
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}