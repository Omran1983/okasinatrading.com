import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Trash2, Plus, Tag } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_amount: 0
    });
    const { addToast } = useToast();

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setCoupons(data);
        }
        setLoading(false);
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('coupons')
            .insert([newCoupon]);

        if (error) {
            addToast('Failed to create coupon', 'error');
        } else {
            addToast('Coupon created successfully', 'success');
            setNewCoupon({
                code: '',
                discount_type: 'percentage',
                discount_value: 0,
                min_order_amount: 0
            });
            fetchCoupons();
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) {
            addToast('Failed to delete coupon', 'error');
        } else {
            addToast('Coupon deleted', 'success');
            setCoupons(prev => prev.filter(c => c.id !== id));
        }
    };

    const toggleActive = async (id, currentStatus) => {
        const { error } = await supabase
            .from('coupons')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (error) {
            addToast('Failed to update status', 'error');
        } else {
            fetchCoupons();
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
                <Tag className="mr-3" /> Coupon Management
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Coupon Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm h-fit border">
                    <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
                    <form onSubmit={handleCreateCoupon} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Code (e.g., SAVE10)</label>
                            <input
                                type="text"
                                required
                                className="w-full border p-2 rounded uppercase"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={newCoupon.discount_type}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (Rs)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full border p-2 rounded"
                                    value={newCoupon.discount_value}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Min Order Amount (Rs)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full border p-2 rounded"
                                value={newCoupon.min_order_amount}
                                onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: parseFloat(e.target.value) })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 font-bold rounded hover:bg-gray-800 flex items-center justify-center"
                        >
                            <Plus size={18} className="mr-2" /> Create Coupon
                        </button>
                    </form>
                </div>

                {/* Coupons List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-bold text-sm">Code</th>
                                    <th className="p-4 font-bold text-sm">Discount</th>
                                    <th className="p-4 font-bold text-sm">Min Order</th>
                                    <th className="p-4 font-bold text-sm">Status</th>
                                    <th className="p-4 font-bold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                                ) : coupons.length === 0 ? (
                                    <tr><td colSpan="5" className="p-4 text-center text-gray-500">No coupons found.</td></tr>
                                ) : (
                                    coupons.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono font-bold">{coupon.code}</td>
                                            <td className="p-4">
                                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `Rs ${coupon.discount_value}`}
                                            </td>
                                            <td className="p-4">Rs {coupon.min_order_amount}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleActive(coupon.id, coupon.is_active)}
                                                    className={`px-2 py-1 rounded text-xs font-bold ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {coupon.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteCoupon(coupon.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
