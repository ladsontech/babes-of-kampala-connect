
-- Add location column to profiles table
ALTER TABLE profiles ADD COLUMN location TEXT NOT NULL DEFAULT 'Kampala';

-- Update existing profiles to have Kampala as default location
UPDATE profiles SET location = 'Kampala' WHERE location IS NULL OR location = '';

-- Add visibility_duration_weeks column and migrate existing data
ALTER TABLE profiles ADD COLUMN visibility_duration_weeks INTEGER NOT NULL DEFAULT 1;

-- Convert existing monthly data to weekly (multiply by 4)
UPDATE profiles SET visibility_duration_weeks = visibility_duration_months * 4;

-- Drop the old monthly columns
ALTER TABLE profiles DROP COLUMN visibility_duration_months;
