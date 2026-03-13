import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");

const expectedPaths = [
  "README.md",
  "SECURITY.md",
  "docs/openclaw-research.md",
  "docs/architecture.md",
  "skills/repo-orientation/SKILL.md",
  "skills/repo-orientation/README.md",
  "plugins/safe-echo/package.json",
  "plugins/safe-echo/openclaw.plugin.json",
  "plugins/safe-echo/src/index.ts",
  "plugins/safe-echo/README.md",
  "plugins/safe-echo/skills/safe-echo-guide/SKILL.md",
  "plugins/safe-echo/skills/safe-echo-guide/README.md",
  "plugins/x-reader/package.json",
  "plugins/x-reader/openclaw.plugin.json",
  "plugins/x-reader/src/index.ts",
  "plugins/x-reader/README.md",
  "plugins/x-reader/skills/x-post-reader/SKILL.md",
  "plugins/x-reader/skills/x-post-reader/README.md",
  "dev/scripts/check-structure.ts",
  "dev/scripts/check-docs.ts"
];

describe("repo foundation structure", () => {
  test("ships the planned workspace and example capability files", () => {
    for (const path of expectedPaths) {
      expect(existsSync(resolve(root, path))).toBe(true);
    }
  });
});
