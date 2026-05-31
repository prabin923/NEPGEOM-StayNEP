import { execSync, spawn } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit" });
}

try {
  run("pkill -f 'staynep/.+next dev' || true");
  run("pkill -f 'staynep/.+next-server' || true");
} catch {
  // ignore
}

const nextDir = path.join(root, ".next");
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
}

console.log("Starting dev server (webpack) on http://localhost:3000 …\n");

const child = spawn("npx", ["next", "dev", "--webpack", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, TURBOPACK: "" },
});

child.on("exit", (code) => process.exit(code ?? 0));
