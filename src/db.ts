import type { Recommendation } from "./types";

export async function insert(
  db: D1Database,
  url: string,
  title: string,
  byline: string,
  excerpt: string,
  content: string,
  siteName: string,
): Promise<{ id: number; inserted: boolean }> {
  const result = await db
    .prepare(
      `INSERT INTO recommendations (url, title, byline, excerpt, content, site_name)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(url) DO NOTHING`,
    )
    .bind(url, title, byline, excerpt, content, siteName)
    .run();

  if (result.meta.changes === 0) {
    return { id: 0, inserted: false };
  }
  return { id: result.meta.last_row_id, inserted: true };
}

export async function remove(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare(`DELETE FROM recommendations WHERE id = ?`)
    .bind(id)
    .run();
  return result.meta.changes > 0;
}

export async function all(db: D1Database): Promise<Recommendation[]> {
  const result = await db
    .prepare(
      `SELECT id, url, title, byline, excerpt, content, site_name, added_at
       FROM recommendations ORDER BY added_at DESC`,
    )
    .all<Recommendation>();
  return result.results;
}
