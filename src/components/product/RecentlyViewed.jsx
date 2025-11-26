import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, X } from 'lucide-react';

const RecentlyViewed = ({ currentProductId, limit = 10 }) => {
    const [recentProducts, setRecentProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load recently viewed from localStorage
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

        // Filter out current product
        const filtered = viewed.filter(p => p.id !== currentProductId);

        setRecentProducts(filtered.slice(0, limit));
    }, [currentProductId, limit]);

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    const clearHistory = () => {
        localStorage.removeItem('recentlyViewed');
        setRecentProducts([]);
    };

    if (recentProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Eye size={20} className="text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Recently Viewed</h2>
                </div>
                <button
                    onClick={clearHistory}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Clear
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentProducts.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="group text-left"
                    >
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                            <img
                                src={product.image_url_1 || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#d4af37]">
                            {product.name}
                        </h3>
                        <p className="text-sm font-semibold text-[#d4af37] mt-1">
                            ₹{product.selling_price?.toLocaleString()}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Helper function to add product to recently viewed
export const addToRecentlyViewed = (product) => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

    // Remove if already exists
    const filtered = viewed.filter(p => p.id !== product.id);

    // Add to beginning
    const updated = [
        {
            id: product.id,
            name: product.name,
            selling_price: product.selling_price,
            image_url_1: product.image_url_1,
            category: product.category
        },
        ...filtered
    ].slice(0, 20); // Keep last 20

    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};

export default RecentlyViewed;
