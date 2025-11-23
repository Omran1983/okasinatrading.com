import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();

    // Calculate total
    const subtotal = cart.reduce((sum, item) => {
        const price = item.price_mur || (Number(item.price) * 45);
        return sum + (price * item.quantity);
    }, 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
                <h2 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    to="/shop"
                    className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold mb-12">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-6 py-6 border-b border-gray-100">
                                    {/* Image */}
                                    <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                                        <img
                                            src={item.image_url || item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-serif text-lg font-medium text-gray-900">
                                                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                                                </h3>
                                                <p className="font-medium text-gray-900">
                                                    Rs {((item.price_mur || (Number(item.price) * 45)) * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                            {item.selectedSize && (
                                                <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    className="p-2 hover:bg-gray-50 text-gray-500"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    className="p-2 hover:bg-gray-50 text-gray-500"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-sm text-gray-400 hover:text-red-600 flex items-center transition-colors"
                                            >
                                                <Trash2 size={14} className="mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-8 sticky top-24">
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-8">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>Rs {subtotal.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Including VAT</p>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
