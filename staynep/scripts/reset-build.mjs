import { execSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

try {
  execSync("pkill -f 'staynep/.+next build' || true", { stdio: "ignore" });
  execSync("pkill -f 'staynep/.+postcss.js' || true", { stdio: "ignore" });
} catch {
  // ignore
}

const nextDir = path.join(projectRoot, ".next");
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
}

console.log("Build cache and stale processes cleared.");
