import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
