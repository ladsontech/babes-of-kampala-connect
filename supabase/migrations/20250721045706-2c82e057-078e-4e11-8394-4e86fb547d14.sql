
-- First, let's clean up the existing conflicting policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all operations" ON public.profiles;
DROP POLICY IF EXISTS "Public can view active profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can manage admin profiles" ON public.profiles;

-- Create new simplified policies for profiles
-- Allow public viewing of active profiles (this is what the home page needs)
CREATE POLICY "Public can view active profiles" 
ON public.profiles 
FOR SELECT 
USING (is_active = true);

-- Allow anyone to manage profiles (for admin functionality)
CREATE POLICY "Anyone can manage profiles" 
ON public.profiles 
FOR ALL 
USING (true);

-- Now let's clean up the profile_images policies
DROP POLICY IF EXISTS "Profile images are viewable by everyone for active profiles" ON public.profile_images;
DROP POLICY IF EXISTS "Everyone can manage profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Public can view active profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Users can manage own profile images" ON public.profile_images;
DROP POLICY IF EXISTS "Anyone can manage admin profile images" ON public.profile_images;

-- Create new simplified policies for profile_images
-- Allow public viewing of images for active profiles
CREATE POLICY "Public can view active profile images" 
ON public.profile_images 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_images.profile_id 
  AND profiles.is_active = true
));

-- Allow anyone to manage profile images (for admin functionality)
CREATE POLICY "Anyone can manage profile images" 
ON public.profile_images 
FOR ALL 
USING (true);
