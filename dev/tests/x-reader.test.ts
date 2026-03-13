import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import xReaderPlugin, {
  mapFxTwitterResponse,
  parseXPostUrl,
  type AgentLike,
  type ToolDefinition
} from "../../plugins/x-reader/src/index";

const root = resolve(import.meta.dir, "../..");

describe("x-reader plugin", () => {
  test("bundled skill documents the plugin config gate", () => {
    const skill = readFileSync(
      resolve(root, "plugins/x-reader/skills/x-post-reader/SKILL.md"),
      "utf8"
    );

    expect(skill).toContain("metadata:");
    expect(skill).toContain("plugins.entries.x-reader.enabled");
  });

  test("parses accepted X/Twitter status urls and normalizes them", () => {
    expect(
      parseXPostUrl("https://x.com/jack/status/20")
    ).toEqual({
      id: "20",
      screenName: "jack",
      canonicalUrl: "https://x.com/jack/status/20",
      apiUrl: "https://api.fxtwitter.com/jack/status/20"
    });

    expect(
      parseXPostUrl("https://twitter.com/jack/status/20/?s=20")
    ).toEqual({
      id: "20",
      screenName: "jack",
      canonicalUrl: "https://x.com/jack/status/20",
      apiUrl: "https://api.fxtwitter.com/jack/status/20"
    });

    expect(
      parseXPostUrl("https://mobile.twitter.com/jack/status/20?lang=en")
    ).toEqual({
      id: "20",
      screenName: "jack",
      canonicalUrl: "https://x.com/jack/status/20",
      apiUrl: "https://api.fxtwitter.com/jack/status/20"
    });
  });

  test("rejects unsupported urls", () => {
    expect(() => parseXPostUrl("https://x.com/jack")).toThrow(
      "UNSUPPORTED_URL"
    );
    expect(() => parseXPostUrl("https://example.com/not-x")).toThrow(
      "UNSUPPORTED_URL"
    );
  });

  test("maps successful fxtwitter responses into normalized output", () => {
    const result = mapFxTwitterResponse(
      {
        code: 200,
        message: "OK",
        tweet: {
          id: "20",
          url: "https://twitter.com/jack/status/20",
          text: "just setting up my twttr",
          created_at: "2006-03-21T20:50:14.000Z",
          lang: "en",
          author: {
            name: "jack",
            screen_name: "jack"
          },
          replies: 1,
          retweets: 2,
          likes: 3,
          views: 4,
          replying_to: null,
          replying_to_status: null,
          media: {
            photos: [
              {
                type: "photo",
                url: "https://pbs.twimg.com/media/a.jpg",
                width: 100,
                height: 200,
                altText: "alt"
              }
            ],
            videos: [
              {
                type: "video",
                url: "https://video.twimg.com/video.mp4",
                thumbnail_url: "https://pbs.twimg.com/video_thumb.jpg",
                width: 300,
                height: 400,
                format: "video/mp4"
              }
            ]
          },
          quote: {
            id: "21",
            url: "https://twitter.com/other/status/21",
            text: "quoted",
            created_at: "2006-03-22T20:50:14.000Z",
            lang: "en",
            author: {
              name: "other",
              screen_name: "other"
            },
            replies: 5,
            retweets: 6,
            likes: 7,
            views: 8,
            replying_to: null,
            replying_to_status: null,
            media: {}
          }
        }
      },
      "https://x.com/jack/status/20"
    );

    expect(result).toEqual({
      source: "fxtwitter",
      canonicalUrl: "https://x.com/jack/status/20",
      status: "ok",
      post: {
        id: "20",
        url: "https://x.com/jack/status/20",
        text: "just setting up my twttr",
        createdAt: "2006-03-21T20:50:14.000Z",
        lang: "en",
        author: {
          name: "jack",
          screenName: "jack"
        },
        counts: {
          likes: 3,
          retweets: 2,
          replies: 1,
          views: 4
        },
        replyingToScreenName: null,
        replyingToStatusId: null,
        media: [
          {
            type: "photo",
            url: "https://pbs.twimg.com/media/a.jpg",
            width: 100,
            height: 200,
            altText: "alt"
          },
          {
            type: "video",
            url: "https://video.twimg.com/video.mp4",
            thumbnailUrl: "https://pbs.twimg.com/video_thumb.jpg",
            width: 300,
            height: 400,
            format: "video/mp4"
          }
        ],
        quote: {
          id: "21",
          url: "https://x.com/other/status/21",
          text: "quoted",
          createdAt: "2006-03-22T20:50:14.000Z",
          lang: "en",
          author: {
            name: "other",
            screenName: "other"
          },
          counts: {
            likes: 7,
            retweets: 6,
            replies: 5,
            views: 8
          },
          replyingToScreenName: null,
          replyingToStatusId: null,
          media: [],
          quote: null
        }
      }
    });
  });

  test("maps upstream error codes into normalized errors", () => {
    expect(
      mapFxTwitterResponse(
        { code: 401, message: "PRIVATE_TWEET" },
        "https://x.com/jack/status/20"
      )
    ).toEqual({
      source: "fxtwitter",
      canonicalUrl: "https://x.com/jack/status/20",
      status: "error",
      error: {
        code: "PRIVATE_POST",
        message: "PRIVATE_TWEET"
      }
    });

    expect(
      mapFxTwitterResponse(
        { code: 404, message: "NOT_FOUND" },
        "https://x.com/jack/status/20"
      )
    ).toEqual({
      source: "fxtwitter",
      canonicalUrl: "https://x.com/jack/status/20",
      status: "error",
      error: {
        code: "NOT_FOUND",
        message: "NOT_FOUND"
      }
    });

    expect(
      mapFxTwitterResponse(
        { code: 500, message: "API_FAIL" },
        "https://x.com/jack/status/20"
      )
    ).toEqual({
      source: "fxtwitter",
      canonicalUrl: "https://x.com/jack/status/20",
      status: "error",
      error: {
        code: "UPSTREAM_ERROR",
        message: "API_FAIL"
      }
    });
  });

  test("maps malformed payloads to parse errors", () => {
    expect(
      mapFxTwitterResponse(
        { code: 200, message: "OK", tweet: null },
        "https://x.com/jack/status/20"
      )
    ).toEqual({
      source: "fxtwitter",
      canonicalUrl: "https://x.com/jack/status/20",
      status: "error",
      error: {
        code: "PARSE_ERROR",
        message: "Malformed FxTwitter payload"
      }
    });
  });

  test("registers one optional read-only tool and fetches normalized json", async () => {
    const tools: ToolDefinition[] = [];
    const agent: AgentLike = {
      addTool(tool) {
        tools.push(tool);
      }
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          code: 200,
          message: "OK",
          tweet: {
            id: "20",
            url: "https://twitter.com/jack/status/20",
            text: "hello x",
            created_at: "2006-03-21T20:50:14.000Z",
            lang: "en",
            author: {
              name: "jack",
              screen_name: "jack"
            },
            replies: 0,
            retweets: 0,
            likes: 1,
            views: 2,
            replying_to: null,
            replying_to_status: null,
            media: {}
          }
        }),
        { status: 200 }
      );

    try {
      xReaderPlugin.register(agent);

      expect(xReaderPlugin.id).toBe("x-reader");
      expect(tools).toHaveLength(1);
      expect(tools[0]?.name).toBe("x_post_read");
      expect(tools[0]?.optional).toBe(true);
      expect(tools[0]?.annotations?.readOnlyHint).toBe(true);
      expect(tools[0]?.annotations?.idempotentHint).toBe(true);

      const result = await tools[0]!.execute("test", {
        url: "https://x.com/jack/status/20"
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.type).toBe("text");
      expect(JSON.parse(result.content[0]!.text)).toEqual({
        source: "fxtwitter",
        canonicalUrl: "https://x.com/jack/status/20",
        status: "ok",
        post: {
          id: "20",
          url: "https://x.com/jack/status/20",
          text: "hello x",
          createdAt: "2006-03-21T20:50:14.000Z",
          lang: "en",
          author: {
            name: "jack",
            screenName: "jack"
          },
          counts: {
            likes: 1,
            retweets: 0,
            replies: 0,
            views: 2
          },
          replyingToScreenName: null,
          replyingToStatusId: null,
          media: [],
          quote: null
        }
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("returns upstream error when fetch fails", async () => {
    const tools: ToolDefinition[] = [];
    const agent: AgentLike = {
      addTool(tool) {
        tools.push(tool);
      }
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error("network down");
    };

    try {
      xReaderPlugin.register(agent);
      const result = await tools[0]!.execute("test", {
        url: "https://x.com/jack/status/20"
      });

      expect(JSON.parse(result.content[0]!.text)).toEqual({
        source: "fxtwitter",
        canonicalUrl: "https://x.com/jack/status/20",
        status: "error",
        error: {
          code: "UPSTREAM_ERROR",
          message: "network down"
        }
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
