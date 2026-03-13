import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import safeEchoPlugin, {
  type AgentLike,
  type ToolDefinition
} from "../../plugins/safe-echo/src/index";

const root = resolve(import.meta.dir, "../..");

describe("documentation and plugin behavior", () => {
  test("bundled plugin skill documents its config gate in frontmatter", () => {
    const skill = readFileSync(
      resolve(root, "plugins/safe-echo/skills/safe-echo-guide/SKILL.md"),
      "utf8"
    );

    expect(skill).toContain("metadata:");
    expect(skill).toContain("plugins.entries.safe-echo.enabled");
  });

  test("safe-echo plugin registers one optional namespaced tool", async () => {
    const tools: ToolDefinition[] = [];
    const agent: AgentLike = {
      addTool(tool) {
        tools.push(tool);
      }
    };

    safeEchoPlugin.register(agent);

    expect(safeEchoPlugin.id).toBe("safe-echo");
    expect(tools).toHaveLength(1);
    expect(tools[0]?.name).toBe("safe_echo_run");
    expect(tools[0]?.optional).toBe(true);
    expect(tools[0]?.annotations?.readOnlyHint).toBe(true);

    const result = await tools[0]!.execute("test", { message: "hello" });
    expect(result).toEqual({
      content: [{ type: "text", text: "hello" }]
    });
  });
});
