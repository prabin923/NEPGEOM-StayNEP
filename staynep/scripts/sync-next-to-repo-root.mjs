import { copyFileSync, cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** When the app lives in staynep/ but Vercel validates .next at repo root. */
export function syncNextToRepoRoot(projectRoot) {
  const repoRoot = path.dirname(projectRoot);
  if (path.basename(projectRoot) !== "staynep") return false;

  const staynepAtRoot = path.join(repoRoot, "staynep");
  if (path.resolve(staynepAtRoot) !== path.resolve(projectRoot)) return false;

  const src = path.join(projectRoot, ".next");
  const dest = path.join(repoRoot, ".next");

  if (!existsSync(src)) return false;

  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });

  const routes = path.join(dest, "routes-manifest.json");
  const deterministic = path.join(dest, "routes-manifest-deterministic.json");
  if (existsSync(routes) && !existsSync(deterministic)) {
    copyFileSync(routes, deterministic);
  }

  console.log(`→ synced .next to ${dest}`);
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
  );
  syncNextToRepoRoot(projectRoot);
}
