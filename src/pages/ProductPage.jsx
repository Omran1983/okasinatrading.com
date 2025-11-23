import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../contexts/CartContext';
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (!error) {
            setProduct(data);
            // Pre-select first size if available
            if (data.sizes) {
                const sizes = data.sizes.split(',').map(s => s.trim());
                if (sizes.length > 0) setSelectedSize(sizes[0]);
            }
        }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Section */}
                    <div className="bg-gray-50 aspect-[3/4] overflow-hidden">
                        <img
                            src={product.image_url || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/600x800?text=No+Image')}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">{product.category}</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">(4.8/5 based on 12 reviews)</span>
                        </div>

                        <p className="text-2xl font-medium text-gray-900 mb-8">
                            Rs {product.price_mur?.toLocaleString() || (product.price * 45).toLocaleString()}
                        </p>

                        <div className="prose prose-sm text-gray-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Size Selector */}
                        {sizes.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 flex items-center justify-center border ${selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-black'
                                                } transition-colors`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <button
                            onClick={() => addToCart({ ...product, selectedSize })}
                            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mb-8"
                        >
                            Add to Cart
                        </button>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Truck size={18} className="mr-3 text-gray-400" />
                                <span>Delivery from Rs 100</span>
                            </div>
                            <div className="flex items-center">
                                <ShieldCheck size={18} className="mr-3 text-gray-400" />
                                <span>Authentic Quality</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
