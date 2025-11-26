import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ currentProductId, category }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (category) {
            fetchRelatedProducts();
        }
    }, [category, currentProductId]);

    const fetchRelatedProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .neq('id', currentProductId)
            .limit(4);

        if (!error) {
            setProducts(data);
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-serif font-bold mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group block">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <img
                                src={product.image_url || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                        <p className="text-gray-500 mt-1">
                            Rs {product.price_mur?.toLocaleString() || (product.price * 45).toLocaleString()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
