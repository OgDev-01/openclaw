# Capability Catalog

This catalog is the repo-local index that OpenClaw agents should inspect before installing or enabling anything from this repository.

## Distribution mode

Everything in this repo is `repo-local` by default.

- Skills are installed from local folders in `skills/`
- Plugins are enabled from local folders in `plugins/`
- Public publishing is intentionally deferred

## Standalone skills

### `skills/repo-orientation`

- Type: standalone skill
- Purpose: explain a repository's top-level structure
- Install path: copy the folder into an OpenClaw skills directory
- Docs: `skills/repo-orientation/README.md`

## Plugins

### `plugins/safe-echo`

- Type: OpenClaw plugin
- Purpose: minimal example plugin with one optional tool
- Tool ids: `safe_echo_run`
- Bundled skills: `plugins/safe-echo/skills/safe-echo-guide`
- Docs: `plugins/safe-echo/README.md`

### `plugins/x-reader`

- Type: OpenClaw plugin
- Purpose: read public X/Twitter post URLs through a normalized read-only tool
- Tool ids: `x_post_read`
- Bundled skills: `plugins/x-reader/skills/x-post-reader`
- Docs: `plugins/x-reader/README.md`

## Agent usage rule

Before using a capability, read the local `README.md` in that capability folder and respect its safety notes and enablement requirements.
