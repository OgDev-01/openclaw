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
  "plugins/safe-echo/skills/safe-echo-guide/README.md",
  "plugins/x-reader/package.json",
  "plugins/x-reader/tsconfig.json",
  "plugins/x-reader/openclaw.plugin.json",
  "plugins/x-reader/src/index.ts",
  "plugins/x-reader/README.md",
  "plugins/x-reader/skills/x-post-reader/SKILL.md",
  "plugins/x-reader/skills/x-post-reader/README.md"
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

const xReaderManifestPath = resolve(root, "plugins/x-reader/openclaw.plugin.json");
const xReaderManifest = JSON.parse(readFileSync(xReaderManifestPath, "utf8")) as {
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

if (xReaderManifest.id !== "x-reader") {
  console.error("Plugin manifest id must be x-reader.");
  process.exit(1);
}

if (!xReaderManifest.configSchema || typeof xReaderManifest.configSchema !== "object") {
  console.error("x-reader manifest must include an inline configSchema object.");
  process.exit(1);
}

console.log("Structure check passed.");
