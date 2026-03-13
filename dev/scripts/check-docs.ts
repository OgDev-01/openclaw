import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");

const docRequirements: Array<{ path: string; sections: string[] }> = [
  {
    path: "skills/repo-orientation/README.md",
    sections: [
      "## What it does",
      "## When to use it",
      "## Required tools/config",
      "## Local install",
      "## Safety notes",
      "## Publish command"
    ]
  },
  {
    path: "plugins/safe-echo/README.md",
    sections: [
      "## Purpose",
      "## Tool ids exposed",
      "## Required config fields",
      "## OpenClaw enable example",
      "## Safety boundaries",
      "## Local test command"
    ]
  },
  {
    path: "plugins/safe-echo/skills/safe-echo-guide/README.md",
    sections: [
      "## What it does",
      "## When to use it",
      "## Required tools/config",
      "## Local install",
      "## Safety notes",
      "## Publish command"
    ]
  }
];

for (const requirement of docRequirements) {
  const content = readFileSync(resolve(root, requirement.path), "utf8");
  for (const section of requirement.sections) {
    if (!content.includes(section)) {
      console.error(`${requirement.path} is missing section: ${section}`);
      process.exit(1);
    }
  }
}

console.log("Docs check passed.");

