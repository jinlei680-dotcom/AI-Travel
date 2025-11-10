#!/bin/sh
set -e

# 不再读取容器内的 .env.local；改为依赖运行时注入的环境变量（-e 或 --env-file）

# Default port 3000 unless overridden by PORT env
PORT_TO_USE=${PORT:-3000}

echo "Starting Next.js server on port ${PORT_TO_USE}"
npm run start -- -p ${PORT_TO_USE}