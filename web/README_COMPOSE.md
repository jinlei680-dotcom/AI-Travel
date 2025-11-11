# 使用指南：无需暴露 ACR 凭证

本项目不建议在 README 中公开任何 ACR 账号或密码。其他用户仍可通过以下方式使用：

## 方式 A：使用公共镜像（推荐）

如果将镜像仓库设置为**公开读取**（Aliyun ACR 支持设置仓库可见性为公开），用户无需登录即可拉取：

```bash
docker pull crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:latest
cd AI-Travel/web
docker compose up -d
```

- 也可以固定到发布标签：

```bash
WEB_IMAGE=crpi-bji5d4nw0bgue6rb.cn-shanghai.personal.cr.aliyuncs.com/travel-ai-project/ai-travel-web:release-acr-test-6 \
  docker compose up -d
```

> 若仓库为私有，则用户需要使用自己的账号登录 ACR；**不要**在文档中公布你的账号密码。

## 方式 B：本地构建镜像

```bash
cd AI-Travel/web
docker build -t ai-travel-web:latest .
WEB_IMAGE=ai-travel-web:latest docker compose up -d
```

## 方式 C：离线镜像（GitHub Actions 产物）

维护者可在 CI 产出 `ai-travel-web-image.tar` 并上传到 Release，用户下载后：

```bash
docker load -i ai-travel-web-image.tar
cd AI-Travel/web
WEB_IMAGE=ai-travel-web:latest docker compose up -d
```

## 环境变量

在 `AI-Travel/web` 目录下复制 `.env.example` 为 `.env` 或 `.env.local` 并填写：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 可选：`IFLYTEK_APP_ID`、`IFLYTEK_API_KEY`、`IFLYTEK_API_SECRET`
- 可选：`NEXT_PUBLIC_AMAP_KEY`
- 服务端（不要加 `NEXT_PUBLIC_` 前缀，防止前端可见）：按通义千问 OpenAI 兼容模板填写：
  - `LLM_PROVIDER=openai-compatible`
  - `DOUBAO_API_KEY`
  - `DOUBAO_MODEL`（如 `qwen3-max` / `qwen-plus` 等）
  - `DOUBAO_API_BASE`（默认 `https://dashscope.aliyuncs.com/compatible-mode/v1`）
- 可选：`PORT`（默认 8080）

Compose 会自动读取 `.env` 与 `.env.local`，无需额外传参。

## 端口与访问

- 默认端口：`8080`，访问 `http://localhost:8080/` 或 `http://localhost:8080/plan`
- 如需使用 `3000`：确保本地没有开发服务器占用，或设置 `PORT=3000 docker compose up -d`

## 安全实践

- **不要**在 README 或仓库中公开任何账号密码或访问令牌。
- CI/CD 登录镜像仓库使用平台的 Secret/变量托管。
- 公开读取镜像时，仅公开“拉取”权限，避免写入权限暴露。
- 前端可见变量必须以 `NEXT_PUBLIC_` 开头；所有敏感密钥（如大模型 API Key）保持为**服务端变量**，由 Next.js 的 Route Handler / Server Actions 使用，例如 `process.env.OPENAI_API_KEY`。