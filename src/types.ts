export interface Env {
  DB: D1Database;
  TOKEN: string;
  OWNER: string;
}

export interface Recommendation {
  id: number;
  url: string;
  title: string;
  byline: string;
  excerpt: string;
  content: string;
  site_name: string;
  added_at: number;
}
