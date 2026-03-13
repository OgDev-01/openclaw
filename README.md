# OpenClaw Foundation

This repository is a safety-first workspace for building OpenClaw-compatible skills and plugins.

It is organized around two installable units:

- `skills/`: standalone skill folders intended to be easy to review and publish to ClawHub
- `plugins/`: executable OpenClaw plugins that can register tools and optionally bundle companion skills

## Why this repo exists

The goal is to make every capability independently inspectable before installation. Each skill or plugin lives in its own folder with its own documentation, usage notes, and safety boundaries.

## Repository layout

- `skills/`: standalone skills
- `plugins/`: executable plugins with tool definitions
- `dev/scripts/`: Bun validation scripts for structure and docs checks
- `docs/`: architecture notes and OpenClaw research

## Capabilities

- `skills/repo-orientation`: standalone skill that helps an agent explain a repository's top-level structure
- `plugins/safe-echo`: example plugin with one optional tool and one companion skill

## Install model

Standalone skills are the unit intended for ClawHub publishing.

Plugins are distributed separately and can bundle companion skills through `openclaw.plugin.json`.

## Local workflow

```sh
bun install
bun test
bun run build
```

## Capability docs

Each installable unit has its own `README.md` with:

- purpose
- usage guidance
- safety notes
- install or enable steps
- publish or verification commands where relevant

