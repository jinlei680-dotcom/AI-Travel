# AI-Travel Web: Docker 离线运行指南

本指南帮助你安全地构建与分发 Docker 镜像：不再将密钥打包进镜像，改为运行时通过 `--env-file` 或 `-e` 注入，避免泄露风险。

重要安全提示：不要将真实密钥放入仓库或镜像。将密钥保存在本地的 `.env` 文件中，通过运行时注入使用。

## 前置要求
- 已安装 Docker（版本 20+）
- 项目根路径：`AI-Travel/web`
- `.env.local` 已配置所有运行所需的环境变量（例如 Supabase、科大讯飞等）

## 环境变量
镜像不会包含任何密钥。请准备一个本地 `.env`（或使用仓库中的 `.env.example` 作为模板），在运行容器时注入。

## 构建镜像
在 `AI-Travel/web` 目录执行：

```bash
docker build -t ai-travel-web:latest .
```

成功后，通过以下命令运行：

```bash
docker run --rm --env-file ./.env -p 3000:3000 ai-travel-web:latest
```

默认监听 `3000` 端口，你也可以改端口：

```bash
docker run --rm --env-file ./.env -e PORT=8080 -p 8080:8080 ai-travel-web:latest
```

## 导出为离线镜像文件
将镜像保存为 `tar` 文件，便于直接分发下载：

```bash
docker save -o ai-travel-web-image.tar ai-travel-web:latest
```

接收方加载镜像：

```bash
docker load -i ai-travel-web-image.tar
```

然后运行：

```bash
docker run --rm --env-file ./.env -p 3000:3000 ai-travel-web:latest
```

## 运行说明
- 默认使用 `npm run start` 启动 Next.js 生产服务（`next start`）
- 镜像包含：构建产物 `.next`、`public`、生产依赖 `node_modules`
- 入口脚本：`scripts/entrypoint.sh`，依赖运行时注入的环境变量，不读取容器内 `.env.local`

## 常见问题
如果页面访问报错，检查运行时注入的环境变量是否包含所有必需的键：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `IFLYTEK_APP_ID`、`IFLYTEK_API_KEY`、`IFLYTEK_API_SECRET`（如使用科大讯飞）
  - 其他第三方服务配置
- 如需隐藏 Key，建议用运行时注入（`docker run -e ...`），或使用私有镜像仓库限制访问权限。

## 安全建议（强烈推荐）
- 使用私有 GitHub Container Registry 或自建 Harbor/Nexus 仓库分发镜像
- 将密钥仅保存在私密环境（本地或 CI 的加密 secrets）
- 不要将含密钥镜像公开发布在公共仓库（任何人都能拉取并查看）

## 目录结构（与镜像相关）
- `Dockerfile`：多阶段构建，生产启动，不包含密钥
- `scripts/entrypoint.sh`：运行时注入环境变量启动 `next start`
- `.dockerignore`：排除不必要的构建上下文

如需自动化发布与版本管理，我可以帮助你添加 GitHub Actions 流水线，自动构建并推送到私有镜像仓库。