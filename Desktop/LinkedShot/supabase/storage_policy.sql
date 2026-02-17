-- Allow public uploads to the 'training-images' bucket
create policy "Allow public uploads to training-images"
on storage.objects for insert
with check ( bucket_id = 'training-images' );

-- Allow public read access to the 'training-images' bucket (optional, but good for debugging)
create policy "Allow public read access to training-images"
on storage.objects for select
using ( bucket_id = 'training-images' );
