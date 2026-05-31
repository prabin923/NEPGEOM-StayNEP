import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  // Prevent Next from treating ~/pnpm-lock.yaml as the monorepo root (causes hung builds).
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
