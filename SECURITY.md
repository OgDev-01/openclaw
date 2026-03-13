# Security Policy

## Trust model

This repo assumes that installable AI capabilities should be reviewable at the folder level before use.

- Skills must remain readable, self-contained instruction bundles.
- Plugins must keep dependencies minimal and expose only clearly documented tools.
- Shared runtime code across installable capabilities is avoided on purpose.

## Review checklist

Before installing, publishing, or sharing a capability, review:

1. The local `README.md`
2. The skill `SKILL.md` or plugin `openclaw.plugin.json`
3. Any bundled scripts or assets
4. Dependency lists for plugin packages
5. Tool names, side effects, and required config

## Publishing rules

- Publish standalone skills from reviewed source-controlled folders only.
- Treat ClawHub as a distribution channel, not as a trust guarantee.
- Use semver and changelogs when publishing skills.
- Do not publish generated or partially reviewed folders.

## Dependency policy

- Prefer zero-runtime-dependency skills.
- Keep plugin dependencies pinned and minimal.
- Avoid `postinstall` hooks, opaque binaries, and native modules in early versions.
- Keep plugin runtime compatible with standard Node/OpenClaw expectations instead of Bun-only runtime APIs.

## Tool safety rules

- Default new side-effectful or credentialed tools to `optional: true`.
- Avoid tool names that could collide with OpenClaw core tool names.
- Never interpolate untrusted input into shell commands from a skill.
- Document every required credential, binary, or environment dependency beside the capability that uses it.

