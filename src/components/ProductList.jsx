import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../contexts/CartContext';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();

    const category = searchParams.get('category');

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        setLoading(true);
        let query = supabase
            .from('products')
            .select('*')
            .eq('status', 'active'); // Only show active products

        if (category) {
            // Case-insensitive search for category
            query = query.ilike('category', `%${category}%`);
        }

        const { data, error } = await query;
        if (!error) {
            setProducts(data || []);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="animate-pulse">
                        <div className="bg-gray-100 aspect-[3/4] mb-4"></div>
                        <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-100 w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 font-light text-lg">No products found in this category.</p>
                <Link to="/shop" className="text-black underline mt-2 inline-block hover:text-yellow-600 transition-colors">View all products</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                        <img
                            src={product.image_url || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/400x600?text=No+Image')}
                        />
                        {/* Quick Add Overlay */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="absolute inset-x-0 bottom-0 bg-white/90 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white"
                        >
                            Quick Add
                        </button>
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">
                            {product.category}
                        </p>
                        <Link to={`/product/${product.id}`}>
                            <h3 className="font-serif text-lg text-gray-900 group-hover:text-yellow-600 transition-colors">
                                {product.name}
                            </h3>
                        </Link>
                        <p className="text-sm font-medium text-gray-900">
                            Rs {product.price_mur?.toLocaleString() || (product.price * 45).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
