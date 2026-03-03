-- Storage: allow authenticated users to upload to bucket "raw" in their folder only.
--
-- IMPORTANT: Create the buckets first in Supabase Dashboard → Storage:
--   1. New bucket "raw"   → set Public: ON
--   2. New bucket "processed" → set Public: ON
-- Then run this SQL. If you get "policy already exists", skip or drop the existing policy first.

-- Policy: authenticated users can INSERT into "raw" only in folder {auth.uid()}
create policy "Users can upload to own folder in raw"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'raw'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: allow read from "raw" (so image URLs work for FAL and display)
create policy "Public read raw"
  on storage.objects for select
  using (bucket_id = 'raw');

-- Policy: allow read from "processed"
create policy "Public read processed"
  on storage.objects for select
  using (bucket_id = 'processed');

-- Service role bypasses RLS; no policy needed for API uploads to "processed".
