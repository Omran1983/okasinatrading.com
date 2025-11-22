-- Migration: Product Variants & AI Enrichment
-- Version: 2.0
-- Created: 2025-11-22

-- ============================================================================
-- 1. Product Variants Table (Size-specific stock tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Variant identifiers
    sku_variant VARCHAR(150) UNIQUE NOT NULL,  -- e.g., "ANK-002-M"
    size VARCHAR(50) NOT NULL,                  -- e.g., "M", "XL", "3XL"
    color VARCHAR(100),                         -- Optional: for color variants
    
    -- Stock & pricing
    stock_qty INTEGER DEFAULT 0,
    price_adjustment DECIMAL(10,2) DEFAULT 0,  -- +/- from base price
    
    -- Metadata
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku_variant);
CREATE INDEX IF NOT EXISTS idx_product_variants_size ON product_variants(size);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);

-- Unique constraint: one size per product (unless color variants exist)
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_unique 
ON product_variants(product_id, size, COALESCE(color, ''));

-- ============================================================================
-- 2. Add AI-related fields to products table
-- ============================================================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2);

-- Index for tag searches
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- ============================================================================
-- 3. Update stock_movements to support variants
-- ============================================================================

ALTER TABLE stock_movements
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_stock_movements_variant_id ON stock_movements(variant_id);

-- ============================================================================
-- 4. Helper function: Get total stock across all variants
-- ============================================================================

CREATE OR REPLACE FUNCTION get_product_total_stock(p_product_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total INTEGER;
BEGIN
    SELECT COALESCE(SUM(stock_qty), 0)
    INTO total
    FROM product_variants
    WHERE product_id = p_product_id AND is_available = true;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. Helper function: Update variant stock with logging
-- ============================================================================

CREATE OR REPLACE FUNCTION update_variant_stock(
    p_variant_id UUID,
    p_change_qty INTEGER,
    p_reason VARCHAR,
    p_reference TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_product_id UUID;
BEGIN
    -- Get product_id from variant
    SELECT product_id INTO v_product_id
    FROM product_variants
    WHERE id = p_variant_id;
    
    -- Update variant stock
    UPDATE product_variants 
    SET stock_qty = stock_qty + p_change_qty,
        updated_at = NOW()
    WHERE id = p_variant_id;
    
    -- Update product total stock
    UPDATE products
    SET stock_qty = get_product_total_stock(v_product_id),
        updated_at = NOW()
    WHERE id = v_product_id;
    
    -- Log the movement
    INSERT INTO stock_movements (
        product_id, 
        variant_id, 
        change_qty, 
        reason, 
        reference, 
        notes
    )
    VALUES (
        v_product_id,
        p_variant_id,
        p_change_qty,
        p_reason,
        p_reference,
        p_notes
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. Trigger: Auto-update variant updated_at
-- ============================================================================

CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. View: Products with variant summary
-- ============================================================================

CREATE OR REPLACE VIEW products_with_variants AS
SELECT 
    p.*,
    COUNT(DISTINCT pv.id) as variant_count,
    COALESCE(SUM(pv.stock_qty), 0) as total_variant_stock,
    ARRAY_AGG(DISTINCT pv.size ORDER BY pv.size) FILTER (WHERE pv.size IS NOT NULL) as available_sizes,
    MIN(pv.stock_qty) as min_size_stock,
    MAX(pv.stock_qty) as max_size_stock
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_available = true
GROUP BY p.id;

-- ============================================================================
-- 8. RLS Policies for product_variants
-- ============================================================================

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public can view available variants
CREATE POLICY "Public can view available variants" ON product_variants
    FOR SELECT USING (is_available = true);

-- Admin can manage all variants
CREATE POLICY "Admin can manage variants" ON product_variants
    FOR ALL USING (true);

-- ============================================================================
-- 9. Sample data cleanup function
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_orphaned_variants()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete variants whose parent product no longer exists
    WITH deleted AS (
        DELETE FROM product_variants
        WHERE product_id NOT IN (SELECT id FROM products)
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. Performance: Materialized view for fast product search
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS product_search_index AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.category,
    p.subcategory,
    p.tags,
    p.selling_price,
    p.stock_qty,
    p.status,
    to_tsvector('english', 
        COALESCE(p.name, '') || ' ' || 
        COALESCE(p.description, '') || ' ' || 
        COALESCE(p.category, '') || ' ' ||
        COALESCE(p.subcategory, '') || ' ' ||
        COALESCE(array_to_string(p.tags, ' '), '')
    ) as search_vector
FROM products p
WHERE p.status = 'active';

CREATE INDEX IF NOT EXISTS idx_product_search_vector 
ON product_search_index USING GIN(search_vector);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_product_search_index()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_search_index;
END;
$$ LANGUAGE plpgsql;
