# AI-Travel

一个面向旅行计划与地图交互的应用。包含基于 LLM 的行程生成、地图兴趣点标注与路径查询、Supabase 数据存储，以及科大讯飞语音识别。本文档为项目总览与快速使用指南，确保其他用户看完即可正确启动。

重要提示：由于大模型生成回答时间较长，单次调用约需 3 分钟，请耐心等待。生成过程中页面会显示加载与进度提示。
连接大模型有时网络会出问题，可以多试几次。

## 项目结构
- `web/` Next.js 前端与服务端（App Router），生产镜像与 Compose 文件均在该目录
- `docs/` 项目文档与设计说明
- `.github/workflows/` GitHub Actions（自动构建并推送镜像到 ACR）

## 主要功能
- 行程生成：在后端 `/api/plan/create` 调用通义千问（OpenAI 兼容）生成包含天数、活动与地图标注的行程
- 地图与 POI：前端通过高德 JSAPI 动态脚本注入加载地图；后端用高德 WebService 代理搜索
- 路线与交互：页面 `/plan` 提供兴趣点定位、起终点选择与路线提示的交互体验
- 语音识别：集成科大讯飞 IAT，后端生成 WebSocket 授权签名，前端可进行语音输入（可选）
- 数据存储：Supabase 读写示例与健康检查接口

## 制品与镜像
- 公共 ACR 镜像（示例）：
  - `docker pull crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest`
  - 或固定到发布标签（示例）：
    - `docker pull crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:release-acr-test-10`

## 快速启动（镜像方式，推荐）
- 单容器运行（使用你的本地 `.env.local`）：
  - `docker run --rm --name ai-travel-web -e PORT=8080 --env-file /absolute/path/to/.env.local -p 8080:8080 crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest`
  - 真实路径示例：
    - `docker run --rm --name ai-travel-web -e PORT=8080 --env-file /Users/lujinlei/Documents/code/AI-Travel-Homework/AI-Travel/web/.env.local -p 8080:8080 crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest`
  - Apple 芯片如镜像仅 `amd64`：追加 `--platform=linux/amd64`

- Compose 一键启动（在 `web/` 目录）：
  - `cd AI-Travel/web`
  - `WEB_IMAGE=crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest docker compose up -d`
  - 默认端口 `8080`，访问 `http://localhost:8080` 或 `http://localhost:8080/plan`

## 环境参数配置
- 前端可见（构建期已注入，同时运行时再注入以增强稳定性）：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_AMAP_KEY`
  - `NEXT_PUBLIC_AMAP_SECURITY_JS_CODE`（如控制台开启安全策略）

- 服务端运行时（不要加 `NEXT_PUBLIC_` 前缀）：
  - LLM（通义千问 OpenAI 兼容）：`LLM_PROVIDER=openai-compatible`、`DOUBAO_API_KEY`、`DOUBAO_MODEL`、`DOUBAO_API_BASE`
  - 语音（科大讯飞，可选）：`IFLYTEK_APP_ID`、`IFLYTEK_API_KEY`、`IFLYTEK_API_SECRET`、`IFLYTEK_IAT_HOST`（默认 `ws-api.xfyun.cn`）
  - 地图 WebService（可选）：`AMAP_WEBSERVICE_KEY`
  - 端口：`PORT`（单容器建议 `8080`，Compose 默认 `8080`）

- 示例 `.env.local`（请按你的密钥填充）：
  - `NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase>.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>`
  - `NEXT_PUBLIC_AMAP_KEY=<your-amap-browser-key>`
  - `NEXT_PUBLIC_AMAP_SECURITY_JS_CODE=<your-amap-security-code>`
  - `LLM_PROVIDER=openai-compatible`
  - `DOUBAO_API_KEY=<your-dashscope-key>`
  - `DOUBAO_MODEL=qwen3-max`
  - `DOUBAO_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1`
  - `IFLYTEK_APP_ID=<your-app-id>`
  - `IFLYTEK_API_KEY=<your-api-key>`
  - `IFLYTEK_API_SECRET=<your-api-secret>`
  - `AMAP_WEBSERVICE_KEY=<your-webservice-key>`
  - `PORT=8080`

> 说明：
> - `.env.local` 不会被打包进镜像或提交到仓库（已在 `.dockerignore` 与 `.gitignore` 中忽略）。
> - 单容器运行需用 `--env-file` 指向你的文件；Compose 会自动读取 `.env` 与 `.env.local`。

## 访问与验证
- 页面：`http://localhost:8080/plan`
- Supabase 健康：`curl -s http://localhost:8080/api/health/supabase`
- 公共环境：`curl -s http://localhost:8080/api/env/public`
- 讯飞签名（调试）：`curl -s "http://localhost:8080/api/voice/iflytek/sign?debug=1"`
- 地图脚本注入：Network 面板加载 `https://webapi.amap.com/maps?v=2.0&key=...`，Console 无错误

## 常见踩坑与解决方案
- 构建上下文路径错误：工作流最初使用 `AI-Travel/web` 导致 buildx 报 `path not found`，已改为 `./web` 并显式 `Dockerfile: ./web/Dockerfile`
- Server Component 动态导入：`next/dynamic` 在 Server Component 中使用会报错，已改为客户端运行时注入脚本（`EnvScriptsLoader`）
- 构建期内联不足：客户端在构建期可能拿不到 `NEXT_PUBLIC_*`，通过 `/api/env/public` + `EnvScriptsLoader` 在运行时注入，保证稳定
- 端口冲突：开发占用 `3000`，建议镜像运行 `PORT=8080` 并映射 `-p 8080:8080`
- AMap 安全策略：如开启安全校验，需设置 `NEXT_PUBLIC_AMAP_SECURITY_JS_CODE` 并在控制台添加域名白名单（含 `localhost`）
- 架构不匹配：Apple 芯片运行仅 `amd64` 镜像需加 `--platform=linux/amd64`
- 镜像安全：避免将密钥打包进镜像；统一用运行时注入

## 维护者发布流程（CI 自动化）
- 工作流：`.github/workflows/docker-acr.yml`
- Secrets：`ACR_REGISTRY`、`ACR_NAMESPACE`、`ACR_REPOSITORY`、`ACR_USERNAME`、`ACR_PASSWORD`，以及 `NEXT_PUBLIC_*`（构建期注入）
- 触发：推 `main` 或推标签（如 `release-acr-test-10`）
- 产物：`$ACR_REGISTRY/$ACR_NAMESPACE/$ACR_REPOSITORY:latest`、短 `sha`、发布标签。用户按上文命令拉取运行

## 许可与安全
- 许可证见 `LICENSE`
- 敏感密钥仅作为服务端运行时变量；前端可见变量使用 `NEXT_PUBLIC_` 前缀
- 不要在仓库或公共文档泄露任何账号凭证或 API Key