import type { MiddlewareHandler } from "hono";

interface Options {
  limit: number;
  windowMs: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

export function rateLimit({ limit, windowMs }: Options): MiddlewareHandler {
  const store = new Map<string, Entry>();

  return async (c, next) => {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return c.json({ error: "Too many requests" }, 429);
    }

    entry.count++;
    return next();
  };
}
