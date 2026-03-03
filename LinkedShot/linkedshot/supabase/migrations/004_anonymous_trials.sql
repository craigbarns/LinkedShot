-- Anonymous trial: 1 free image per browser/device (cookie session_id)
create table if not exists public.anonymous_trials (
  session_id text primary key,
  trials_used int not null default 0,
  ip_prefix text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists anonymous_trials_ip_prefix_idx on public.anonymous_trials (ip_prefix);

alter table public.anonymous_trials enable row level security;

create policy "Service role only for anonymous_trials"
  on public.anonymous_trials for all
  using (false)
  with check (false);

comment on table public.anonymous_trials is 'Tracks 1 free anonymous image per session (cookie). Merge on signup not required; user gets 3 credits on signup.';
