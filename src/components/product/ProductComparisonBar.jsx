import React from 'react';
import { X, ShoppingCart, Trash2, Minimize2 } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const ProductComparisonBar = () => {
    const { compareList, removeFromCompare, clearCompare, isOpen, setIsOpen } = useComparison();
    const { addToCart } = useCart();

    if (compareList.length === 0) return null;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-40 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-gray-800 transition-all"
            >
                <span className="font-bold">Compare ({compareList.length})</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 transform translate-y-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-gray-900">Compare Products ({compareList.length}/4)</h3>
                        <Link
                            to="/compare"
                            className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                        >
                            View Comparison
                        </Link>
                        <button
                            onClick={clearCompare}
                            className="text-sm text-red-600 hover:text-red-700 underline"
                        >
                            Clear All
                        </button>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Minimize2 size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {compareList.map((product) => (
                        <div key={product.id} className="relative bg-gray-50 rounded-lg p-3 flex items-start space-x-3 group">
                            <button
                                onClick={() => removeFromCompare(product.id)}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                            >
                                <X size={14} />
                            </button>

                            <div className="w-16 h-20 flex-shrink-0 bg-white rounded overflow-hidden">
                                <img
                                    src={product.image_url || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#d4af37]">
                                    {product.name}
                                </Link>
                                <p className="text-sm font-bold text-[#d4af37] mt-1">
                                    Rs {product.price_mur?.toLocaleString()}
                                </p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="mt-2 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors flex items-center justify-center w-full"
                                >
                                    <ShoppingCart size={12} className="mr-1" /> Add
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: 4 - compareList.length }).map((_, i) => (
                        <div key={i} className="hidden md:flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4">
                            <p className="text-sm text-gray-400">Add product</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductComparisonBar;
