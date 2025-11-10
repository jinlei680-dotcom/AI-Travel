import { getSupabaseClient } from "@/lib/supabase";
import type { PlanDay } from "@/lib/itinerarySchema";

type SavePlanInput = {
  destination: string;
  start_date: string;
  end_date: string;
  days: PlanDay[];
  markers?: { position: [number, number]; title?: string }[];
  budget_total?: number | null;
};

export async function savePlanToDatabase(plan: SavePlanInput): Promise<{ tripPlanId: string } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase 环境变量未配置");

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("请先登录");

  const userId = sessionData.session.user.id;

  // 确保用户档案存在（FK 依赖 public.users.id）
  // 使用 upsert 以避免重复插入失败
  {
    const { error: userErr } = await supabase
      .from("users")
      .upsert({ id: userId }, { onConflict: "id" });
    if (userErr && !/duplicate key/i.test(userErr.message)) {
      // 某些情况下 RLS 或策略可能阻止创建；记录但不中断
      // 若 FK 导致后续失败，会在插入 trip_plans 时抛错
    }
  }

  // 插入 trip_plans
  const { data: planRow, error: planErr } = await supabase
    .from("trip_plans")
    .insert({
      user_id: userId,
      destination: plan.destination,
      start_date: plan.start_date,
      end_date: plan.end_date,
      budget_total: typeof plan.budget_total === "number" ? plan.budget_total : null,
      preferences: {
        plan_raw: {
          destination: plan.destination,
          start_date: plan.start_date,
          end_date: plan.end_date,
          days: plan.days,
          markers: plan.markers,
        },
      },
    })
    .select("id")
    .single();

  if (planErr) throw new Error(planErr.message);
  const tripPlanId = String(planRow?.id);
  if (!tripPlanId) throw new Error("插入行程失败");

  // 按天插入并获取 day_id，再插入 itinerary_items（映射到正确的列）
  for (let i = 0; i < plan.days.length; i++) {
    const d = plan.days[i] as any;
    const { data: dayRow2, error: dayErr2 } = await supabase
      .from("itinerary_days")
      .insert({ trip_plan_id: tripPlanId, date: d.date, day_index: i })
      .select("id")
      .single();
    if (dayErr2) throw new Error(`保存行程天失败: ${dayErr2.message}`);
    const dayId = String(dayRow2?.id);

    const itemRows: any[] = [];
    (d.items || []).forEach((it: any) => {
      // 将前端的 title/time/note 映射到 DB 可用列：notes/start_time/estimated_cost
      const notes = it.note
        ? `${it.time ? `[${it.time}] ` : ""}${it.title} - ${it.note}`
        : `${it.time ? `[${it.time}] ` : ""}${it.title}`;
      itemRows.push({
        day_id: dayId,
        start_time: it.time || null,
        end_time: null,
        estimated_cost: typeof it.costEstimate === "number" ? it.costEstimate : null,
        notes,
        // 可选：type/poi_id 等字段留空，避免违反 CHECK 约束
      });
    });
    if (itemRows.length) {
      const { error: itemErr2 } = await supabase.from("itinerary_items").insert(itemRows);
      if (itemErr2) throw new Error(`保存行程条目失败: ${itemErr2.message}`);
    }
  }

  return { tripPlanId };
}