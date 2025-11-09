-- Supabase 初始化 SQL（在 Supabase 项目的 SQL 编辑器中执行）

-- 用户表（可选扩展用户档案）
create table if not exists public.users (
  id uuid primary key default auth.uid(),
  nickname text,
  language text default 'zh',
  currency text default 'CNY',
  created_at timestamp with time zone default now()
);

-- 行程主表
create table if not exists public.trip_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  budget_total numeric,
  preferences jsonb,
  created_at timestamp with time zone default now()
);
create index if not exists idx_trip_plans_user on public.trip_plans(user_id);

-- 每日行程
create table if not exists public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_plan_id uuid not null,
  date date not null,
  day_budget numeric,
  notes text,
  created_at timestamp with time zone default now()
);
create index if not exists idx_days_plan on public.itinerary_days(trip_plan_id, date);

-- 行程项
create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null,
  type text check (type in ('sight','food','transport','hotel','other')),
  poi_id text,
  start_time time,
  end_time time,
  estimated_cost numeric,
  notes text,
  created_at timestamp with time zone default now()
);
create index if not exists idx_items_day on public.itinerary_items(day_id);

-- 记账
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_plan_id uuid not null,
  amount numeric not null,
  currency text default 'CNY',
  category text check (category in ('transport','hotel','food','ticket','shopping','misc')),
  itinerary_item_id uuid,
  note text,
  source text default 'text',
  created_at timestamp with time zone default now()
);
create index if not exists idx_expenses_plan on public.expenses(trip_plan_id);

-- 外键（注意：Supabase 默认不打开跨 schema 的 FK；此处为公共 schema）
alter table public.trip_plans
  add constraint fk_trip_plans_user foreign key (user_id) references public.users(id) on delete cascade;
alter table public.itinerary_days
  add constraint fk_days_plan foreign key (trip_plan_id) references public.trip_plans(id) on delete cascade;
alter table public.itinerary_items
  add constraint fk_items_day foreign key (day_id) references public.itinerary_days(id) on delete cascade;
alter table public.expenses
  add constraint fk_expenses_plan foreign key (trip_plan_id) references public.trip_plans(id) on delete cascade;

-- 启用 RLS
alter table public.users enable row level security;
alter table public.trip_plans enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.expenses enable row level security;

-- RLS 策略：仅本人可读写
create policy if not exists users_owner on public.users
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy if not exists plans_owner_select on public.trip_plans
  for select using (user_id = auth.uid());
create policy if not exists plans_owner_mod on public.trip_plans
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy if not exists days_owner_select on public.itinerary_days
  for select using (exists(select 1 from public.trip_plans p where p.id = itinerary_days.trip_plan_id and p.user_id = auth.uid()));
create policy if not exists days_owner_mod on public.itinerary_days
  for all using (exists(select 1 from public.trip_plans p where p.id = itinerary_days.trip_plan_id and p.user_id = auth.uid()))
  with check (exists(select 1 from public.trip_plans p where p.id = itinerary_days.trip_plan_id and p.user_id = auth.uid()));

create policy if not exists items_owner_select on public.itinerary_items
  for select using (exists(select 1 from public.itinerary_days d join public.trip_plans p on d.trip_plan_id = p.id where d.id = itinerary_items.day_id and p.user_id = auth.uid()));
create policy if not exists items_owner_mod on public.itinerary_items
  for all using (exists(select 1 from public.itinerary_days d join public.trip_plans p on d.trip_plan_id = p.id where d.id = itinerary_items.day_id and p.user_id = auth.uid()))
  with check (exists(select 1 from public.itinerary_days d join public.trip_plans p on d.trip_plan_id = p.id where d.id = itinerary_items.day_id and p.user_id = auth.uid()));

create policy if not exists expenses_owner_select on public.expenses
  for select using (exists(select 1 from public.trip_plans p where p.id = expenses.trip_plan_id and p.user_id = auth.uid()));
create policy if not exists expenses_owner_mod on public.expenses
  for all using (exists(select 1 from public.trip_plans p where p.id = expenses.trip_plan_id and p.user_id = auth.uid()))
  with check (exists(select 1 from public.trip_plans p where p.id = expenses.trip_plan_id and p.user_id = auth.uid()));

-- 完成