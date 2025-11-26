import React, { useState } from 'react';

export default function ProductFilters({ filters, setFilters, mobileOpen, setMobileOpen }) {
    const categories = [
        {
            name: 'Clothing',
            subcategories: [
                'Churidar',
                'Pant Set',
                'Cord Set',
                'Maxi Dress',
                'Gown',
                'Lehenga',
                'Kurti'
            ]
        },
        {
            name: 'Accessories',
            subcategories: [
                'Jewelry',
                'Bags',
                'Scarves',
                'Footwear'
            ]
        }
    ];

    const priceRanges = [
        { label: 'Under Rs 1,000', min: 0, max: 1000 },
        { label: 'Rs 1,000 - Rs 2,500', min: 1000, max: 2500 },
        { label: 'Rs 2,500 - Rs 5,000', min: 2500, max: 5000 },
        { label: 'Over Rs 5,000', min: 5000, max: 100000 }
    ];

    const handleCategoryChange = (category, subcategory = null) => {
        setFilters(prev => ({
            ...prev,
            category: category,
            subcategory: subcategory === prev.subcategory ? null : subcategory
        }));
    };

    const handlePriceChange = (range) => {
        setFilters(prev => ({
            ...prev,
            priceRange: prev.priceRange?.label === range.label ? null : range
        }));
    };

    return (
        <>
            {/* Mobile Filter Dialog Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileOpen(false)}></div>
                    <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                            <button
                                type="button"
                                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Filters */}
                        <form className="mt-4 border-t border-gray-200">
                            <div className="px-4 py-6">
                                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {categories.map((category) => (
                                        <li key={category.name}>
                                            <button
                                                type="button"
                                                onClick={() => handleCategoryChange(category.name)}
                                                className={`text-sm ${filters.category === category.name ? 'font-bold text-yellow-600' : 'text-gray-600'}`}
                                            >
                                                {category.name}
                                            </button>
                                            {filters.category === category.name && (
                                                <ul className="mt-2 ml-4 space-y-2">
                                                    {category.subcategories.map((sub) => (
                                                        <li key={sub}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCategoryChange(category.name, sub)}
                                                                className={`text-sm ${filters.subcategory === sub ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}
                                                            >
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 px-4 py-6">
                                <h3 className="text-sm font-medium text-gray-900">Price</h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {priceRanges.map((range) => (
                                        <li key={range.label} className="flex items-center">
                                            <input
                                                id={`price-${range.label}-mobile`}
                                                name="price[]"
                                                type="checkbox"
                                                checked={filters.priceRange?.label === range.label}
                                                onChange={() => handlePriceChange(range)}
                                                className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                                            />
                                            <label htmlFor={`price-${range.label}-mobile`} className="ml-3 text-sm text-gray-600">
                                                {range.label}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Desktop Filters */}
            <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
                <form className="space-y-10 divide-y divide-gray-200">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                        <ul role="list" className="mt-4 space-y-4">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryChange(category.name)}
                                        className={`text-sm block w-full text-left ${filters.category === category.name ? 'font-bold text-yellow-600' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        {category.name}
                                    </button>
                                    {filters.category === category.name && (
                                        <ul className="mt-2 ml-4 space-y-2 border-l-2 border-gray-100 pl-4">
                                            {category.subcategories.map((sub) => (
                                                <li key={sub}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCategoryChange(category.name, sub)}
                                                        className={`text-sm block w-full text-left transition-colors ${filters.subcategory === sub ? 'text-yellow-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                                                    >
                                                        {sub}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-10">
                        <h3 className="text-sm font-medium text-gray-900">Price</h3>
                        <ul role="list" className="mt-4 space-y-4">
                            {priceRanges.map((range) => (
                                <li key={range.label} className="flex items-center">
                                    <input
                                        id={`price-${range.label}`}
                                        name="price[]"
                                        type="checkbox"
                                        checked={filters.priceRange?.label === range.label}
                                        onChange={() => handlePriceChange(range)}
                                        className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                                    />
                                    <label htmlFor={`price-${range.label}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                                        {range.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </form>
            </div>
        </>
    );
}
