-- Create a "jobs" table for tracking pet portrait orders
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  stripe_session_id text not null,
  customer_email text,
  amount_paid integer,
  status text check (status in ('pending', 'paid', 'uploading', 'training', 'generating', 'processing', 'completed', 'failed')) default 'pending',
  
  -- Astria specific fields
  astria_model_id text,
  astria_prompt_id text,
  
  -- Result storage
  result_images text[], -- Array of image URLs
  download_url text
);

-- Enable Row Level Security (RLS)
alter table public.jobs enable row level security;

-- Policies (Adjust based on auth needs, for now allow public read on own job via ID if needed)
-- Ideally use server-side service role for most operations to keep it secure
create policy "Allow public read access to jobs by ID"
on public.jobs for select
using (true); -- In production, restrict this to the user who created it or use a secure token

-- Create storage bucket for uploads
insert into storage.buckets (id, name, public) 
values ('training-images', 'training-images', true);

-- Policy to allow uploads to 'training-images'
create policy "Allow public uploads to training-images"
on storage.objects for insert
with check ( bucket_id = 'training-images' );

-- Policy to allow reading from 'training-images'
create policy "Allow public read access to training-images"
on storage.objects for select
using ( bucket_id = 'training-images' );
