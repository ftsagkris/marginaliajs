import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types";
import * as db from "./db";
import { fromURL } from "./extract";
import { renderRSS, ownerTitle } from "./feed";
import { renderHTML } from "./html";
import { loadTheme } from "./themes";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Token auth middleware for write endpoints
const requireToken = async (
  c: { req: { query: (key: string) => string | undefined }; env: Env; json: (data: unknown, status: number) => Response },
  next: () => Promise<void>,
) => {
  if (c.req.query("token") !== c.env.TOKEN) {
    return c.json({ error: "unauthorized" }, 401);
  }
  await next();
};

app.post("/recommend", requireToken, async (c) => {
  const body = await c.req.json<{ url?: string }>().catch(() => ({ url: undefined }));
  if (!body.url) {
    return c.json({ error: "missing or invalid url" }, 400);
  }

  let article;
  try {
    article = await fromURL(body.url);
  } catch (err) {
    return c.json(
      { error: `extraction failed: ${err instanceof Error ? err.message : err}` },
      502,
    );
  }

  const result = await db.insert(
    c.env.DB,
    body.url,
    article.title,
    article.byline,
    article.excerpt,
    article.content,
    article.siteName,
  );

  if (!result.inserted) {
    return c.json({ error: "url already exists" }, 409);
  }

  console.log(`added: ${body.url} — ${article.title}`);
  return c.json({ id: result.id, title: article.title }, 201);
});

app.delete("/recommend/:id", requireToken, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "invalid id" }, 400);
  }

  const found = await db.remove(c.env.DB, id);
  if (!found) {
    return c.json({ error: "not found" }, 404);
  }
  return c.body(null, 204);
});

app.get("/rss", async (c) => {
  const recs = await db.all(c.env.DB);
  const xml = renderRSS(recs, c.env.OWNER);

  // ETag: SHA-256 of the feed, first 8 bytes as hex
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(xml),
  );
  const hashBytes = new Uint8Array(hashBuffer).slice(0, 8);
  const etag =
    '"' +
    Array.from(hashBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("") +
    '"';

  // Last-Modified: most recent item's timestamp
  const lastMod =
    recs.length > 0
      ? new Date(recs[0].added_at * 1000)
      : new Date();

  c.header("Content-Type", "application/rss+xml");
  c.header("ETag", etag);
  c.header("Last-Modified", lastMod.toUTCString());
  c.header("Cache-Control", "no-store, must-revalidate");

  // Conditional GET: If-None-Match
  if (c.req.header("If-None-Match") === etag) {
    return c.body(null, 304);
  }

  // Conditional GET: If-Modified-Since
  const ims = c.req.header("If-Modified-Since");
  if (ims) {
    const imsDate = new Date(ims);
    if (!isNaN(imsDate.getTime()) && lastMod <= imsDate) {
      return c.body(null, 304);
    }
  }

  return c.body(xml);
});

app.get("/", async (c) => {
  const recs = await db.all(c.env.DB);
  const title = ownerTitle(c.env.OWNER);
  const style = loadTheme(c.env.THEME);
  const html = renderHTML(recs, title, style);
  return c.html(html);
});

export default app;
