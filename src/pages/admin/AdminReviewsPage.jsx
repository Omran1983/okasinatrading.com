import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    Star,
    Search,
    Filter,
    ThumbsUp,
    MessageSquare,
    TrendingUp,
    Eye,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        average: 0,
        pending: 0,
        approved: 0
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reviews')
                .select('*, products(name, image_url)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setReviews(data || []);
            calculateStats(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (reviewData) => {
        const total = reviewData.length;
        const average = total > 0
            ? reviewData.reduce((sum, r) => sum + (r.rating || 0), 0) / total
            : 0;
        const pending = reviewData.filter(r => !r.approved).length;
        const approved = reviewData.filter(r => r.approved).length;

        setStats({ total, average, pending, approved });
    };

    const handleApprove = async (reviewId) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ approved: true })
                .eq('id', reviewId);

            if (error) throw error;

            fetchReviews();
        } catch (error) {
            console.error('Error approving review:', error);
            alert('Failed to approve review');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId);

            if (error) throw error;

            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.products?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
        return matchesSearch && matchesRating;
    });

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Reviews</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MessageSquare className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Average Rating</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">
                                    {stats.average.toFixed(1)}
                                </p>
                                <div className="mt-2">
                                    {renderStars(Math.round(stats.average))}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Star className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Eye className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search reviews by customer, product, or comment..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center text-gray-500">
                            Loading reviews...
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center text-gray-500">
                            No reviews found
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4 flex-1">
                                        {review.products?.image_url && (
                                            <img
                                                src={review.products.image_url}
                                                alt={review.products.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {review.customer_name || 'Anonymous'}
                                                </h3>
                                                {renderStars(review.rating)}
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.products?.name && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Product: {review.products.name}
                                                </p>
                                            )}
                                            <p className="text-gray-700">{review.comment}</p>
                                            {!review.approved && (
                                                <div className="mt-3">
                                                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                        Pending Approval
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        {!review.approved && (
                                            <button
                                                onClick={() => handleApprove(review.id)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
