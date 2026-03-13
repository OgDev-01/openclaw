import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");

describe("local distribution model", () => {
  test("capability catalog exists for repo-local agent discovery", () => {
    const catalog = readFileSync(resolve(root, "docs/capabilities.md"), "utf8");

    expect(catalog).toContain("# Capability Catalog");
    expect(catalog).toContain("skills/repo-orientation");
    expect(catalog).toContain("plugins/safe-echo");
    expect(catalog).toContain("repo-local");
  });

  test("root docs treat ClawHub as optional future work rather than the default path", () => {
    const readme = readFileSync(resolve(root, "README.md"), "utf8");

    expect(readme).toContain("repo-local");
    expect(readme).toContain("ClawHub is deferred");
  });
});
