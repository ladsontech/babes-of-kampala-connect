
-- Update storage policies to allow admin access for profile images
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;

-- Create new policies that allow admin uploads
-- Allow anyone to upload to admin folder (for admin-created profiles)
CREATE POLICY "Allow admin uploads to admin folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'admin'
);

-- Allow anyone to update admin folder images
CREATE POLICY "Allow admin updates to admin folder"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'admin'
);

-- Allow anyone to delete admin folder images
CREATE POLICY "Allow admin deletes from admin folder"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'admin'
);

-- Keep existing authenticated user policies
CREATE POLICY "Authenticated users can upload their own profile images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can update their own profile images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can delete their own profile images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
