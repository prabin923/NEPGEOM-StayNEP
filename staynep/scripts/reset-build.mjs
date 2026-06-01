import { execSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fullClean = process.argv.includes("--full");

if (process.env.VERCEL) {
  process.exit(0);
}

if (!process.env.VERCEL && !process.env.CI) {
  try {
    execSync("pkill -f 'staynep/.+next build' || true", { stdio: "ignore" });
    execSync("pkill -f 'staynep/.+postcss.js' || true", { stdio: "ignore" });
  } catch {
    // ignore
  }
}

const lockFiles = [
  path.join(projectRoot, ".next", "lock"),
  path.join(projectRoot, ".next", "dev", "lock"),
];

for (const lockFile of lockFiles) {
  if (existsSync(lockFile)) {
    rmSync(lockFile, { force: true });
  }
}

if (fullClean) {
  const nextDir = path.join(projectRoot, ".next");
  if (existsSync(nextDir)) {
    rmSync(nextDir, { recursive: true, force: true });
  }
  console.log("Full build cache cleared.");
} else {
  console.log("Stale build processes and lock files cleared.");
}
