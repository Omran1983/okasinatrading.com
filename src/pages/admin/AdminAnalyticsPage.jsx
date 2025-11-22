import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    Calendar
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30days');
    const [analytics, setAnalytics] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        products: 0,
        revenueChange: 0,
        ordersChange: 0,
        salesData: [],
        categoryData: [],
        topProducts: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // Fetch orders
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .gte('created_at', getDateRange());

            if (ordersError) throw ordersError;

            // Fetch products
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*');

            if (productsError) throw productsError;

            // Calculate analytics
            const revenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
            const ordersCount = orders?.length || 0;

            // Generate sales data for chart
            const salesData = generateSalesData(orders || []);

            // Generate category data
            const categoryData = generateCategoryData(products || []);

            // Get top products
            const topProducts = getTopProducts(products || []);

            setAnalytics({
                revenue,
                orders: ordersCount,
                customers: new Set(orders?.map(o => o.customer_email)).size || 0,
                products: products?.length || 0,
                revenueChange: 12.5, // Mock data
                ordersChange: 8.3, // Mock data
                salesData,
                categoryData,
                topProducts
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDateRange = () => {
        const now = new Date();
        const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
        const date = new Date(now.setDate(now.getDate() - days));
        return date.toISOString();
    };

    const generateSalesData = (orders) => {
        const data = [];
        const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayOrders = orders.filter(o =>
                o.created_at?.split('T')[0] === dateStr
            );

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
                orders: dayOrders.length
            });
        }

        return data;
    };

    const generateCategoryData = (products) => {
        const categories = {};
        products.forEach(p => {
            const cat = p.category || 'Other';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        return Object.entries(categories).map(([name, value]) => ({
            name,
            value
        }));
    };

    const getTopProducts = (products) => {
        return products
            .sort((a, b) => (b.stock || 0) - (a.stock || 0))
            .slice(0, 5);
    };

    const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Time Range Selector */}
                <div className="flex justify-end">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    ${analytics.revenue.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="text-green-600" size={16} />
                                    <span className="text-sm text-green-600 font-medium">
                                        +{analytics.revenueChange}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {analytics.orders}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="text-green-600" size={16} />
                                    <span className="text-sm text-green-600 font-medium">
                                        +{analytics.ordersChange}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Customers</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {analytics.customers}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Unique customers</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Products</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {analytics.products}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Total products</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Package className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    name="Revenue ($)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#8B5CF6" name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                        <div className="space-y-4">
                            {analytics.topProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <img
                                        src={product.image_url || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">${product.price?.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">{product.stock} in stock</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
