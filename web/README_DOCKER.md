# AI-Travel Web: Docker 离线运行指南

本指南帮助你构建包含全部 API Key 的 Docker 镜像，并将其打包为 `tar` 文件进行分发，确保下载后无需额外配置即可运行。

重要安全提示：将敏感密钥打包进镜像会造成密钥泄露风险。请仅在受信任的分发渠道和私有环境中使用此方式，建议使用私有仓库或仅在内网传输。

## 前置要求
- 已安装 Docker（版本 20+）
- 项目根路径：`AI-Travel/web`
- `.env.local` 已配置所有运行所需的环境变量（例如 Supabase、科大讯飞等）

## 环境变量
镜像会内置 `AI-Travel/web/.env.local` 中的所有变量，并在启动时自动注入环境中。无需 `-e` 或 `--env-file`。

## 构建镜像
在 `AI-Travel/web` 目录执行：

```bash
docker build -t ai-travel-web:latest .
```

成功后，通过以下命令运行：

```bash
docker run --rm -p 3000:3000 ai-travel-web:latest
```

默认监听 `3000` 端口，你也可以改端口：

```bash
docker run --rm -e PORT=8080 -p 8080:8080 ai-travel-web:latest
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
docker run --rm -p 3000:3000 ai-travel-web:latest
```

## 运行说明
- 默认使用 `npm run start` 启动 Next.js 生产服务（`next start`）
- 镜像已包含：构建产物 `.next`、`public`、生产依赖 `node_modules`、以及 `.env.local`
- 入口脚本：`scripts/entrypoint.sh`，会自动加载 `.env.local` 并启动服务

## 常见问题
- 如果页面访问报错，检查 `.env.local` 是否包含所有必需的键：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `IFLYTEK_APP_ID`、`IFLYTEK_API_KEY`、`IFLYTEK_API_SECRET`（如使用科大讯飞）
  - 其他第三方服务配置
- 如需隐藏 Key，建议用运行时注入（`docker run -e ...`），或使用私有镜像仓库限制访问权限。

## 安全建议（强烈推荐）
- 使用私有 GitHub Container Registry 或自建 Harbor/Nexus 仓库分发镜像
- 为镜像设置短期可撤销的 Key，并在分发后监控使用情况
- 不要将含密钥镜像公开发布在公共仓库（任何人都能拉取并查看）

## 目录结构（与镜像相关）
- `Dockerfile`：多阶段构建，包含 `.env.local` 注入和生产启动
- `scripts/entrypoint.sh`：启动前加载环境变量并运行 `next start`
- `.dockerignore`：排除不必要的构建上下文

如需自动化发布与版本管理，我可以帮助你添加 GitHub Actions 流水线，自动构建并推送到私有镜像仓库。