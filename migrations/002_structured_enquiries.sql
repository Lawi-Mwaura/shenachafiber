ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS enquiry_kind TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS contact_role TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS unit_count INTEGER;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS unit_number TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS preferred_meeting_time TEXT;
ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS preferred_installation_date DATE;

UPDATE website_leads
SET enquiry_kind = CASE service
  WHEN 'internet' THEN 'fibre_availability'
  WHEN 'cctv' THEN 'cctv_quote'
  WHEN 'biometric_access' THEN 'biometric_quote'
  WHEN 'support' THEN 'support'
  ELSE 'support'
END
WHERE enquiry_kind IS NULL;

CREATE INDEX IF NOT EXISTS website_leads_enquiry_kind_idx ON website_leads (enquiry_kind);
CREATE INDEX IF NOT EXISTS website_leads_submitted_at_idx ON website_leads (submitted_at DESC);
