# OpenClaw Foundation

This repository is a safety-first workspace for building OpenClaw-compatible skills and plugins.

It is organized around two installable units:

- `skills/`: standalone skill folders intended to be easy to review and install from this repo
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
- `plugins/x-reader`: public X/Twitter post reader plugin with one bundled skill

For a machine-readable human-facing index, start with `docs/capabilities.md`.

## Install model

This repo is `repo-local` first.

- OpenClaw agents should inspect this repository directly and use the colocated docs to decide what to install or enable.
- Standalone skills live under `skills/` and can be copied into an OpenClaw skills directory.
- Plugins live under `plugins/` and can bundle companion skills through `openclaw.plugin.json`.

ClawHub is deferred for now. If you decide to publish later, the local folder structure is already compatible with that future path.

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
- repo-local install or enable steps
- verification commands
