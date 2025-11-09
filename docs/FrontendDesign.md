# Web 前端设计方案（MVP）

> 本方案面向 Web 版 AI 旅行规划师，聚焦前端信息架构、页面与组件设计、状态管理与接口契约；与 `docs/ProjectPlan.md` 保持一致并为后续扩展留有接口占位。

## 目标与原则
- 清晰展示登录/行程/地图/预算能力，并保留接口扩展位。
- 极简高级风格：柔和阴影、半透明叠层、统一间距与动效（Tailwind + 原子化）。
- App Router 架构，组件化与状态分层，保证后续易扩展与维护。
- 移动端优先，桌面端增强信息密度与并行操作能力；暗色模式支持。

## 信息架构与导航
- 顶部导航 `NavBar`：左侧品牌 `AI Travel`，右侧 `Dashboard`、登录邮箱与退出、后续主题切换。
- 全局布局：`Header + 主内容区`，使用半透明背景与轻量阴影（如 `bg-white/80 backdrop-blur`）。

## 路由与页面
- `"/login"` 登录注册
  - 居中卡片：邮箱/密码输入，`注册`/`登录`按钮与错误提示。
  - 成功后跳转 `"/dashboard"`，导航显示邮箱与退出。
- `"/dashboard"` 行程列表与新建入口
  - 顶部信息：标题 + 当前用户邮箱；摘要（行程总数、最近更新时间）。
  - 新建区卡片：目的地、开始日期、结束日期、`新建行程` 主按钮（品牌渐变）。
  - 行程卡片列表：目的地、日期范围、创建时间、`详情` 按钮（跳转）。
- `"/plan/[id]"` 行程编辑（骨架）
  - 顶部工具栏（粘顶半透明）：目的地与日期、`生成行程` / `保存`、筛选（类型/预算）。
  - 左侧面板（60%）：天列表 + 日程项卡片（类型标签、时间、费用、备注）。
  - 右侧地图（40%）：Marker/Polyline/InfoWindow；列表与地图联动。

## 组件设计
- 基础组件（后续逐步替换现有散落样式）
  - `Button`：`default | secondary | ghost | gradient`，尺寸 `sm | md`。
  - `Card`：圆角、阴影与半透明背景；支持 header/footer 槽位。
  - `Input`：文本/日期/金额；内置错误态与说明文本。
  - `Badge`：类型标签（景点/餐饮/交通/酒店/其他）。
  - `Toast`：成功/失败统一反馈（全局队列）。
- 功能组件
  - `ItineraryList`：天级分组、日程项卡片、选中态联动地图；空/加载 Skeleton。
  - `BudgetPanel`：总预算与分类统计（迷你饼图/条形图）。
  - `MapView`：AMap 地图初始化与标注、路线渲染；暴露方法与联动事件。
  - `VoiceButton`、`ChatInput`：录音与文本输入，生成建议卡片并支持一键应用。

## 视觉语言与动效
- 字体与排版：`Geist`，标题层级（24/20/16）、正文 14，行高偏松。
- 颜色：中性灰为基底，低饱和品牌渐变（如 `#7c3aed → #06b6d4`）用于主按钮与选中态。
- 阴影与玻璃质感：少量 `drop-shadow`、`bg-black/50` 暗色背景；悬浮 1–2% 放大与阴影增强。
- 可访问性：可聚焦、键盘操作与 `aria-label`；对比度与文本大小达基本可读性标准。

## 状态管理与数据获取
- Zustand（全局状态）
  - `sessionStore`：`user`, `email`, `signOut()`；监听 Supabase 会话变化。
  - `planStore`：当前 `planId`，选中日/项目，筛选条件（类型/预算）。
  - `uiStore`：主题、Toast 队列、加载骨架状态。
- React Query（远程数据）
  - `queryKey` 约定：
    - `['trip_plans']` 用户行程列表
    - `['plan', planId]` 行程详情（含天与项目）
    - `['expenses', planId]` 费用列表与摘要
    - `['map.search', { q, city }]` 地图搜索
    - `['map.route', { origin, destination, type }]` 路线规划

## 数据与接口契约（保留后端交互）
- 简单 CRUD：直接用 Supabase（受 RLS 保护）。
- 复杂动作与第三方代理：通过 Next API 路由。
- API 清单与契约：
  - `POST /api/plan/create`
    - 入参：`{ destination, start_date, end_date, budget_total?, preferences? }`
    - 出参：`{ plan_id, itinerary: { days: Array<{ date, items: Array<{ type, name, poi_id?, start_time?, end_time?, estimated_cost?, notes? }> }> } }`
    - 说明：调用 LLM 工具链与地图信息标准化，返回结构化行程。
  - `POST /api/plan/save`
    - 入参：`{ plan_id, itinerary }`，出参：`{ ok: true }`；写库到 `itinerary_days/items`。
  - `GET /api/plan/:id`
    - 出参：`{ plan: TripPlan, days: ItineraryDay[], items: ItineraryItem[] }`；编辑页初次加载。
  - `GET /api/map/search?q=...&city=...`
    - 出参：`{ pois: Array<{ id, name, location:{ lat,lng }, rating?, opening_hours?, address?, type? }> }`；统一 POI 格式。
  - `GET /api/map/route?origin=...&destination=...&type=walking|driving|transit`
    - 出参：`{ polyline: Array<{ lat,lng }>, duration_minutes, distance_km }`；用于折线渲染与时长展示。
  - `POST /api/voice/transcribe`
    - 入参：`FormData(audio Blob)` 或 JSON 流；出参：`{ text, confidence?, language? }`。
  - `POST /api/expense/parse`
    - 入参：`{ text }`；出参：`{ amount, currency, category, note? }`；解析自由文本为记账项。
  - `GET /api/expense/summary?plan_id=...`
    - 出参：`{ total, by_category: Record<string, number>, by_day: Record<string, number> }`；预算概览。
- TypeScript 类型（示例）：
  - `TripPlan`: `id`, `user_id`, `destination`, `start_date`, `end_date`, `budget_total?`, `preferences?`, `created_at`
  - `ItineraryDay`: `id`, `trip_plan_id`, `date`, `day_budget?`, `notes?`
  - `ItineraryItem`: `id`, `day_id`, `type`, `poi_id?`, `start_time?`, `end_time?`, `estimated_cost?`, `notes?`
  - `Expense`: `id`, `trip_plan_id`, `amount`, `currency`, `category`, `itinerary_item_id?`, `note?`, `source`, `created_at`

## 地图集成（AMap）
- SDK 注入：在 `src/app/layout.tsx` 按需注入 `<script src="https://webapi.amap.com/maps?v=2.0&key=...">`。
- `MapView` 职责与接口：
  - 初始化/销毁地图实例；`setMarkers(items)`, `fitBounds(bounds)`, `drawRoute(polyline)`。
  - 类型色彩：`sight=purple`, `food=orange`, `transport=blue`, `hotel=green`, `other=gray`。
  - 联动：选中列表项 → 地图居中与 InfoWindow；切换日期 → 边界聚焦当天项目。

## 语音与 LLM
- `VoiceButton`：`idle → recording → transcribing → done`；进度与取消，失败重试与降级。
- 转写结果：建议卡片（如“添加晚餐预算 200”），一键应用到 `ItineraryList` 或 `BudgetPanel`。
- LLM 端点：`POST /api/plan/create` 生成行程；支持失败重试与纠错提示。

## 预算与记账
- `BudgetPanel`：总预算、按天预算、分类统计；超支高亮与提示。
- 记账入口：文本/语音 → `POST /api/expense/parse` → 追加到 `expenses`；`GET /api/expense/summary` 更新概览。

## 错误与反馈
- Skeleton：页面与列表加载骨架（灰色块 + 动画）。
- Toast：成功/失败统一提示；常见错误给出行动建议（检查网络/重试/配置环境变量）。
- 回退提示：未配置 `AMAP_KEY` 或语音密钥时给出引导文案。

## 响应式与主题
- 移动端：编辑页改为单栏，地图通过 Tab 切换；底部工具条固定。
- 暗色模式：`bg-black/50` 半透明、低对比边框；按钮与图标颜色统一。
- 可访问性：可聚焦与键盘操作，表单与按钮具 `aria-label`。

## 代码组织
- 路由与页面：`src/app/dashboard`, `src/app/plan/[id]`, `src/app/login`
- 组件：`src/components/{NavBar, Button, Card, Input, Badge, Toast, MapView, ItineraryList, BudgetPanel, VoiceButton, ChatInput}`
- 状态与工具：`src/lib/{supabase.ts, api.ts, map.ts}`；`src/features/*` 存放特定功能逻辑。

## 落地步骤
- 第一批（高性价比视觉与骨架）
  - 升级 `NavBar` 与 `Dashboard` 的视觉与动效（保持现有功能）。
  - `MapView` 初版与 `/plan/[id]` 骨架：顶部工具栏 + 左右分栏 + 列表卡片。
  - 抽象 `Button/Card/Input/Badge/Toast` 基础组件，用 Tailwind 变体统一样式。
  - 接口占位实现：`GET /api/plan/:id`、`GET /api/map/search`、`GET /api/map/route` 返回静态示例以利前端调试。
- 第二批（功能深化）
  - 将 `POST /api/plan/create` 与 `POST /api/plan/save` 接入真实逻辑（LLM + Supabase）。
  - 完成地图联动与路线规划交互；记账解析与预算概览。
  - Skeleton/Toast 与错误处理统一；细化表单校验与加载动效。

---
本文档作为前端实现的设计依据，后续迭代会在不改变整体风格与架构的前提下逐步增强视觉与交互，并将静态占位接口替换为真实后端服务。

## 计划页（/plan/[id]）个性化展示设计（LLM 增强）

### 设计目标
- 将“个性化路线地图 + 交通/住宿/景点/餐厅细节”以结构化方式呈现，并与地图联动。
- 支持偏好驱动的动态生成与微调（节奏、兴趣、预算等），保持操作低摩擦。
- 提供保存、导出、分享能力，便于复用和协作。

### 总体布局
- 桌面端：左侧“行程与偏好”面板（固定宽度、可折叠），右侧“地图与详情”主区域。
- 移动端：顶部地图、底部滑出面板（卡片栈），卡片滑动切换每日与模块。
- 视觉：浅色背景、品牌渐变强调、卡片圆角与轻阴影；地图标记按品类着色。

### 页面头部（工具栏）
- 基本信息：目的地、日期范围、出行人数与偏好摘要（节奏/兴趣标签/预算）。
- 主要操作：`重新生成`、`微调偏好`、`保存计划`、`导出/分享`。
- 生成状态：展示“已根据你的偏好生成”，以及“变更影响范围”（全局/某日/某时段）。

### 左侧面板（行程与模块）
- 日历/分日标签：按天快速切换，显示当天时间线（09:00/13:30/17:00/夜间等）。
- 当天卡片列表（时间线样式）：
  - 信息项：时间、标题、简述、预计时长、费用估算、标签（亲子/文化/自然/打卡）、热度评分。
  - 操作项：替换推荐（查看备选）、锁定此项、调整时段（拖拽）、定位到地图。
- 模块分区（当天或全局入口）：
  - 交通：当日城市内（步行/公交/打车/地铁）、跨城往返（高铁/航班），路线步骤与耗时/预算。
  - 住宿：按区域分组（湖景/市中心/交通便利），价格区间、评分、距离主要景点、是否含早/取消政策。
  - 餐饮：早餐/午餐/晚餐推荐，按距离与口味偏好，人均、排队建议、招牌菜、是否可预订。
  - 景点：核心/小众分组，门票、最佳时段、避坑提示、拍照点。
- 筛选区：预算滑条、节奏强度、兴趣分类（美食/历史/自然/亲子/夜生活）、距离范围、评分阈值。

### 右侧主区域（地图与详情）
- 地图图层与图例：
  - 路线层（当天 polyline，起终点高亮）；支持显示全行程总览。
  - 标记分类颜色：交通枢纽（蓝）、景点（橙）、餐饮（红）、住宿（紫）、拍照点（青）。
  - 低缩放启用聚合（cluster），减少标记拥挤。
- 地图交互：
  - 悬停/点击标记 → InfoWindow 气泡卡片（名称、评分、标签、加入行程/详情/到此路线）。
  - “按天切换”同步地图内容，仅显示对应日路线与标记；可切换“显示全行程”。
  - 路线模式切换：步行/公交/驾车；切换后耗时与路线自动更新。
- 详情浮层：
  - 当前选中项详情卡：图文、评价摘要、开放时间、注意事项、费用/购票链接。
  - 备选建议：替代景点/餐厅，一键“替换到某时段”。

### 个性化与偏好微调（弹窗）
- 节奏：轻松/标准/紧凑。
- 兴趣：美食、历史文化、自然风光、城市地标、亲子、夜生活。
- 预算：人均餐饮、酒店星级/价格上限、总预算。
- 特殊偏好：无辣/素食/咖啡控/摄影打卡/高海拔敏感/带娃友好。
- 生成策略：
  - 全局再生成（作用于全部天）。
  - 局部微调（仅某天或某一时段）。
  - 锁定已确认项，其余项智能替换。

### 辅助信息与实用提示
- 费用总览：按天和总计的预算分解（餐饮/交通/门票/住宿）。
- 实用提醒：天气/季节注意、排队时段、闭馆日、门票购买方式、可替代方案。
- 打包清单：按季节与活动类型生成（雨具/保暖/运动鞋等）。

### 导出与分享
- 保存到账号（`trip_plans`），支持版本快照。
- 导出 `PDF`（行程+地图截图+费用汇总）。
- 分享链接：只读模式，接收方可复制为自己的计划。
- 打印友好版（白底、分日清晰、路线概览图）。

### 响应式与易用性
- 桌面：双栏并行；移动：地图顶部 + 卡片底部滑出，卡片左右滑切换。
- 骨架屏与渐进加载：先展示关键项与路线，再加载图文/评价。
- 无障碍：字体对比、按钮尺寸、键盘操作、图标附文字标签。

### 信息结构建议（对接后端）
- 计划级别：
  - `destination`, `start_date`, `end_date`, `preferences`（节奏/兴趣/预算）。
  - `summary`（总费用估算、天数、主题特色）。
- 每日结构：
  - `items[]`: `{ time, title, note, type, poiId, cost_estimate, duration, tags[] }`
  - `transport`: `{ mode, steps[], time_estimate, price_estimate }`
  - `dining[]`: `{ name, cuisine, price_range, rating, distance, booking }`
  - `lodging[]`: `{ name, area, price, rating, distance_to_core, amenities }`
  - `attractions[]`: `{ name, ticket, best_time, tips, photo_spots }`
- 地图：
  - `routePath[]`（坐标序列，按天或全局）。
  - `markers[]`: `{ position, title, category, id, dayIndex }`（分类颜色与交互）。

### 与现有接口的对接与扩展
- 生成：`POST /api/plan/create` 返回结构化行程；若模型不支持结构化输出，后端已做解析与聚合回退。
- 地图：`GET /api/map/route` 渲染折线与时长；`GET /api/map/search` 统一 POI 格式用于标记与备选。
- 保存：`POST /api/plan/save` 持久化 `itinerary`；`GET /api/plan/:id` 初次加载行程详情。

### 落地顺序（前端）
- 第一阶段：地图与按天时间线联动，卡片视觉完善，偏好弹窗与全局再生成按钮。
- 第二阶段：交通/住宿/餐饮/景点模块卡片与筛选器，局部微调与锁定。
- 第三阶段：费用总览、导出分享、打印版与移动端优化、无障碍增强。

- 地图与按天时间线联动
- 偏好弹窗与重新生成
- 基础卡片视觉与筛选器