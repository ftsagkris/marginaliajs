import type { Recommendation } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function renderHTML(recs: Recommendation[], title: string, style: string): string {
  let items: string;

  if (recs.length === 0) {
    items = '<li class="empty">Nothing here yet.</li>';
  } else {
    items = recs
      .map((r) => {
        let meta = "";
        if (r.byline) meta += `by ${escapeHtml(r.byline)}`;
        if (r.byline && r.site_name) meta += " &middot; ";
        if (r.site_name) meta += escapeHtml(r.site_name);
        if (r.byline || r.site_name) meta += " &middot; ";
        meta += formatDate(r.added_at);

        return `<li>
  <a href="${escapeHtml(r.url)}">${escapeHtml(r.title || r.url)}</a>
  <div class="meta">${meta}</div>
</li>`;
      })
      .join("\n");
  }

  const t = escapeHtml(title);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<link rel="alternate" type="application/rss+xml" title="${t}" href="/rss">
<style>
${style}
</style>
</head>
<body>
<header>
  <h1>${t}</h1>
  <a class="rss-link" href="/rss" title="RSS Feed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><circle cx="68" cy="189" r="28"/><path d="M160 213h-34a89 89 0 0 0-89-89V90a123 123 0 0 1 123 123z"/><path d="M224 213h-34a157 157 0 0 0-157-157V22a191 191 0 0 1 191 191z"/></svg> RSS</a>
</header>
<hr>
<ul>
${items}
</ul>
<footer>
  <a href="/rss">RSS Feed</a>
</footer>
</body>
</html>`;
}
