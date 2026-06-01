import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncNextToRepoRoot } from "./sync-next-to-repo-root.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");

if (!existsSync(schemaPath)) {
  console.error(
    "\n❌ Prisma schema not found.\n" +
      "   Vercel Root Directory must be: staynep\n" +
      "   (Project Settings → General → Root Directory)\n"
  );
  process.exit(1);
}

const env = { ...process.env };

if (!env.DATABASE_URL) {
  env.DATABASE_URL =
    "postgresql://build:build@127.0.0.1:5432/build?schema=public";
  console.warn(
    "⚠ DATABASE_URL is not set — using a build-only placeholder for prisma generate."
  );
}

if (env.VERCEL && !env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY) {
  console.warn(
    "⚠ NEXT_SERVER_ACTIONS_ENCRYPTION_KEY is not set.\n" +
      "  Server Actions (signup/login) may fail after deploys.\n" +
      "  Add it in Vercel → Settings → Environment Variables (Production + Preview),\n" +
      "  then redeploy. Generate: openssl rand -base64 32"
  );
}

console.log("→ prisma generate");
execSync("npx prisma generate", { stdio: "inherit", cwd: projectRoot, env });

console.log("→ next build");
execSync("npx next build", { stdio: "inherit", cwd: projectRoot, env });

const nextDir = path.join(projectRoot, ".next");
const routesManifest = path.join(nextDir, "routes-manifest.json");
const routesDeterministic = path.join(
  nextDir,
  "routes-manifest-deterministic.json"
);

if (!existsSync(routesManifest)) {
  console.error(
    `\n❌ ${routesManifest} missing after build.\n` +
      "   Confirm Vercel Root Directory is staynep (not the repo root).\n"
  );
  process.exit(1);
}

if (!existsSync(routesDeterministic)) {
  copyFileSync(routesManifest, routesDeterministic);
  console.log("→ created routes-manifest-deterministic.json");
}

if (!env.VERCEL) {
  syncNextToRepoRoot(projectRoot);
}
