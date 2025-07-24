
-- Add is_premium column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_premium BOOLEAN DEFAULT false;

-- Update the RLS policy to include premium profiles in ordering
-- This will be handled in the application code for sorting
