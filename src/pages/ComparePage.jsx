import React from 'react';
import { useComparison } from '../contexts/ComparisonContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, ArrowLeft, Check, Minus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare } = useComparison();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Helmet>
                    <title>Compare Products | Okasina Fashion</title>
                </Helmet>
                <div className="text-center">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">No Products to Compare</h1>
                    <p className="text-gray-600 mb-8">Add products to your comparison list to see them here.</p>
                    <Link to="/shop" className="inline-flex items-center px-6 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const features = [
        { key: 'name', label: 'Product Name' },
        { key: 'price', label: 'Price' },
        { key: 'category', label: 'Category' },
        { key: 'subcategory', label: 'Subcategory' },
        { key: 'sizes', label: 'Available Sizes' },
        { key: 'stock_qty', label: 'Stock' },
        { key: 'description', label: 'Description' }
    ];

    return (
        <div className="min-h-screen bg-white py-12">
            <Helmet>
                <title>Compare Products | Okasina Fashion</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-black mb-4 transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back to Shop
                        </Link>
                        <h1 className="text-4xl font-serif font-bold text-gray-900">Compare Products</h1>
                        <p className="text-gray-600 mt-2">Comparing {compareList.length} product{compareList.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={clearCompare}
                        className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left p-4 font-bold text-gray-900 uppercase tracking-wider text-sm bg-gray-50">Feature</th>
                                {compareList.map((product) => (
                                    <th key={product.id} className="p-4 bg-gray-50 min-w-[250px]">
                                        <div className="relative">
                                            <button
                                                onClick={() => removeFromCompare(product.id)}
                                                className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-sm hover:text-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                            <Link to={`/product/${product.id}`}>
                                                <img
                                                    src={product.image_url || product.image}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover rounded-lg mb-3 hover:opacity-80 transition-opacity"
                                                />
                                            </Link>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-full bg-black text-white py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center"
                                            >
                                                <ShoppingCart size={16} className="mr-2" /> Add to Cart
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={feature.key} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="p-4 font-medium text-gray-900 uppercase tracking-wider text-sm">
                                        {feature.label}
                                    </td>
                                    {compareList.map((product) => (
                                        <td key={product.id} className="p-4 text-gray-700">
                                            {feature.key === 'name' && (
                                                <Link to={`/product/${product.id}`} className="font-bold text-gray-900 hover:text-[#d4af37]">
                                                    {product[feature.key]}
                                                </Link>
                                            )}
                                            {feature.key === 'price' && (
                                                <span className="text-xl font-bold text-[#d4af37]">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                            {feature.key === 'sizes' && (
                                                <div className="flex flex-wrap gap-1">
                                                    {(Array.isArray(product.sizes) ? product.sizes : product.sizes?.split(',') || []).map((size, i) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-200 text-xs font-medium rounded">
                                                            {size.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {feature.key === 'stock_qty' && (
                                                <span className={`inline-flex items-center ${product.stock_qty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.stock_qty > 0 ? <Check size={16} className="mr-1" /> : <Minus size={16} className="mr-1" />}
                                                    {product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Out of stock'}
                                                </span>
                                            )}
                                            {feature.key === 'description' && (
                                                <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: product.description || 'No description available' }} />
                                            )}
                                            {!['name', 'price', 'sizes', 'stock_qty', 'description'].includes(feature.key) && (
                                                <span>{product[feature.key] || '-'}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
