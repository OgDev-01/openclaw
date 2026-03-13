# safe-echo

## Purpose

`safe-echo` is a minimal reference plugin for this workspace. It shows how to ship an OpenClaw plugin manifest, register exactly one tool, and bundle a companion skill.

## Tool ids exposed

- `safe_echo_run`

## Required config fields

This example plugin has no required config. Its `configSchema` is an empty object schema with `additionalProperties: false`.

## OpenClaw enable example

The plugin id is `safe-echo`. The tool id is `safe_echo_run`.

Example allowlist snippet:

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": {
          "allow": ["safe_echo_run", "safe-echo"]
        }
      }
    ]
  }
}
```

## Safety boundaries

- The tool is marked `optional: true`.
- It performs no file system or network side effects.
- It simply echoes a provided string back as text content.

## Local test command

```sh
bun test
bun run build
```

