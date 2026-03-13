---
name: safe_echo_guide
description: Use the safe-echo plugin tool when the user wants a harmless echo-style response for testing.
metadata: {"openclaw":{"requires":{"config":["plugins.entries.safe-echo.enabled"]}}}
---

# Safe Echo Guide

This skill is intended to be bundled with the `safe-echo` plugin.

## What to do

- Use the `safe_echo_run` tool when a user explicitly wants to test that the plugin tool path is working.
- Pass through a short approved message.
- Explain that the tool is a minimal example and does not perform external side effects.

## Safety notes

- Do not use this tool for secrets or credentials.
- Keep messages short and user-visible.
- If the plugin is not enabled, say so plainly instead of assuming it is available.
