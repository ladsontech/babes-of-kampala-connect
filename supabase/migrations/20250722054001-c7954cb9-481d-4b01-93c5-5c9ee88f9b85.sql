
-- Add visibility duration fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN visibility_duration_months INTEGER DEFAULT 1,
ADD COLUMN visibility_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN visibility_end_date TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (visibility_start_date + INTERVAL '1 month' * visibility_duration_months) STORED;

-- Update the RLS policy for public viewing to also check if profile is still within visibility period
DROP POLICY IF EXISTS "Public can view active profiles" ON public.profiles;

CREATE POLICY "Public can view active profiles" 
ON public.profiles 
FOR SELECT 
USING (is_active = true AND (visibility_end_date IS NULL OR visibility_end_date > now()));
