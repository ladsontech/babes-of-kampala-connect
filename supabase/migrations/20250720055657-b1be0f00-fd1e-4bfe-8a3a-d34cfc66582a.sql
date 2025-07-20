
-- Drop the existing restrictive admin policies and create more permissive ones
DROP POLICY IF EXISTS "Admin can create profiles without user_id" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update profiles without user_id" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view profiles without user_id" ON public.profiles;

DROP POLICY IF EXISTS "Admin can insert images for profiles without user_id" ON public.profile_images;
DROP POLICY IF EXISTS "Admin can view images for profiles without user_id" ON public.profile_images;
DROP POLICY IF EXISTS "Admin can update images for profiles without user_id" ON public.profile_images;
DROP POLICY IF EXISTS "Admin can delete images for profiles without user_id" ON public.profile_images;

-- Create new policies that allow unauthenticated access for admin operations
-- Allow anyone to create profiles without user_id (for admin use)
CREATE POLICY "Allow creating profiles without user_id" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Allow anyone to update profiles without user_id (for admin use)
CREATE POLICY "Allow updating profiles without user_id"
ON public.profiles 
FOR UPDATE 
USING (user_id IS NULL);

-- Allow anyone to view profiles without user_id (for admin use)
CREATE POLICY "Allow viewing profiles without user_id"
ON public.profiles 
FOR SELECT 
USING (user_id IS NULL);

-- Allow anyone to delete profiles without user_id (for admin cleanup)
CREATE POLICY "Allow deleting profiles without user_id"
ON public.profiles 
FOR DELETE 
USING (user_id IS NULL);

-- Profile images policies for admin-created profiles
CREATE POLICY "Allow inserting images for profiles without user_id"
ON public.profile_images 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));

CREATE POLICY "Allow viewing images for profiles without user_id"
ON public.profile_images 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));

CREATE POLICY "Allow updating images for profiles without user_id"
ON public.profile_images 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));

CREATE POLICY "Allow deleting images for profiles without user_id"
ON public.profile_images 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));
