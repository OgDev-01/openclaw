---
name: x_post_reader
description: Read and summarize a public X or Twitter post URL through the x-reader plugin tool.
metadata: {"openclaw":{"requires":{"config":["plugins.entries.x-reader.enabled"]}}}
---

# X Post Reader

Use this skill when the user gives you a public X/Twitter post URL or explicitly asks you to read a public post.

## What to do

- Call the `x_post_read` tool with the provided permalink.
- Use the returned JSON as the source of truth.
- Summarize the post contents, author, media, and basic interaction counts for the user.

## Safety notes

- Do not try to browse x.com directly when this skill applies.
- Do not use this for private or authenticated content.
- If the tool returns an error, explain the failure clearly instead of retrying through browser automation.

