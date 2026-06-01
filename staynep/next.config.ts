import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Do not bundle Prisma — avoids stale generated client in webpack HMR */
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  generateBuildId: async () => {
    return (
      process.env.VERCEL_GIT_COMMIT_SHA ??
      process.env.GITHUB_SHA ??
      `local-${Date.now()}`
    );
  },
};

export default nextConfig;
