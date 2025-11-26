-- Disable Row Level Security on storage.objects table
-- This allows the import process to upload images to the product-images bucket

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Expected result: rowsecurity = false
