import type { Recommendation } from "./types";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRFC1123(ts: number): string {
  return new Date(ts * 1000).toUTCString();
}

export function ownerTitle(owner: string): string {
  if (!owner) return "Marginalia";
  if (owner.endsWith("s") || owner.endsWith("S")) {
    return owner + "' Marginalia";
  }
  return owner + "'s Marginalia";
}

export function renderRSS(recs: Recommendation[], owner: string): string {
  const title = ownerTitle(owner);
  const desc = owner
    ? `Articles worth reading, recommended by ${owner}`
    : "Articles worth reading";

  const items = recs
    .map(
      (r) => `    <item>
      <title>${escapeXml(r.title || "")}</title>
      <link>${escapeXml(r.url)}</link>
      <description>${escapeXml(r.excerpt || "")}</description>
      <content:encoded><![CDATA[${r.content || ""}]]></content:encoded>${r.byline ? `\n      <author>${escapeXml(r.byline)}</author>` : ""}
      <pubDate>${formatRFC1123(r.added_at)}</pubDate>
      <guid>${escapeXml(r.url)}</guid>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(desc)}</description>
${items}
  </channel>
</rss>`;
}
