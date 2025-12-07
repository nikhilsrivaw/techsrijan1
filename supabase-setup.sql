-- LA MIRA Registration Table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS la_mira_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Team Leader Information
  leader_name TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  leader_department TEXT NOT NULL,

  -- Member 1 Information
  member1_name TEXT NOT NULL,
  member1_department TEXT NOT NULL,

  -- Member 2 Information
  member2_name TEXT NOT NULL,
  member2_department TEXT NOT NULL,

  -- Payment Information
  payment_screenshot_url TEXT,

  -- Metadata
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_la_mira_created_at ON la_mira_registrations(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_la_mira_status ON la_mira_registrations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE la_mira_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for registration form)
CREATE POLICY "Allow public insert" ON la_mira_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated read" ON la_mira_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON la_mira_registrations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON la_mira_registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_la_mira_updated_at
    BEFORE UPDATE ON la_mira_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STORAGE BUCKET SETUP (Do this in Supabase Dashboard > Storage)
-- ============================================================
--
-- IMPORTANT: You need to create a storage bucket manually in the Supabase Dashboard:
--
-- 1. Go to Storage section in Supabase Dashboard
-- 2. Click "Create a new bucket"
-- 3. Bucket name: la-mira-payments
-- 4. Make it PUBLIC (so screenshots can be accessed)
-- 5. Click "Create bucket"
--
-- Then, set up the storage policies by running this SQL:

-- Storage policies for payment screenshots bucket
-- Allow public to upload files
INSERT INTO storage.buckets (id, name, public)
VALUES ('la-mira-payments', 'la-mira-payments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload payment screenshots
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'la-mira-payments');

-- Allow anyone to view payment screenshots
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'la-mira-payments');

-- Allow authenticated users to delete payment screenshots
CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'la-mira-payments');
