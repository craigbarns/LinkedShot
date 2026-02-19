-- Colonne pour distinguer générations free (crédits initiaux) vs payantes
alter table public.jobs
  add column if not exists used_free_credit boolean not null default false;

-- Table des visites pour stats journalières (remplie par l’API /api/track-visit)
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users on delete set null
);

create index if not exists visits_created_at_idx on public.visits (created_at);
create index if not exists visits_user_id_idx on public.visits (user_id);

alter table public.visits enable row level security;

-- Aucune policy : seules les requêtes avec service role (API) peuvent lire/écrire
comment on table public.visits is 'Used by admin stats only; populated by track-visit API.';
