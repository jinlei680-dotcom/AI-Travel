import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Fix Turbopack workspace root to this web project to avoid
  // mis-detected root due to multiple lockfiles at monorepo level.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
