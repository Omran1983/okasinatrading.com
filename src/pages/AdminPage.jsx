import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Package, DollarSign, Clock, Upload } from 'lucide-react';

export default function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (orderId, newStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (!error) {
            fetchOrders(); // Refresh
        } else {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
                    <Link
                        to="/admin/stock-manager"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Upload size={20} />
                        Bulk Import Products
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mr-4">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Orders</p>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-50 text-green-600 rounded-full mr-4">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Revenue</p>
                                <p className="text-2xl font-bold">
                                    Rs {orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full mr-4">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Pending Orders</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-medium">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Items</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{order.customer_name}</p>
                                            <p className="text-gray-500">{order.customer_email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.items && order.items.length} items
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            Rs {order.total_amount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="border-gray-200 rounded text-xs p-1"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
