import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");

const requiredPaths = [
  "README.md",
  "SECURITY.md",
  "docs/openclaw-research.md",
  "docs/architecture.md",
  "skills/repo-orientation/SKILL.md",
  "skills/repo-orientation/README.md",
  "plugins/safe-echo/package.json",
  "plugins/safe-echo/tsconfig.json",
  "plugins/safe-echo/openclaw.plugin.json",
  "plugins/safe-echo/src/index.ts",
  "plugins/safe-echo/README.md",
  "plugins/safe-echo/skills/safe-echo-guide/SKILL.md",
  "plugins/safe-echo/skills/safe-echo-guide/README.md"
];

const missing = requiredPaths.filter((path) => !existsSync(resolve(root, path)));

if (missing.length > 0) {
  console.error("Missing required files:");
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

const manifestPath = resolve(root, "plugins/safe-echo/openclaw.plugin.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  id?: string;
  configSchema?: unknown;
};

if (manifest.id !== "safe-echo") {
  console.error("Plugin manifest id must be safe-echo.");
  process.exit(1);
}

if (!manifest.configSchema || typeof manifest.configSchema !== "object") {
  console.error("Plugin manifest must include an inline configSchema object.");
  process.exit(1);
}

console.log("Structure check passed.");

