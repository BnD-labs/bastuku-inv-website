CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  service_slug  TEXT NOT NULL,
  origin        TEXT,
  destination   TEXT,
  move_date     TEXT,
  message       TEXT,
  estimate_low  INTEGER,
  estimate_high INTEGER,
  source_page   TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
