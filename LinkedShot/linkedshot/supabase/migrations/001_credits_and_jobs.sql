-- Table des crédits par utilisateur
create table if not exists public.credits (
  user_id uuid references auth.users on delete cascade primary key,
  amount int not null default 3,
  updated_at timestamptz not null default now()
);

-- Table des jobs (historique des traitements)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  original_path text,
  processed_path text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Index pour lister les jobs par utilisateur
create index if not exists jobs_user_id_idx on public.jobs (user_id);

-- Trigger : donner 3 crédits aux nouveaux utilisateurs
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.credits (user_id, amount)
  values (new.id, 3)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS : les users ne voient que leurs lignes
alter table public.credits enable row level security;
alter table public.jobs enable row level security;

create policy "Users can read own credits"
  on public.credits for select
  using (auth.uid() = user_id);

create policy "Users can read own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);
