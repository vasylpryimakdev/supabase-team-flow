CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

DROP TABLE IF EXISTS products;
DROP TYPE IF EXISTS product_status;

CREATE TYPE product_status AS ENUM ('Draft', 'Active', 'Deleted');

CREATE TABLE products (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status product_status DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_team_id ON products(team_id);
CREATE INDEX idx_products_status ON products(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access products within their team" ON products
  FOR ALL
  USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid()
    )
  );