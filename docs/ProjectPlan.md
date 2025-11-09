# Web 版 AI 旅行规划师（AI Travel Planner）项目规划文档

## 执行总览
- 目标：交付 Web 版 AI 旅行规划师的 MVP，并为后续扩展打好架构基础。
- 推荐栈：Next.js + TypeScript + Supabase + 高德地图 + 科大讯飞语音识别 + 可切换 LLM。
- 交付物：页面与接口清单、分步集成说明、测试与部署流程、风险与备选方案。

## 里程碑与时间线（建议）
- 里程碑1（环境与骨架，3–5天）：项目初始化、Auth、基础数据模型、地图与语音基础接入。
- 里程碑2（规划与展示，4–7天）：文本/语音输入、AI 生成行程、地图展示与行程编辑。
- 里程碑3（预算与记账，3–5天）：语音记账解析、汇率转换、预算概览与提醒。
- 里程碑4（云同步与发布，3–5天）：实时同步、E2E 测试、部署与监控。
- 里程碑5（增量能力，按需）：出行模式辅助、PWA 离线、分享与协作。

## 前置准备
- 账户与密钥：
  - Vercel（前后端一体部署）、Supabase（Postgres + Auth + Realtime）
  - 高德地图 Web JS API（POI/路线规划）、科大讯飞语音识别（REST/WS）
  - LLM 提供商（OpenAI/Azure/通义千问/文心/等）
- 域名与白名单：高德 Key 需配置允许域名（本地开发可用 `localhost`）。
- 合规与隐私：确认语音数据使用条款、隐私政策与用户授权文案。

## 技术栈与架构
- 前端：Next.js（App Router）+ TypeScript；UI：Tailwind CSS 或 Chakra UI；状态：Zustand；数据：TanStack Query。
- 地图：高德地图 JS API（POI检索、路线规划、标注与可视化）；必要时适配百度/Google。
- 语音：科大讯飞服务端签名转写；浏览器回退 Web Speech API（质量提示）。
- 数据与认证：Supabase（RLS 行级安全）；文件存储可用 Supabase Storage（票据/图片）。
- LLM：统一适配层，支持多提供商与 JSON Schema 约束输出；工具调用串联地图/预算。
- 部署：前端与 API 路由部署到 Vercel；数据库与存储用 Supabase Cloud。

## 环境变量与配置
- `.env.local`（示例）：
  - `NEXT_PUBLIC_AMAP_KEY=...`
  - `IFLYTEK_APP_ID=...`、`IFLYTEK_API_KEY=...`、`IFLYTEK_API_SECRET=...`
  - `LLM_PROVIDER=openai`、`OPENAI_API_KEY=...`（或其它模型密钥）
  - `SUPABASE_URL=...`、`SUPABASE_ANON_KEY=...`（前端）
  - `SUPABASE_SERVICE_ROLE_KEY=...`（仅服务端接口使用）
- Next 配置：`next.config.js` 设置 `images.domains` 与运行时（语音签名走 Node Runtime）。
- 监控：`SENTRY_DSN`（可选）。

## 数据库与认证设计（Supabase）
- 表结构：
  - `users`：`id`（UUID，auth）、`nickname`、`language`、`currency`
  - `trip_plans`：`id`、`user_id`、`destination`、`start_date`、`end_date`、`budget_total`、`preferences`
  - `itinerary_days`：`id`、`trip_plan_id`、`date`、`day_budget`、`notes`
  - `itinerary_items`：`id`、`day_id`、`type`（景点/餐饮/交通）、`poi_id`、`start_time`、`end_time`、`estimated_cost`、`notes`
  - `expenses`：`id`、`trip_plan_id`、`amount`、`currency`、`category`、`itinerary_item_id?`、`note`、`source`（voice/text）
- 关系与索引：外键与联合索引（`user_id`、`trip_plan_id`、`date`）。
- RLS 安全策略：所有读写均要求 `user_id = auth.uid()`；公开元数据（如币种表）可放宽。
- 认证：邮箱密码与第三方 OAuth；前端持会话并监听状态变化。

## 地图服务接入（高德）
- 前端：在 `layout.tsx` 注入 SDK `<script src="https://webapi.amap.com/maps?v=2.0&key=...">`。
- Map 组件能力：初始化地图、Marker/Polyline/InfoWindow、联动行程列表高亮与边界聚焦。
- 服务端代理：
  - `GET /api/map/search?q=...&city=...` → POI 标准化结构
  - `GET /api/map/route?origin=...&destination=...&type=walking|driving|transit` → 路线规划
- 前端缓存：`react-query` 缓存搜索与路线；节流与去重。

## 语音识别接入（科大讯飞）
- 前端录音：`MediaRecorder` 采集 `audio/webm`/`wav`，状态 `idle/recording/transcribing/done`，展示进度反馈。
- 上传接口：`POST /api/voice/transcribe` 携带音频 Blob（或分片流）；可选 WebSocket。
- 服务端转写：科大讯飞 REST（短语音）或 WS（长语音）；服务端签名与密钥隔离。
- 回退方案：Web Speech API；提示用户质量差异与浏览器支持限制。

## LLM 适配层
- 接口：
  - `generatePlan(spec: PlanSpec): Itinerary`（严格 JSON Schema，包含天/项目/交通/预计费用与备选）
  - `parseExpense(utterance: string): ExpenseEntry`（金额、币种、类目、备注）
- 工具链：目的地 → POI 候选 → 开放时间/评分 → 路线耗时估算 → 餐饮/住宿匹配 → 日程排布。
- 成本估算：交通/住宿/餐饮/门票/杂项；支持币种与汇率（`exchangerate.host` 等）。
- 多模型支持：`provider=openai|qwen|glm|moonshot|ernie`，根据成本与质量选择；失败重试与纠错。

## 前端页面与交互
- 路由：
  - `/login`：注册登录
  - `/dashboard`：行程列表与新建入口
  - `/plan/[id]`：行程编辑页（左：行程/预算；右：地图）
- 组件：`VoiceButton`、`ChatInput`、`ItineraryList`（可拖拽）、`BudgetPanel`、`MapView`。
- 状态：Zustand（行程/预算/过滤），React Query（接口数据与缓存）。

## 行程规划流程（端到端）
1. 输入收集：文本或语音转写 → 解析为 `PlanSpec`（目的地、日期、预算、偏好、同行人数）。
2. 草案生成：`POST /api/plan/create` 触发 LLM 工具链，生成 `Itinerary`；并行查询 POI 详情。
3. 展示编辑：列表与地图联动；拖拽调整顺序与时段；预算估算与路线耗时动态刷新。
4. 保存同步：`POST /api/plan/save` 写库；订阅 Supabase Realtime，实现多设备同步。

## 费用预算与记账
- 流程：语音/文本 → `POST /api/expense/parse` → 结构化费用条目 → 汇率转换 → 分类统计。
- 类目：交通、住宿、餐饮、门票、购物、杂项；支持按天/类目预算与超支提醒。
- 展示：预算总览、饼图/折线图；建议调整与节约提示（增量）。

## API 路由清单
- `POST /api/voice/transcribe`：入参音频 Blob；出参 `{ text, confidence, language }`。
- `POST /api/plan/create`：入参 `PlanSpec`；出参 `Itinerary`。
- `POST /api/plan/save`：入参行程 JSON；出参 `plan_id`。
- `GET /api/plan/:id`：获取行程详情。
- `GET /api/map/search`：参数 `q, city`；返回 POI 列表。
- `GET /api/map/route`：参数 `origin, destination, type`；返回路线。
- `POST /api/expense/parse`：入参文本；出参费用条目。
- `GET /api/expense/summary?plan_id=...`：预算概览。

## 安全与隐私
- 密钥管理：所有第三方密钥仅在服务端；前端仅使用公开地图 Key。
- RLS 隔离：所有数据按 `auth.uid()` 强制隔离；审计日志记录关键操作。
- 语音策略：默认只存转写文本；原始音频仅在用户明确开启“保留音频”时存储。
- 错误监控：Sentry 前后端；慢查询与接口错误告警。

## 测试与质量保障
- 单元测试：解析器（PlanSpec、ExpenseEntry）、适配器（地图/LLM 响应标准化与错误处理）。
- 集成测试：API 路由与 Supabase 交互；语音上传与转写流程（固定音频样本）。
- E2E 测试（Playwright）：登录 → 新建规划 → 生成与编辑 → 保存 → 预算查看 → 云同步验证。
- 性能与稳定：并发限制、POI 缓存、降级策略与错误提示；关键路径打点。

## 部署与运维
- Vercel：配置项目与环境变量，绑定域名与高德白名单；区分 Edge/Node 路由（语音签名走 Node）。
- Supabase：备份策略与错误告警；观察慢查询与 RLS 日志。
- 监控与成本：LLM 调用配额告警；模型分级使用与缓存；接口限流与节流。

## 风险与备选
- 浏览器语音识别质量不稳定：主走讯飞，保留 Web Speech 作为备选并提示质量。
- 地图服务域名白名单：本地开发使用 `localhost`；上线后配置正式域名。
- LLM 输出不稳定：严格 JSON Schema、重试与纠错；必要时多模型投票或裁决。
- 数据冲突：采用“最后写入 wins”并提供手动合并提示；增量加入乐观锁与冲突解决界面。

## 验收标准（MVP）
- 登录与登出可用，数据按用户隔离。
- 文本/语音输入能生成完整行程（按天与时段），并在地图展示。
- 支持基本编辑（增删改与拖拽排序），保存与云端同步。
- 预算概览与语音记账可用，汇率转换正确。
- 端到端测试通过，部署上线可用，常见错误有清晰提示。

## 具体执行步骤（可操作清单）
1) 项目初始化与依赖安装：
- 使用 `create-next-app` 初始化（TypeScript、App Router、Tailwind）。
- 安装 `@supabase/supabase-js`、`@tanstack/react-query`、`zustand`、`zod`、`axios`、`sentry/nextjs`、UI 库与图标。
- 建立目录结构：`src/app`、`src/components`、`src/features`、`src/server`、`src/lib`。

2) Supabase 与 Auth：
- 创建 Supabase 项目与表，配置 RLS 与索引。
- 接入邮箱密码登录与 OAuth（可选），实现前端会话管理。

3) 地图服务：
- 前端加载高德 SDK，封装 Map 组件与交互（标注/路线/聚焦）。
- 后端代理 `search/route` 接口，前端使用 `react-query` 缓存结果。

4) 语音识别：
- 前端录音与上传；服务端转写（讯飞 REST/WS）；状态与进度提示。

5) LLM 适配层与行程生成：
- 统一调用接口与 JSON Schema；工具链调用地图/预算。
- 实现 `POST /api/plan/create` 并返回结构化日程。

6) 行程编辑与展示：
- `/plan/[id]` 页面布局；`ItineraryList` 与 `MapView` 联动；拖拽调整与预算联动。
- 细化项目卡片（时间/类型/预计费用/备注）。

7) 费用与预算：
- `POST /api/expense/parse` 解析语音/文本记账；汇率转换与分类统计。
- 预算总览与超支提醒；图表展示（饼图/折线）。

8) 云同步与实时：
- Supabase Realtime 订阅行程与费用变更；冲突策略与提示。

9) 测试与质量：
- 单元/集成/E2E 全覆盖关键路径；错误与降级体验完善。

10) 部署与监控：
- Vercel 部署与环境变量配置；高德白名单与域名绑定。
- Sentry 监控与配额告警；成本与性能优化。

## 版本规划与增量
- 出行模式：当前地点与下一站路线耗时、开放时间提醒、备选推荐。
- PWA 离线：缓存已生成行程、关键地图瓦片、POI详情；弱网可用。
- 分享与协作：链接/二维码、PDF 导出、多人协作与权限控制。
- 供应商适配：增加 Google Maps/更多 LLM；按地域与合规切换。

---
本规划文档用于指导 MVP 开发与迭代。确认后可按“具体执行步骤”推进实现，并在里程碑验收节点进行复盘与调整。