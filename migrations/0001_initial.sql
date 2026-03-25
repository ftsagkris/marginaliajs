CREATE TABLE recommendations (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  url       TEXT NOT NULL UNIQUE,
  title     TEXT,
  byline    TEXT,
  excerpt   TEXT,
  content   TEXT,
  site_name TEXT,
  added_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
