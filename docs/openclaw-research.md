# OpenClaw Research Notes

These notes summarize the OpenClaw docs that shaped this workspace.

## Skills

- OpenClaw skills are directory-based bundles centered on a `SKILL.md` file.
- `SKILL.md` uses YAML frontmatter for metadata plus Markdown instructions.
- Skills can live in local OpenClaw skill directories and can be distributed through ClawHub.
- Skills may rely on built-in tools or plugin-provided tools.

## ClawHub

- ClawHub is the public skills registry for OpenClaw.
- Typical workflows include `clawhub search`, `clawhub install`, `clawhub update`, `clawhub publish`, and `clawhub sync`.
- Publishing is versioned with semver and tags such as `latest`.
- Local changes are compared against registry content before overwrite operations.

## Plugins

- OpenClaw plugins require an `openclaw.plugin.json` manifest at the plugin root.
- The manifest must include `id` and an inline `configSchema`, even for empty config.
- Plugins may declare bundled `skills` directories in the manifest.
- Plugin manifests support validation without executing plugin code.

## Plugin tools

- Plugins can register agent tools and expose them through allowlists.
- Tool names must not conflict with core tool names.
- Optional tools are preferred for side-effectful or extra-dependency behavior.
- Read-only and idempotent hints should be declared where appropriate.

## Workspace implications

- Skills and plugins should be separate top-level units.
- Every capability should have colocated docs so agents can inspect one folder at a time.
- Companion skills belong inside a plugin until there is a good reason to publish them independently.

