
-- Make email and user_id nullable in profiles table since admin can create profiles without user accounts
ALTER TABLE public.profiles 
ALTER COLUMN email DROP NOT NULL,
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow admin-created profiles (profiles without user_id)
-- Add policy for admin to create profiles without user_id
CREATE POLICY "Admin can create profiles without user_id" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Add policy for admin to update profiles without user_id  
CREATE POLICY "Admin can update profiles without user_id"
ON public.profiles 
FOR UPDATE 
USING (user_id IS NULL);

-- Add policy for admin to view profiles without user_id
CREATE POLICY "Admin can view profiles without user_id"
ON public.profiles 
FOR SELECT 
USING (user_id IS NULL);

-- Update profile images policies to allow admin-created profiles
CREATE POLICY "Admin can insert images for profiles without user_id"
ON public.profile_images 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));

CREATE POLICY "Admin can view images for profiles without user_id"
ON public.profile_images 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));

CREATE POLICY "Admin can update images for profiles without user_id"
ON public.profile_images 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));

CREATE POLICY "Admin can delete images for profiles without user_id"
ON public.profile_images 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));
