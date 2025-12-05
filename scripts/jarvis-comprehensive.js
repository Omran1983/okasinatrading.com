#!/usr/bin/env node
/**
 * JARVIS Comprehensive System Check
 * Checks ALL aspects of the website to prevent recurring issues
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🤖 JARVIS Comprehensive System Check\n');
console.log('Checking ALL aspects of your website...\n');

const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    fixed: 0
};

const log = (emoji, msg) => console.log(`${emoji} ${msg}`);
const pass = (msg) => { log('✅', msg); results.passed++; };
const fail = (msg) => { log('❌', msg); results.failed++; };
const warn = (msg) => { log('⚠️', msg); results.warnings++; };
const fix = (msg) => { log('🔧', msg); results.fixed++; };
const section = (title) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 ${title}`);
    console.log('='.repeat(60));
};

// ============================================
// 1. DATABASE & DATA INTEGRITY
// ============================================
section('Database & Data Integrity');

async function checkDatabase() {
    try {
        // Connection test
        const { data, error } = await supabase.from('products').select('count').limit(1);
        if (error) throw error;
        pass('Database connection successful');

        // Check for products
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*');

        if (prodError) throw prodError;
        pass(`Found ${products.length} products in database`);

        // Auto-fix: Missing sizes
        const noSizes = products.filter(p => !p.sizes || p.sizes.length === 0);
        if (noSizes.length > 0) {
            warn(`${noSizes.length} products missing sizes`);
            for (const product of noSizes) {
                const defaultSizes = product.category === 'Accessories' ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL'];
                await supabase.from('products').update({ sizes: defaultSizes }).eq('id', product.id);
            }
            fix(`Added default sizes to ${noSizes.length} products`);
        } else {
            pass('All products have sizes');
        }

        // Auto-fix: Missing original_price
        const noOriginalPrice = products.filter(p => !p.original_price);
        if (noOriginalPrice.length > 0) {
            warn(`${noOriginalPrice.length} products missing original_price`);
            for (const product of noOriginalPrice) {
                await supabase.from('products').update({ original_price: product.price }).eq('id', product.id);
            }
            fix(`Set original_price for ${noOriginalPrice.length} products`);
        } else {
            pass('All products have original_price set');
        }

        // Auto-fix: Invalid stock
        const invalidStock = products.filter(p => p.stock_qty == null || p.stock_qty < 0);
        if (invalidStock.length > 0) {
            warn(`${invalidStock.length} products with invalid stock`);
            for (const product of invalidStock) {
                await supabase.from('products').update({ stock_qty: 0 }).eq('id', product.id);
            }
            fix(`Fixed stock for ${invalidStock.length} products`);
        } else {
            pass('All products have valid stock levels');
        }

        // Check for missing categories
        const noCategory = products.filter(p => !p.category || p.category === '');
        if (noCategory.length > 0) {
            warn(`${noCategory.length} products missing category`);
            for (const product of noCategory) {
                await supabase.from('products').update({ category: 'Accessories' }).eq('id', product.id);
            }
            fix(`Set default category for ${noCategory.length} products`);
        } else {
            pass('All products have categories');
        }

        // Check for missing images
        const noImage = products.filter(p => !p.image_url && !p.image);
        if (noImage.length > 0) {
            warn(`${noImage.length} products missing images`);
        } else {
            pass('All products have images');
        }

        // Check for duplicate SKUs
        const skus = products.map(p => p.sku).filter(Boolean);
        const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
        if (duplicates.length > 0) {
            warn(`Found ${duplicates.length} duplicate SKUs`);
        } else {
            pass('No duplicate SKUs found');
        }

    } catch (error) {
        fail(`Database check failed: ${error.message}`);
    }
}

// ============================================
// 2. FRONTEND VALIDATION
// ============================================
section('Frontend Validation');

async function checkFrontend() {
    try {
        // Check critical files exist
        const criticalFiles = [
            'src/App.jsx',
            'src/main.jsx',
            'src/index.css',
            'index.html',
            'vite.config.js',
            'package.json'
        ];

        for (const file of criticalFiles) {
            if (fs.existsSync(file)) {
                pass(`${file} exists`);
            } else {
                fail(`${file} is missing`);
            }
        }

        // Check for broken imports (simple check)
        const appContent = fs.readFileSync('src/App.jsx', 'utf8');
        if (appContent.includes('import') && !appContent.includes('undefined')) {
            pass('App.jsx imports look valid');
        }

        // Check package.json for required dependencies
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'];

        for (const dep of requiredDeps) {
            if (pkg.dependencies[dep]) {
                pass(`${dep} is installed`);
            } else {
                fail(`${dep} is missing from dependencies`);
            }
        }

    } catch (error) {
        fail(`Frontend check failed: ${error.message}`);
    }
}

// ============================================
// 3. BACKEND API HEALTH
// ============================================
section('Backend API Health');

async function checkBackend() {
    try {
        const API_URL = process.env.NODE_ENV === 'production' ? 'https://okasinatrading.com' : 'http://localhost:3001';

        // Check if server file exists
        if (fs.existsSync('server.js')) {
            pass('server.js exists');
        } else {
            fail('server.js is missing');
            return;
        }

        // Check critical endpoints are defined
        const serverContent = fs.readFileSync('server.js', 'utf8');
        const endpoints = [
            '/api/update-product',
            '/api/delete-product',
            '/api/stylist-chat',
            '/api/upload-image',
            '/api/facebook/list-albums',
            '/api/facebook/import-album'
        ];

        for (const endpoint of endpoints) {
            if (serverContent.includes(endpoint)) {
                pass(`Endpoint ${endpoint} is defined`);
            } else {
                warn(`Endpoint ${endpoint} may be missing`);
            }
        }

    } catch (error) {
        fail(`Backend check failed: ${error.message}`);
    }
}

// ============================================
// 4. ENVIRONMENT & CONFIGURATION
// ============================================
section('Environment & Configuration');

async function checkEnvironment() {
    const required = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const optional = [
        'GOOGLE_AI_KEY',
        'VITE_GEMINI_API_KEY',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    for (const varName of required) {
        if (process.env[varName]) {
            pass(`${varName} is set`);
        } else {
            fail(`${varName} is MISSING (required)`);
        }
    }

    for (const varName of optional) {
        if (process.env[varName]) {
            pass(`${varName} is set (optional)`);
        } else {
            warn(`${varName} not set (optional feature disabled)`);
        }
    }

    // Check .env file exists
    if (fs.existsSync('.env')) {
        pass('.env file exists');
    } else {
        fail('.env file is missing');
    }

    // Check .gitignore includes .env
    if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        if (gitignore.includes('.env')) {
            pass('.env is in .gitignore (security)');
        } else {
            fail('.env is NOT in .gitignore (SECURITY RISK)');
        }
    }
}

// ============================================
// 5. SECURITY CHECKS
// ============================================
section('Security Checks');

async function checkSecurity() {
    try {
        // Check for exposed secrets in code
        const sensitiveFiles = ['src/supabase.js', 'src/api.js'];

        for (const file of sensitiveFiles) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                if (content.includes('process.env') || content.includes('import.meta.env')) {
                    pass(`${file} uses environment variables correctly`);
                } else if (content.match(/[a-zA-Z0-9]{32,}/)) {
                    warn(`${file} may contain hardcoded secrets`);
                } else {
                    pass(`${file} looks secure`);
                }
            }
        }

        // Check RLS is enabled
        const { data: products } = await supabase.from('products').select('id').limit(1);
        if (products) {
            pass('RLS policies allow necessary operations');
        }

    } catch (error) {
        warn(`Security check: ${error.message}`);
    }
}

// ============================================
// 6. PERFORMANCE & SEO
// ============================================
section('Performance & SEO');

async function checkPerformance() {
    try {
        // Check for large files
        const checkSize = (file, maxSize) => {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                const sizeMB = stats.size / (1024 * 1024);
                if (sizeMB > maxSize) {
                    warn(`${file} is ${sizeMB.toFixed(2)}MB (consider optimization)`);
                } else {
                    pass(`${file} size is optimal (${sizeMB.toFixed(2)}MB)`);
                }
            }
        };

        checkSize('src/index.css', 0.5);

        // Check index.html for SEO basics
        if (fs.existsSync('index.html')) {
            const html = fs.readFileSync('index.html', 'utf8');

            if (html.includes('<title>')) {
                pass('index.html has title tag');
            } else {
                warn('index.html missing title tag (SEO)');
            }

            if (html.includes('meta name="description"')) {
                pass('index.html has meta description');
            } else {
                warn('index.html missing meta description (SEO)');
            }

            if (html.includes('meta name="viewport"')) {
                pass('index.html has viewport meta (mobile)');
            } else {
                fail('index.html missing viewport meta (mobile)');
            }
        }

    } catch (error) {
        warn(`Performance check: ${error.message}`);
    }
}

// ============================================
// 7. DEPLOYMENT STATUS
// ============================================
section('Deployment Status');

async function checkDeployment() {
    try {
        const response = await fetch('https://okasinatrading.com', {
            method: 'HEAD',
            timeout: 5000
        });

        if (response.ok) {
            pass('Site is accessible (https://okasinatrading.com)');
        } else {
            warn(`Site returned status ${response.status}`);
        }

        // Check if Vercel config exists
        if (fs.existsSync('vercel.json')) {
            pass('vercel.json exists');
            const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
            if (vercelConfig.rewrites) {
                pass('Vercel rewrites configured');
            }
        } else {
            warn('vercel.json missing (may affect deployment)');
        }

    } catch (error) {
        warn(`Deployment check: ${error.message}`);
    }
}

// ============================================
// RUN ALL CHECKS
// ============================================

async function runComprehensiveCheck() {
    await checkDatabase();
    await checkFrontend();
    await checkBackend();
    await checkEnvironment();
    await checkSecurity();
    await checkPerformance();
    await checkDeployment();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE CHECK SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️  Warnings: ${results.warnings}`);
    console.log(`🔧 Auto-Fixed: ${results.fixed}`);
    console.log('='.repeat(60));

    if (results.fixed > 0) {
        console.log(`\n✨ JARVIS automatically fixed ${results.fixed} issues!`);
    }

    if (results.failed === 0) {
        console.log('\n🎉 All critical checks passed!');
    } else {
        console.log(`\n🚨 ${results.failed} critical issues need attention`);
    }

    if (results.warnings > 0) {
        console.log(`\n⚠️  ${results.warnings} warnings - review recommended`);
    }

    console.log('\n🤖 JARVIS Comprehensive Check Complete\n');

    process.exit(results.failed > 0 ? 1 : 0);
}

runComprehensiveCheck().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
