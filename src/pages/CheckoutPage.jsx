import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            customer_name: formData.fullName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            shipping_address: `${formData.address}, ${formData.city}`,
            order_notes: formData.notes,
            total_amount: subtotal,
            items: cart,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('orders')
            .insert([orderData]);

        if (error) {
            alert('Error placing order: ' + error.message);
            setLoading(false);
        } else {
            clearCart();
            alert('Order placed successfully!');
            navigate('/'); // Or redirect to a Thank You page
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Your cart is empty. Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold mb-12 text-center">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Checkout Form */}
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-8">Shipping Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    className="w-full border-gray-300 border p-3 focus:ring-black focus:border-black transition-colors"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full border-gray-300 border p-3 focus:ring-black focus:border-black transition-colors"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full border-gray-300 border p-3 focus:ring-black focus:border-black transition-colors"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    className="w-full border-gray-300 border p-3 focus:ring-black focus:border-black transition-colors"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    className="w-full border-gray-300 border p-3 focus:ring-black focus:border-black transition-colors"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    rows="4"
                                    className="w-full border-gray-300 border p-3 focus:ring-black focus:border-black transition-colors"
                                    value={formData.notes}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-8 h-fit">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-8">Your Order</h2>
                        <div className="space-y-6 mb-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-20 bg-white flex-shrink-0">
                                        <img
                                            src={item.image_url || item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-serif font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            Rs {(Number(item.price) * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>Rs {subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
