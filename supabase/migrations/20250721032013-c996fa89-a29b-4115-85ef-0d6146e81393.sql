
-- First, let's check and fix the RLS policies for profiles table
-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow creating profiles without user_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow updating profiles without user_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow viewing profiles without user_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow deleting profiles without user_id" ON public.profiles;

-- Create new comprehensive policies for profiles
-- Allow public viewing of active profiles
CREATE POLICY "Public can view active profiles" 
ON public.profiles 
FOR SELECT 
USING (is_active = true);

-- Allow authenticated users to view their own profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow authenticated users to create their own profiles
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own profiles
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow anyone to manage profiles without user_id (admin profiles)
CREATE POLICY "Anyone can manage admin profiles" 
ON public.profiles 
FOR ALL 
USING (user_id IS NULL);

-- Drop all existing policies for profile_images
DROP POLICY IF EXISTS "Profile images are viewable by everyone for active profiles" ON public.profile_images;
DROP POLICY IF EXISTS "Users can view their own profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Users can insert their own profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Users can update their own profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Allow inserting images for profiles without user_id" ON public.profile_images;
DROP POLICY IF EXISTS "Allow viewing images for profiles without user_id" ON public.profile_images;
DROP POLICY IF EXISTS "Allow updating images for profiles without user_id" ON public.profile_images;
DROP POLICY IF EXISTS "Allow deleting images for profiles without user_id" ON public.profile_images;

-- Create new comprehensive policies for profile_images
-- Allow public viewing of images for active profiles
CREATE POLICY "Public can view active profile images" 
ON public.profile_images 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.is_active = true
));

-- Allow users to manage their own profile images
CREATE POLICY "Users can manage own profile images" 
ON public.profile_images 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id = auth.uid()
));

-- Allow anyone to manage images for admin profiles (user_id IS NULL)
CREATE POLICY "Anyone can manage admin profile images" 
ON public.profile_images 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.user_id IS NULL
));
