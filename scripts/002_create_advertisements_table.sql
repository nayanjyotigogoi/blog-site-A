CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'image' or 'text'
  image_url TEXT,
  link_url TEXT NOT NULL,
  alt_text TEXT,
  content TEXT, -- For text ads
  size TEXT NOT NULL, -- 'large', 'medium', 'small', 'floating', 'popup'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for advertisements
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
DROP POLICY IF EXISTS "Public advertisements are viewable by everyone." ON advertisements;
CREATE POLICY "Public advertisements are viewable by everyone." ON advertisements
  FOR SELECT USING (TRUE);

-- Policy for admin write access (you'd typically add authentication here)
DROP POLICY IF EXISTS "Authenticated users can manage advertisements." ON advertisements;
CREATE POLICY "Authenticated users can manage advertisements." ON advertisements
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create a trigger to call the function before update
DROP TRIGGER IF EXISTS update_advertisements_updated_at ON advertisements;
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON advertisements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
