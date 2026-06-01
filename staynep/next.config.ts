import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Do not bundle Prisma — avoids stale generated client in webpack HMR */
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
