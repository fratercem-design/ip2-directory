-- 1. Partial Unique Index (Stricter Version)
-- Enforces that a Platform Account can only have ONE "open" session at a time (where ended_at is null).
-- This acts as a hard constraint against ghost sessions, even if is_live gets desynced.
create unique index if not exists one_open_session_per_platform_account
on public.live_sessions (platform_account_id)
where ended_at is null;

-- 2. Platform Identity Constraint
-- Prevents duplicate ingestion of the same platform user (e.g. two rows for Twitch 'xqc').
create unique index if not exists uniq_platform_accounts_platform_user
on public.platform_accounts (platform, platform_user_id);

-- 3. Performance Index
-- Optimizes the /api/live-now query:
-- .eq("is_live", true).is("ended_at", null).order("started_at", { ascending: false })
create index if not exists idx_live_sessions_freshness
on public.live_sessions (is_live, ended_at, started_at desc);
