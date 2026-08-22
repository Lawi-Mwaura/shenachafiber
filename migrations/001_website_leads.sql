CREATE TABLE IF NOT EXISTS website_leads (
  id BIGSERIAL PRIMARY KEY,
  public_reference TEXT,
  service TEXT NOT NULL,
  selected_plan TEXT,
  location TEXT NOT NULL,
  building TEXT,
  property_type TEXT,
  user_count INTEGER,
  message TEXT,
  notes TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  contact_preference TEXT,
  consent_granted BOOLEAN,
  consent_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'website',
  utm JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS public_reference TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS selected_plan TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS building TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS property_type TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS user_count INTEGER;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS contact_preference TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS consent_granted BOOLEAN;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS utm JSONB DEFAULT '{}'::jsonb;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE website_leads SET message = notes WHERE message IS NULL AND notes IS NOT NULL;
UPDATE website_leads SET consent_granted = TRUE WHERE consent_granted IS NULL AND consent_at IS NOT NULL;
UPDATE website_leads SET submitted_at = COALESCE(created_at, consent_at, NOW()) WHERE submitted_at IS NULL;
UPDATE website_leads SET public_reference = 'SF-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT || id::TEXT), 1, 12)) WHERE public_reference IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS website_leads_public_reference_idx ON website_leads (public_reference);
