import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Loader, Sparkles } from 'lucide-react';
import { generateCSVTemplate, downloadCSV } from '../utils/csvTemplate';
import { enrichProduct, parseSizeStock, generateVariantSKU } from '../utils/aiEnrichment';
import Papa from 'papaparse';
import { supabase } from '../supabase';
import AdminLayout from '../components/admin/AdminLayout';

export default function StockManagerPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [aiEnrichEnabled, setAiEnrichEnabled] = useState(true);

    const handleDownloadTemplate = () => {
        const csvContent = generateCSVTemplate();
        downloadCSV(csvContent);
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);
        setImportResult(null);
        setValidationErrors([]);

        Papa.parse(uploadedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setPreview(results.data);
                validateData(results.data);
            },
            error: (error) => {
                alert('Error parsing CSV: ' + error.message);
            }
        });
    };

    const validateData = (data) => {
        const errors = [];

        data.forEach((row, index) => {
            const rowErrors = [];

            if (!row.sku) rowErrors.push('SKU is required');
            if (!row.name) rowErrors.push('Name is required');
            if (!row.category) rowErrors.push('Category is required');
            if (!row.selling_price || isNaN(row.selling_price)) rowErrors.push('Valid selling price is required');

            if (row.sizes && row.stock_by_size) {
                try {
                    const variants = parseSizeStock(row.sizes, row.stock_by_size);
                    if (variants.length === 0) {
                        rowErrors.push('Invalid size/stock format');
                    }
                } catch (e) {
                    rowErrors.push('Invalid size/stock format: ' + e.message);
                }
            } else if (!row.stock_qty || isNaN(row.stock_qty)) {
                rowErrors.push('Either stock_by_size or stock_qty is required');
            }

            if (rowErrors.length > 0) {
                errors.push({
                    row: index + 2,
                    sku: row.sku || 'N/A',
                    errors: rowErrors
                });
            }
        });

        setValidationErrors(errors);
    };

    const handleImport = async () => {
        if (validationErrors.length > 0) {
            alert('Please fix validation errors before importing');
            return;
        }

        setImporting(true);

        try {
            const { data: jobData, error: jobError } = await supabase
                .from('bulk_jobs')
                .insert({
                    type: 'import',
                    status: 'running',
                    file_name: file.name,
                    total_rows: preview.length
                })
                .select()
                .single();

            if (jobError) throw jobError;

            let successCount = 0;
            let errorCount = 0;
            const errorDetails = [];
            let variantsCreated = 0;

            for (let i = 0; i < preview.length; i++) {
                const row = preview[i];

                try {
                    const enrichedRow = aiEnrichEnabled ? enrichProduct(row) : row;

                    const sizeVariants = row.stock_by_size
                        ? parseSizeStock(row.sizes, row.stock_by_size)
                        : [{ size: 'Free Size', stock: parseInt(row.stock_qty) || 0 }];

                    const totalStock = sizeVariants.reduce((sum, v) => sum + v.stock, 0);

                    const productData = {
                        sku: row.sku,
                        design_no: row.design_no || null,
                        name: enrichedRow.name,
                        category: row.category,
                        subcategory: row.subcategory || null,
                        fabric: row.fabric || null,
                        color: row.color || null,
                        sizes: sizeVariants.map(v => v.size),
                        cost_price: parseFloat(row.cost_price) || null,
                        selling_price: parseFloat(row.selling_price),
                        price: parseFloat(row.selling_price),
                        mrp: parseFloat(row.mrp) || null,
                        stock_qty: totalStock,
                        description: enrichedRow.description || null,
                        care_instructions: enrichedRow.care_instructions || null,
                        tags: enrichedRow.tags || [],
                        seo_title: enrichedRow.seo_title || null,
                        ai_generated: enrichedRow.ai_generated || false,
                        ai_confidence: enrichedRow.ai_confidence || null,
                        image_url: row.image_url_1 || null,
                        status: 'active'
                    };

                    const { data: existing } = await supabase
                        .from('products')
                        .select('id')
                        .eq('sku', row.sku)
                        .single();

                    let productId;

                    if (existing) {
                        const { error } = await supabase
                            .from('products')
                            .update(productData)
                            .eq('id', existing.id);

                        if (error) throw error;
                        productId = existing.id;

                        await supabase
                            .from('product_variants')
                            .delete()
                            .eq('product_id', productId);

                    } else {
                        const { data: newProduct, error } = await supabase
                            .from('products')
                            .insert(productData)
                            .select()
                            .single();

                        if (error) throw error;
                        productId = newProduct.id;
                    }

                    const variantRecords = sizeVariants.map((variant, idx) => ({
                        product_id: productId,
                        sku_variant: generateVariantSKU(row.sku, variant.size),
                        size: variant.size,
                        stock_qty: variant.stock,
                        is_available: variant.stock > 0,
                        display_order: idx
                    }));

                    const { error: variantError } = await supabase
                        .from('product_variants')
                        .insert(variantRecords);

                    if (variantError) throw variantError;
                    variantsCreated += variantRecords.length;

                    if (!existing && totalStock > 0) {
                        const movementRecords = sizeVariants
                            .filter(v => v.stock > 0)
                            .map(variant => {
                                const variantRecord = variantRecords.find(vr => vr.size === variant.size);
                                return {
                                    product_id: productId,
                                    variant_id: variantRecord?.id || null,
                                    change_qty: variant.stock,
                                    reason: 'bulk_import',
                                    reference: jobData.id,
                                    notes: `Initial stock from bulk import: ${file.name} (Size: ${variant.size})`
                                };
                            });

                        await supabase.from('stock_movements').insert(movementRecords);
                    }

                    if (row.image_url_2 || row.image_url_3) {
                        const mediaRecords = [];

                        if (row.image_url_2) {
                            mediaRecords.push({
                                product_id: productId,
                                type: 'image',
                                url: row.image_url_2,
                                storage_path: row.image_url_2,
                                display_order: 2
                            });
                        }

                        if (row.image_url_3) {
                            mediaRecords.push({
                                product_id: productId,
                                type: 'image',
                                url: row.image_url_3,
                                storage_path: row.image_url_3,
                                display_order: 3
                            });
                        }

                        if (mediaRecords.length > 0) {
                            await supabase.from('product_media').insert(mediaRecords);
                        }
                    }

                    successCount++;
                } catch (error) {
                    errorCount++;
                    errorDetails.push({
                        row: i + 2,
                        sku: row.sku,
                        error: error.message
                    });
                }
            }

            await supabase
                .from('bulk_jobs')
                .update({
                    status: errorCount === 0 ? 'done' : 'failed',
                    processed_rows: preview.length,
                    success_count: successCount,
                    error_count: errorCount,
                    error_details: errorDetails,
                    finished_at: new Date().toISOString()
                })
                .eq('id', jobData.id);

            setImportResult({
                success: true,
                total: preview.length,
                successCount,
                errorCount,
                variantsCreated,
                errors: errorDetails
            });

        } catch (error) {
            setImportResult({
                success: false,
                error: error.message
            });
        } finally {
            setImporting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Stock & Bulk Manager</h2>
                    <p className="text-gray-600">Import products with size variants and AI-powered enrichment</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <button
                            onClick={handleDownloadTemplate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Download size={20} />
                            Download CSV Template
                        </button>

                        <label className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer">
                            <Upload size={20} />
                            Upload CSV File
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {preview.length > 0 && validationErrors.length === 0 && (
                            <button
                                onClick={handleImport}
                                disabled={importing}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                            >
                                {importing ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <FileSpreadsheet size={20} />
                                        Import Products
                                    </>
                                )}
                            </button>
                        )}

                        <label className="flex items-center gap-2 ml-auto cursor-pointer">
                            <input
                                type="checkbox"
                                checked={aiEnrichEnabled}
                                onChange={(e) => setAiEnrichEnabled(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <Sparkles size={16} className={aiEnrichEnabled ? 'text-yellow-500' : 'text-gray-400'} />
                            <span className="text-sm font-medium text-gray-700">AI Enrichment</span>
                        </label>
                    </div>
                </div>

                {aiEnrichEnabled && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-900 mb-1">AI Enrichment Enabled</p>
                                <p className="text-yellow-700">
                                    Missing descriptions, care instructions, and tags will be automatically generated.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-bold text-red-900 mb-2">
                                    Validation Errors ({validationErrors.length})
                                </h3>
                                <p className="text-red-700 text-sm mb-4">
                                    Please fix the following errors before importing:
                                </p>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {validationErrors.map((error, index) => (
                                        <div key={index} className="bg-white rounded p-3 text-sm">
                                            <div className="font-medium text-red-900">Row {error.row} (SKU: {error.sku})</div>
                                            <ul className="list-disc list-inside text-red-700 mt-1">
                                                {error.errors.map((err, i) => (
                                                    <li key={i}>{err}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {importResult && (
                    <div className={`border rounded-lg p-6 ${importResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {importResult.success ? (
                                <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold mb-2 ${importResult.success ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    {importResult.success ? 'Import Completed' : 'Import Failed'}
                                </h3>
                                {importResult.success ? (
                                    <div className="text-green-800">
                                        <p className="mb-2">
                                            Successfully imported {importResult.successCount} out of {importResult.total} products.
                                        </p>
                                        <p className="text-sm">
                                            Created {importResult.variantsCreated} size variants.
                                        </p>
                                        {importResult.errorCount > 0 && (
                                            <div className="mt-4">
                                                <p className="font-medium mb-2">{importResult.errorCount} products failed:</p>
                                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                                    {importResult.errors.map((err, i) => (
                                                        <div key={i} className="text-sm bg-white rounded p-2">
                                                            Row {err.row} (SKU: {err.sku}): {err.error}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-red-800">{importResult.error}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {preview.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">
                                Preview ({preview.length} products)
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                    <tr>
                                        <th className="px-4 py-3 text-left">SKU</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Category</th>
                                        <th className="px-4 py-3 text-left">Sizes</th>
                                        <th className="px-4 py-3 text-left">Price</th>
                                        <th className="px-4 py-3 text-left">Total Stock</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {preview.slice(0, 10).map((row, index) => {
                                        const hasError = validationErrors.some(e => e.row === index + 2);
                                        const variants = row.stock_by_size ? parseSizeStock(row.sizes, row.stock_by_size) : [];
                                        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0) || row.stock_qty || 0;

                                        return (
                                            <tr key={index} className={hasError ? 'bg-red-50' : 'hover:bg-gray-50'}>
                                                <td className="px-4 py-3 font-medium">{row.sku}</td>
                                                <td className="px-4 py-3">{row.name}</td>
                                                <td className="px-4 py-3">{row.category}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {variants.length > 0 ? `${variants.length} sizes` : row.sizes || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">Rs {row.selling_price}</td>
                                                <td className="px-4 py-3">{totalStock}</td>
                                                <td className="px-4 py-3">
                                                    {hasError ? (
                                                        <span className="text-red-600 font-medium">Error</span>
                                                    ) : (
                                                        <span className="text-green-600 font-medium">Valid</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {preview.length > 10 && (
                                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 text-center">
                                    Showing first 10 of {preview.length} products
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
