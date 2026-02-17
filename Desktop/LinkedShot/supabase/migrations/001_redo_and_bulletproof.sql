-- 1. Updates to 'jobs' table
alter table public.jobs 
add column if not exists plan text default 'starter', -- 'starter', 'pro', 'executive'
add column if not exists credits_total integer default 40,
add column if not exists credits_used integer default 0,
add column if not exists styles_unlocked text[] default array['studio_grey', 'studio_white', 'corporate_blue'],
add column if not exists high_fidelity boolean default false,
add column if not exists redo_available boolean default true,
add column if not exists redo_used_at timestamp with time zone,
add column if not exists active_model_version integer default 1,
add column if not exists model_url text;

-- Add updated statuses to check constraint if possible, or just note them
-- (Postgres enum updates are tricky, so we assume text field logic handles it)
-- New Statuses to support: 'training_completed', 'generating', 'done'

-- 2. Create 'job_models' table for versioning models (Redo support)
create table if not exists public.job_models (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  version integer not null,
  status text check (status in ('training', 'trained', 'failed', 'archived')),
  lora_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create 'generations' table for individual image tracking (Bulletproof delivery)
create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  model_version integer not null,
  status text check (status in ('pending', 'running', 'done', 'failed')) default 'pending',
  image_url text,
  prompt_preset text,
  seed bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.job_models enable row level security;
alter table public.generations enable row level security;

-- Policies
create policy "Public read access to job_models" on public.job_models for select using (true);
create policy "Public read access to generations" on public.generations for select using (true);
