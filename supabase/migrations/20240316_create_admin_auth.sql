-- Create admin_profiles table
CREATE TABLE admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view admin profiles
CREATE POLICY "Admins can view admin profiles"
    ON admin_profiles FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

-- Only allow admins to update their own profile
CREATE POLICY "Admins can update their own profile"
    ON admin_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create trigger to update updated_at
CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create policies for content management
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Anyone can view services"
    ON services FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert services"
    ON services FOR INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update services"
    ON services FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete services"
    ON services FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Accessories policies
CREATE POLICY "Anyone can view accessories"
    ON accessories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert accessories"
    ON accessories FOR INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update accessories"
    ON accessories FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete accessories"
    ON accessories FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');

-- News articles policies
CREATE POLICY "Anyone can view news articles"
    ON news_articles FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert news articles"
    ON news_articles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update news articles"
    ON news_articles FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete news articles"
    ON news_articles FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');