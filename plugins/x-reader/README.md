# x-reader

## Purpose

`x-reader` is a repo-local OpenClaw plugin for reading public X or Twitter post URLs through a normalized, read-only tool.

## Accepted URL formats

- `https://x.com/<user>/status/<id>`
- `https://twitter.com/<user>/status/<id>`
- `https://mobile.twitter.com/<user>/status/<id>`

Query strings and trailing slashes are ignored during normalization.

## Upstream dependency note

This plugin depends on the public FixTweet/FxTwitter status endpoint:

- `https://api.fxtwitter.com/:screen_name?/status/:id`

That upstream may change, rate-limit, or become unavailable, so this tool is marked `optional: true`.

## Privacy and safety note

- This plugin reads only public post URLs.
- It must not be used for private posts or authenticated account content.
- It does not silently fall back to browser automation or login flows.
- If the upstream fails, the tool returns a clear normalized error payload.

## OpenClaw enable example

The plugin id is `x-reader`. The tool id is `x_post_read`.

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "tools": {
          "allow": ["x_post_read", "x-reader"]
        }
      }
    ]
  }
}
```

## Local test command

```sh
bun test
bun run build
```

