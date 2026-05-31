import type { NextConfig } from "next";
import path from "path";

const projectRoot = process.cwd();

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
