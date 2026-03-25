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

export function renderHTML(recs: Recommendation[], title: string): string {
  let items: string;

  if (recs.length === 0) {
    items = "<li>No recommendations yet.</li>";
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
  :root { color-scheme: light dark; }
  body {
    font-family: system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.55;
    letter-spacing: -0.003em;
    font-kerning: normal;
    text-rendering: optimizeLegibility;
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1rem;
    background: #fff;
    color: #111;
  }
  header { display: flex; align-items: baseline; justify-content: space-between; }
  h1 { font-size: 1.6rem; line-height: 1.2; margin-bottom: 0.3em; }
  .rss-link { color: #666; font-size: 0.85em; text-decoration: none; font-weight: normal; display: inline-flex; align-items: center; gap: 0.3em; }
  .rss-link:hover { color: #1a4fd8; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin-bottom: 0; padding: 0.85em 0; border-bottom: 1px solid #e3e3e3; }
  li:last-child { border-bottom: none; padding-bottom: 0; }
  a { color: #1a4fd8; text-decoration: none; font-weight: 600; }
  a:visited { color: #1a4fd8; }
  a:hover { color: #0f3fb5; }
  a:active { color: #0c3290; }
  .meta { color: #666; font-size: 0.85em; margin-top: 0.2em; }
  footer {
    margin-top: 1em;
    padding-top: 1em;
    border-top: 1px solid #e3e3e3;
    font-size: 0.85em;
    color: #666;
  }
  footer a, footer a:visited, footer a:hover, footer a:active {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.12em;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #111; color: #eee; }
    li { border-bottom-color: #333; }
    .meta { color: #aaa; }
    a { color: #7aa2ff; }
    a:visited { color: #7aa2ff; }
    a:hover { color: #9db8ff; }
    a:active { color: #5f86e8; }
    footer { border-top-color: #333; color: #aaa; }
  }
  @media (max-width: 700px) {
    body { font-size: 18px; line-height: 1.56; }
  }
</style>
</head>
<body>
<header>
  <h1>${t}</h1>
  <a class="rss-link" href="/rss" title="RSS Feed"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><circle cx="68" cy="189" r="28"/><path d="M160 213h-34a89 89 0 0 0-89-89V90a123 123 0 0 1 123 123z"/><path d="M224 213h-34a157 157 0 0 0-157-157V22a191 191 0 0 1 191 191z"/></svg> RSS</a>
</header>
<ul>
${items}
</ul>
<footer>
  <a href="/rss">RSS Feed</a>
</footer>
</body>
</html>`;
}
