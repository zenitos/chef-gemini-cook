-- Add image column to recipes table
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS image TEXT;