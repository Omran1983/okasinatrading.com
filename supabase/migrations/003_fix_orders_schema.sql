
-- Ensure orders table exists with all required columns
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    shipping_method TEXT,
    order_notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns if they are missing (for existing table)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for guest checkout)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Enable insert for everyone'
    ) THEN
        CREATE POLICY "Enable insert for everyone" 
        ON orders FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;

-- Allow users to view their own orders (by email matching) - simplified for now
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Enable select for everyone'
    ) THEN
        CREATE POLICY "Enable select for everyone" 
        ON orders FOR SELECT 
        USING (true); -- In production, restrict this!
    END IF;
END $$;

-- Reload config
NOTIFY pgrst, 'reload config';
