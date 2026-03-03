-- Referral: track who was referred by whom (one-time credits: give 5, get 5)
create table if not exists public.referral_applied (
  referred_user_id uuid references auth.users on delete cascade primary key,
  referrer_user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists referral_applied_referrer_idx on public.referral_applied (referrer_user_id);

alter table public.referral_applied enable row level security;

-- Only service role can insert/select (used by API)
create policy "Service role only for referral_applied"
  on public.referral_applied for all
  using (false)
  with check (false);

comment on table public.referral_applied is 'Tracks referral credits already applied (referrer gets 5, referred gets 5 once)';
