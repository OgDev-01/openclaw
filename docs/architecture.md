# Architecture Overview

## Design goals

- Keep capabilities independently reviewable.
- Separate prompt-only skills from executable tools.
- Minimize hidden coupling between installable units.
- Use Bun for workspace management while keeping plugin runtime output portable.

## Top-level model

### `skills/`

Standalone skill folders are the primary distribution unit for ClawHub.

Each folder contains:

- `SKILL.md`
- `README.md`
- optional local scripts or assets

### `plugins/`

Plugins contain executable OpenClaw extensions.

Each plugin folder contains:

- `package.json`
- `openclaw.plugin.json`
- `src/`
- `README.md`
- optional `skills/` companion folders

## Naming conventions

- Skill folders use kebab-case.
- Plugin ids use kebab-case.
- Tool ids are namespaced with the plugin identity in snake case, such as `safe_echo_run`.

## Validation model

- `bun test` verifies repo expectations.
- `bun run check:structure` validates file presence and manifest basics.
- `bun run check:docs` validates required documentation sections.
- `bun run build` compiles the example plugin and reruns repo validation scripts.

## Safety boundaries

- Installable capabilities do not share runtime code.
- Dev-only validation scripts may share helpers later if needed.
- Plugin tools are documented locally and should default to opt-in when they have side effects or external requirements.

