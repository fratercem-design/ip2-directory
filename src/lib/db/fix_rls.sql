-- Enable RLS
ALTER TABLE public.status_events ENABLE ROW LEVEL SECURITY;

-- Policy: NONE
-- Default Deny: No public/anon access.
-- Writes must be done via Service Role (Inngest).
-- Reads must be done via Service Role (Admin).
