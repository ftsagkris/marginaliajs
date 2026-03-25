import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export interface Article {
  title: string;
  byline: string;
  excerpt: string;
  content: string;
  siteName: string;
}

export async function fromURL(url: string): Promise<Article> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Marginalia/1.0; +https://github.com/marginaliajs)",
    },
  });

  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const { document } = parseHTML(html);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reader = new Readability(document as any);
  const article = reader.parse();

  if (!article) {
    throw new Error("readability could not parse the page");
  }

  return {
    title: article.title || "",
    byline: article.byline || "",
    excerpt: article.excerpt || "",
    content: article.content || "",
    siteName: article.siteName || "",
  };
}
