-- Migration: Bulk Import & Stock Management Schema
-- Created: 2025-11-22

-- ============================================================================
-- 1. Extend products table with new fields
-- ============================================================================

-- Add new columns to existing products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS design_no VARCHAR(100),
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS fabric VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(100),
ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS selling_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS mrp DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'Rs',
ADD COLUMN IF NOT EXISTS stock_qty INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create index on SKU for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- ============================================================================
-- 2. Product Media table (images & videos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
    storage_path TEXT NOT NULL,
    url TEXT,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_is_primary ON product_media(is_primary);

-- ============================================================================
-- 3. Stock Movements table (audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    change_qty INTEGER NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('purchase', 'sale', 'manual_adjustment', 'damaged', 'returned', 'bulk_import')),
    reference TEXT,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- ============================================================================
-- 4. Bulk Jobs table (import/export tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS bulk_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('import', 'export', 'ai_update')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
    file_path TEXT,
    file_name VARCHAR(255),
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    result_log JSONB DEFAULT '{}'::jsonb,
    error_details JSONB DEFAULT '[]'::jsonb,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    finished_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bulk_jobs_status ON bulk_jobs(status);
CREATE INDEX IF NOT EXISTS idx_bulk_jobs_created_at ON bulk_jobs(created_at DESC);

-- ============================================================================
-- 5. AI Suggestions table (for future AI features)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    field VARCHAR(100) NOT NULL,
    current_value TEXT,
    suggested_value TEXT,
    confidence DECIMAL(3,2),
    accepted BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_product_id ON ai_suggestions(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_accepted ON ai_suggestions(accepted);

-- ============================================================================
-- 6. Enable Row Level Security (RLS) - Basic setup
-- ============================================================================

ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to product_media (for frontend)
CREATE POLICY "Public can view product media" ON product_media
    FOR SELECT USING (true);

-- Admin-only policies (you'll need to adjust based on your auth setup)
CREATE POLICY "Admin can manage product media" ON product_media
    FOR ALL USING (true);

CREATE POLICY "Admin can manage stock movements" ON stock_movements
    FOR ALL USING (true);

CREATE POLICY "Admin can manage bulk jobs" ON bulk_jobs
    FOR ALL USING (true);

CREATE POLICY "Admin can manage AI suggestions" ON ai_suggestions
    FOR ALL USING (true);

-- ============================================================================
-- 7. Helper function: Update product stock
-- ============================================================================

CREATE OR REPLACE FUNCTION update_product_stock(
    p_product_id UUID,
    p_change_qty INTEGER,
    p_reason VARCHAR,
    p_reference TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Update stock quantity
    UPDATE products 
    SET stock_qty = stock_qty + p_change_qty,
        updated_at = NOW()
    WHERE id = p_product_id;
    
    -- Log the movement
    INSERT INTO stock_movements (product_id, change_qty, reason, reference, notes)
    VALUES (p_product_id, p_change_qty, p_reason, p_reference, p_notes);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. Trigger: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
