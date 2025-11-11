# AI-Travel Web

快速指南，帮助公众用户直接拉取并运行公共 ACR 镜像，以及维护者发布新镜像的流程。

## Quick Start（公共 ACR 镜像）

- 拉取镜像：
  - `docker pull crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest`
  - 或固定到发布标签：
    - `docker pull crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:release-acr-test-7`

- 单容器运行：
  - `docker run --rm --name ai-travel-web -e PORT=8080 --env-file ./\.env.local -p 8080:8080 crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest`
  - Apple 芯片如镜像只有 `amd64`：加 `--platform=linux/amd64`

- Compose 一键启动：
  - `cd AI-Travel/web`
  - `WEB_IMAGE=crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest docker compose up -d`

- 访问与验证：
  - 打开 `http://localhost:8080` 或 `http://localhost:8080/plan`
  - 健康检查：`http://localhost:8080/api/health/supabase`

## 必要环境变量

- 前端可见（已在镜像构建阶段注入，无需用户再传）：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 运行时服务端变量（用户本机 `.env.local` 提供）：
  - LLM（通义千问 OpenAI 兼容）：`LLM_PROVIDER=openai-compatible`、`DOUBAO_API_KEY`、`DOUBAO_MODEL`、`DOUBAO_API_BASE`
  - 语音（科大讯飞，可选）：`IFLYTEK_APP_ID`、`IFLYTEK_API_KEY`、`IFLYTEK_API_SECRET`
  - 地图 WebService（可选）：`AMAP_WEBSERVICE_KEY`
  - 端口：`PORT=8080`（如改端口，对应映射即可）

> 提醒：敏感密钥仅作为服务端变量在运行时注入，不要带 `NEXT_PUBLIC_` 前缀。

## 维护者发布镜像（GitHub Actions 自动化）

- 工作流：`.github/workflows/docker-acr.yml`
- 需在 GitHub 仓库 Secrets 配置：
  - `ACR_REGISTRY`（例如 `crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com`）
  - `ACR_NAMESPACE`（例如 `travel-ai-project`）
  - `ACR_REPOSITORY`（例如 `ai-travel-web`）
  - `ACR_USERNAME`、`ACR_PASSWORD`
  - `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - 可选：`NEXT_PUBLIC_AMAP_KEY`、`NEXT_PUBLIC_AMAP_SECURITY_JS_CODE`

- 触发发布：
  - 推送到 `main`：`git push origin main`
  - 推送标签（推荐）：
    - `git tag -a release-acr-test-7 -m "Public ACR build"`
    - `git push origin release-acr-test-7`
  - 或在 GitHub Actions 页面手动运行（workflow_dispatch）

- 工作流会：
  - 使用 buildx 构建多架构镜像（`linux/amd64, linux/arm64`）
  - 在构建时注入前端可见的 `NEXT_PUBLIC_*` 变量
  - 推送到你的公共 ACR，标签包含 `latest`、短 `sha` 或发布标签

## Apple 芯片注意事项

- 若镜像为多架构：可直接运行；若仅 `amd64`：拉取或运行时使用 `--platform=linux/amd64`。

## 安全实践

- 不要将任何敏感密钥打包进镜像或提交到仓库。
- 前端可见变量必须以 `NEXT_PUBLIC_` 开头；所有敏感 Key 保持为服务端变量。
