-- Allow ZIP files in the 'training-images' bucket
update storage.buckets
set allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'application/zip', 'application/x-zip-compressed']
where id = 'training-images';
