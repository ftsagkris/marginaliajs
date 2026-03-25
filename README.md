# Marginalia

A self-hosted article bookmark service that runs on Cloudflare Workers with D1 storage.

Submit URLs, and Marginalia extracts the readable content, stores it, and serves it as an RSS feed or browsable HTML page.

## Deploy

1. Install dependencies:

```sh
npm install
```

2. Create a D1 database:

```sh
npx wrangler d1 create marginalia
```

3. Copy the `database_id` from the output into `wrangler.toml`.

4. Run the migration:

```sh
npm run migrate
```

5. Set your auth token as a secret:

```sh
npx wrangler secret put TOKEN
```

6. (Optional) Set the owner name in `wrangler.toml` under `[vars]`:

```toml
[vars]
OWNER = "Filippos"
```

7. (Optional) Set the theme in `wrangler.toml` under `[vars]`:

```toml
[vars]
THEME = "terminal"
```

Available themes: `terminal` (default), `classic`, `modern`, `daily`, `raw`, `win`.

8. Deploy:

```sh
npm run deploy
```

## Local development

```sh
npm run migrate:local
npm run dev
```

The local dev server uses `.dev.vars` for secrets. Create it with:

```
TOKEN=your-dev-token
```

## API

### Add a recommendation

```sh
curl -X POST 'https://your-worker.workers.dev/recommend?token=TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com/article"}'
```

Returns `201` with `{"id": 1, "title": "Article Title"}`.

### Delete a recommendation

```sh
curl -X DELETE 'https://your-worker.workers.dev/recommend/1?token=TOKEN'
```

Returns `204` on success, `404` if not found.

### RSS feed

```
GET /rss
```

Returns RSS 2.0 XML. Supports `If-None-Match` and `If-Modified-Since` for conditional requests.

### HTML page

```
GET /
```

Browsable list of all recommendations.

## Bookmarklet

Create a browser bookmark with this URL to quickly recommend the current page:

```
javascript:(function(){fetch('https://your-worker.workers.dev/recommend?token=TOKEN',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:location.href})}).then(r=>r.text().then(t=>alert(r.ok?'%E2%9C%93%20Recommended!\n'+t:'Error:%20'+r.status+'\n'+t))).catch(e=>alert('Failed:%20'+e.message))})();
```

Replace `your-worker.workers.dev` and `TOKEN` with your actual worker URL and auth token.

## Apple Shortcut

Use this [Shortcut template](https://www.icloud.com/shortcuts/949e3162cbca41d1b7c8968a226b3be2) to save pages to Marginalia from the iOS/macOS share sheet. After installing, replace the URL and token with your own.

## Migrating from the Go version

If you have an existing SQLite database from the Go version, export it and import into D1:

```sh
sqlite3 marginalia.db .dump > dump.sql
npx wrangler d1 execute marginalia --file=dump.sql
```

## Notes

- The Workers paid plan ($5/month) is recommended. Article extraction (readability parsing) can exceed the free tier's 10ms CPU limit on larger pages.
- D1 has a 1MB row size limit. Extremely long articles may be truncated or fail to store.
