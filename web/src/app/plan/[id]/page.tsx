"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import MapView from "../../../components/MapView";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Badge from "../../../components/Badge";
import Input from "../../../components/Input";
import type { ChangeEvent } from "react";

type PlanItem = { id: string; time?: string; title: string; note?: string; location?: [number, number] };
type PlanDay = { date: string; items: PlanItem[] };
type PlanData = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: PlanDay[];
  markers?: { position: [number, number]; title?: string }[];
};

export default function PlanPage() {
  const params = useParams();
  const planId = (params?.id as string) || "sample";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);

  // For generate form (destination/dates can be edited before generation)
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/plan/${planId}`)
      .then((r) => r.json())
      .then((data: PlanData) => {
        setPlan(data);
        setDestination(data.destination);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message || "加载失败");
        setLoading(false);
      });
  }, [planId]);

  const markers = useMemo(() => plan?.markers ?? [], [plan]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/plan/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, start_date: startDate, end_date: endDate }),
      });
      const data: PlanData = await res.json();
      setPlan(data);
    } catch (e: any) {
      setError(e?.message || "生成失败");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold">行程规划</h1>
        <p className="mt-3 text-zinc-500">加载中...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold">行程规划</h1>
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <Card title="生成新行程">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Input placeholder="目的地" value={destination} onChange={(e: ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)} />
            <Input type="date" value={startDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
            <Button onClick={handleGenerate} disabled={generating}>{generating ? "生成中..." : "生成行程"}</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{plan.destination}</h1>
        <Badge variant="gray">
          {plan.start_date} → {plan.end_date}
        </Badge>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="行程每日安排" actions={<Button size="sm" onClick={handleGenerate}>{generating ? "生成中..." : "重新生成"}</Button>}>
          {plan.days.length === 0 && (
            <div className="text-sm text-zinc-500">暂无数据，点击生成行程</div>
          )}
          <div className="space-y-3">
            {plan.days.map((d) => (
              <div key={d.date} className="rounded-lg border border-zinc-200 p-3">
                <div className="text-sm font-medium">{d.date}</div>
                <ul className="mt-2 space-y-1">
                  {d.items.map((it) => (
                    <li key={it.id} className="text-sm text-zinc-700">
                      {it.time ? <span className="mr-2 text-zinc-500">{it.time}</span> : null}
                      {it.title}
                      {it.note ? <span className="ml-2 text-zinc-400">{it.note}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
        <Card title="地图">
          <MapView markers={markers} className="h-[380px]" />
        </Card>
      </div>
    </div>
  );
}