# safe-echo-guide

## What it does

`safe-echo-guide` teaches an agent when to use the bundled `safe_echo_run` plugin tool.

## When to use it

Use it for explicit plugin smoke tests or when a user wants a harmless demonstration of a bundled tool.

## Required tools/config

- Requires the `safe-echo` plugin to be installed and enabled
- Requires access to the `safe_echo_run` tool
- Uses `metadata.openclaw.requires.config` so the bundled skill stays gated behind the plugin enablement path

## Local install

This skill is bundled through `plugins/safe-echo/openclaw.plugin.json` and is not intended to be installed separately in v1.

## Safety notes

- The skill is only for non-sensitive demonstration text.
- It should not be used to pass secrets or hidden tokens through a tool call.

## Verification command

```sh
bun test
```
