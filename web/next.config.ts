import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 显式设置 Turbopack 根目录，避免在 CI/Docker 环境多 lockfile 推断不一致
  // 参考: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
