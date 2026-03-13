# repo-orientation

## What it does

`repo-orientation` helps an agent explain a repository's top-level structure before deeper implementation begins.

## When to use it

Use it when someone asks for a quick project tour, a folder breakdown, or help understanding where to start.

## Required tools/config

- No custom plugin or external config required
- Uses the agent's existing file inspection tools

## Local install

Copy this folder into an OpenClaw skills directory such as `~/.openclaw/workspace/skills/`.

## Safety notes

- The skill instructs the agent to summarize only what is actually present in the repo.
- It avoids shelling out with user-provided input.

## Verification command

```sh
bun test
```
