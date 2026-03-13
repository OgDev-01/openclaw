# x-post-reader

## What it does

`x-post-reader` teaches an agent to use the `x_post_read` plugin tool for public X/Twitter post URLs.

## When to use it

Use it when a user shares a public X/Twitter post link or asks for the contents of a specific public post.

## Required tools/config

- Requires the `x-reader` plugin to be installed and enabled
- Requires access to the `x_post_read` tool
- Uses `metadata.openclaw.requires.config` so the skill is only eligible when the plugin is enabled

## Local install

This skill is bundled through `plugins/x-reader/openclaw.plugin.json` and is not intended to be installed separately in v1.

## Safety notes

- Public post URLs only
- No login, timeline, search, or private content support
- The skill should summarize tool output rather than re-fetch the page through browser tooling

## Limitations

- Depends on a third-party mirror endpoint
- Reads individual public post URLs only
- Does not expand full reply trees or profile timelines

## Verification command

```sh
bun test
```
