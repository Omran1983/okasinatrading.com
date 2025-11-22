import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';

export default function ShopPage() {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    // Helper to format title (e.g., "clothing" -> "Clothing")
    const title = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "Our Collection";

    return (
        <div className="min-h-screen bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light">
                        Explore our curated selection of premium fashion and accessories.
                    </p>
                </div>
                <ProductList />
            </div>
        </div>
    );
}
