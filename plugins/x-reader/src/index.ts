export type ToolDefinition = {
  name: string;
  description: string;
  optional?: boolean;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    idempotentHint?: boolean;
    destructiveHint?: boolean;
  };
  inputSchema: {
    type: "object";
    additionalProperties: false;
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (_id: string, params: { url: string }) => Promise<{
    content: Array<{ type: "text"; text: string }>;
  }>;
};

export type AgentLike = {
  addTool: (tool: ToolDefinition) => void;
};

export type PluginLike = {
  id: string;
  register: (agent: AgentLike) => void;
};

export type NormalizedErrorCode =
  | "UNSUPPORTED_URL"
  | "PRIVATE_POST"
  | "NOT_FOUND"
  | "UPSTREAM_ERROR"
  | "PARSE_ERROR";

export type NormalizedMedia =
  | {
      type: "photo";
      url: string;
      width: number | null;
      height: number | null;
      altText: string | null;
    }
  | {
      type: "video" | "gif";
      url: string;
      thumbnailUrl: string | null;
      width: number | null;
      height: number | null;
      format: string | null;
    }
  | {
      type: "external";
      url: string;
      width: number | null;
      height: number | null;
      duration: number | null;
    };

export type NormalizedPost = {
  id: string;
  url: string;
  text: string;
  createdAt: string;
  lang: string | null;
  author: {
    name: string;
    screenName: string;
  };
  counts: {
    likes: number | null;
    retweets: number | null;
    replies: number | null;
    views: number | null;
  };
  replyingToScreenName: string | null;
  replyingToStatusId: string | null;
  media: NormalizedMedia[];
  quote: NormalizedPost | null;
};

export type NormalizedResult =
  | {
      source: "fxtwitter";
      canonicalUrl: string;
      status: "ok";
      post: NormalizedPost;
    }
  | {
      source: "fxtwitter";
      canonicalUrl: string;
      status: "error";
      error: {
        code: NormalizedErrorCode;
        message: string;
      };
    };

type ParsedXUrl = {
  id: string;
  screenName: string | null;
  canonicalUrl: string;
  apiUrl: string;
};

type FxTwitterAuthor = {
  name?: unknown;
  screen_name?: unknown;
};

type FxTwitterPhoto = {
  type?: unknown;
  url?: unknown;
  width?: unknown;
  height?: unknown;
  altText?: unknown;
};

type FxTwitterVideo = {
  type?: unknown;
  url?: unknown;
  thumbnail_url?: unknown;
  width?: unknown;
  height?: unknown;
  format?: unknown;
};

type FxTwitterExternalMedia = {
  url?: unknown;
  width?: unknown;
  height?: unknown;
  duration?: unknown;
};

type FxTwitterTweet = {
  id?: unknown;
  url?: unknown;
  text?: unknown;
  created_at?: unknown;
  lang?: unknown;
  author?: FxTwitterAuthor | null;
  likes?: unknown;
  retweets?: unknown;
  replies?: unknown;
  views?: unknown;
  replying_to?: unknown;
  replying_to_status?: unknown;
  media?:
    | {
        photos?: FxTwitterPhoto[] | null;
        videos?: FxTwitterVideo[] | null;
        external?: FxTwitterExternalMedia | null;
      }
    | null;
  quote?: FxTwitterTweet | null;
};

type FxTwitterResponse = {
  code?: unknown;
  message?: unknown;
  tweet?: FxTwitterTweet | null;
};

const X_HOSTS = new Set(["x.com", "twitter.com", "mobile.twitter.com", "www.twitter.com", "www.x.com"]);

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function unsupportedUrl(url: string): never {
  throw new Error(`UNSUPPORTED_URL:${url}`);
}

export function parseXPostUrl(url: string): ParsedXUrl {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    unsupportedUrl(url);
  }

  if (!X_HOSTS.has(parsed.hostname)) {
    unsupportedUrl(url);
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  const statusIndex = parts.findIndex((part) => part === "status");

  if (statusIndex !== 1 || parts.length < 3) {
    unsupportedUrl(url);
  }

  const screenName = parts[0] ?? null;
  const id = parts[2];

  if (!screenName || !id || !/^\d+$/.test(id)) {
    unsupportedUrl(url);
  }

  return {
    id,
    screenName,
    canonicalUrl: `https://x.com/${screenName}/status/${id}`,
    apiUrl: `https://api.fxtwitter.com/${screenName}/status/${id}`
  };
}

function normalizeMedia(media: FxTwitterTweet["media"]): NormalizedMedia[] {
  if (!media || typeof media !== "object") {
    return [];
  }

  const photos = Array.isArray(media.photos)
    ? media.photos.flatMap((photo) => {
        const url = asString(photo.url);
        if (!url) {
          return [];
        }
        return [
          {
            type: "photo" as const,
            url,
            width: asNumber(photo.width),
            height: asNumber(photo.height),
            altText: asString(photo.altText)
          }
        ];
      })
    : [];

  const videos = Array.isArray(media.videos)
    ? media.videos.flatMap((video) => {
        const url = asString(video.url);
        const type = asString(video.type);
        if (!url || (type !== "video" && type !== "gif")) {
          return [];
        }
        return [
          {
            type: type as "video" | "gif",
            url,
            thumbnailUrl: asString(video.thumbnail_url),
            width: asNumber(video.width),
            height: asNumber(video.height),
            format: asString(video.format)
          }
        ];
      })
    : [];

  const external =
    media.external && typeof media.external === "object" && asString(media.external.url)
      ? [
          {
            type: "external" as const,
            url: asString(media.external.url)!,
            width: asNumber(media.external.width),
            height: asNumber(media.external.height),
            duration: asNumber(media.external.duration)
          }
        ]
      : [];

  return [...photos, ...videos, ...external];
}

function normalizePost(tweet: FxTwitterTweet): NormalizedPost | null {
  const id = asString(tweet.id);
  const text = asString(tweet.text);
  const createdAt = asString(tweet.created_at);
  const author = tweet.author && typeof tweet.author === "object" ? tweet.author : null;
  const authorName = author ? asString(author.name) : null;
  const authorScreenName = author ? asString(author.screen_name) : null;

  if (!id || !text || !createdAt || !authorName || !authorScreenName) {
    return null;
  }

  const quote =
    tweet.quote && typeof tweet.quote === "object" ? normalizePost(tweet.quote) : null;
  const url = `https://x.com/${authorScreenName}/status/${id}`;

  return {
    id,
    url,
    text,
    createdAt,
    lang: asString(tweet.lang),
    author: {
      name: authorName,
      screenName: authorScreenName
    },
    counts: {
      likes: asNumber(tweet.likes),
      retweets: asNumber(tweet.retweets),
      replies: asNumber(tweet.replies),
      views: asNumber(tweet.views)
    },
    replyingToScreenName: asString(tweet.replying_to),
    replyingToStatusId: asString(tweet.replying_to_status),
    media: normalizeMedia(tweet.media),
    quote
  };
}

export function mapFxTwitterResponse(
  payload: FxTwitterResponse,
  canonicalUrl: string
): NormalizedResult {
  const code = asNumber(payload.code);
  const message = asString(payload.message) ?? "Unknown FxTwitter response";

  if (code === 200) {
    const tweet = payload.tweet && typeof payload.tweet === "object" ? payload.tweet : null;
    const normalized = tweet ? normalizePost(tweet) : null;

    if (!normalized) {
      return {
        source: "fxtwitter",
        canonicalUrl,
        status: "error",
        error: {
          code: "PARSE_ERROR",
          message: "Malformed FxTwitter payload"
        }
      };
    }

    return {
      source: "fxtwitter",
      canonicalUrl,
      status: "ok",
      post: normalized
    };
  }

  if (code === 401) {
    return {
      source: "fxtwitter",
      canonicalUrl,
      status: "error",
      error: {
        code: "PRIVATE_POST",
        message
      }
    };
  }

  if (code === 404) {
    return {
      source: "fxtwitter",
      canonicalUrl,
      status: "error",
      error: {
        code: "NOT_FOUND",
        message
      }
    };
  }

  return {
    source: "fxtwitter",
    canonicalUrl,
    status: "error",
    error: {
      code: "UPSTREAM_ERROR",
      message
    }
  };
}

function createErrorResult(
  canonicalUrl: string,
  code: NormalizedErrorCode,
  message: string
): NormalizedResult {
  return {
    source: "fxtwitter",
    canonicalUrl,
    status: "error",
    error: {
      code,
      message
    }
  };
}

async function fetchFxTwitter(apiUrl: string): Promise<FxTwitterResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        accept: "application/json"
      }
    });

    return (await response.json()) as FxTwitterResponse;
  } finally {
    clearTimeout(timeout);
  }
}

const xReaderPlugin: PluginLike = {
  id: "x-reader",
  register(agent) {
    agent.addTool({
      name: "x_post_read",
      description: "Read a public X or Twitter post URL through a normalized read-only mirror response.",
      optional: true,
      annotations: {
        title: "X Post Read",
        readOnlyHint: true,
        idempotentHint: true,
        destructiveHint: false
      },
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          url: {
            type: "string",
            description: "A public x.com or twitter.com post permalink."
          }
        },
        required: ["url"]
      },
      async execute(_id, params) {
        let parsed: ParsedXUrl;
        try {
          parsed = parseXPostUrl(params.url);
        } catch (error) {
          const message =
            error instanceof Error && error.message.startsWith("UNSUPPORTED_URL")
              ? "Unsupported X/Twitter post URL"
              : "Failed to parse X/Twitter post URL";

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  createErrorResult(params.url, "UNSUPPORTED_URL", message)
                )
              }
            ]
          };
        }

        try {
          const payload = await fetchFxTwitter(parsed.apiUrl);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  mapFxTwitterResponse(payload, parsed.canonicalUrl)
                )
              }
            ]
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to reach FxTwitter";

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  createErrorResult(parsed.canonicalUrl, "UPSTREAM_ERROR", message)
                )
              }
            ]
          };
        }
      }
    });
  }
};

export default xReaderPlugin;
