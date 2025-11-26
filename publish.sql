UPDATE products SET status = 'active' WHERE status = 'draft'; SELECT COUNT(*) FROM products WHERE status = 'active';
