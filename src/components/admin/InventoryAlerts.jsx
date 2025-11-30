import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { supabase } from '../../supabase';

export default function InventoryAlerts() {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLowStockProducts();
    }, []);

    const fetchLowStockProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, stock_qty, image_url')
                .lt('stock_qty', 5)
                .order('stock_qty', { ascending: true })
                .limit(5);

            if (error) throw error;
            setLowStockProducts(data || []);
        } catch (error) {
            console.error('Error fetching inventory alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />;

    if (lowStockProducts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-gray-400" />
                    Inventory Alerts
                </h3>
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <p className="text-sm">No low stock alerts</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    Low Stock Alerts
                </h3>
                <Link
                    to="/admin/stock-manager"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                    Manage Stock <ArrowRight size={14} className="ml-1" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {lowStockProducts.map(product => (
                    <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <img
                            src={product.image_url || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-red-600 font-medium">
                                Only {product.stock_qty} left
                            </p>
                        </div>
                        <Link
                            to={`/admin/products?edit=${product.id}`}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Edit
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
