import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Star, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function ReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (!error) {
            setReviews(data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const { error } = await supabase
            .from('reviews')
            .insert([{
                product_id: productId,
                user_name: newReview.name,
                rating: newReview.rating,
                comment: newReview.comment
            }]);

        if (error) {
            addToast('Failed to submit review', 'error');
        } else {
            addToast('Review submitted successfully!', 'success');
            setNewReview({ name: '', rating: 5, comment: '' });
            fetchReviews();
        }
        setSubmitting(false);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div>
                    <div className="flex items-center mb-8">
                        <div className="text-5xl font-bold mr-4">{averageRating}</div>
                        <div>
                            <div className="flex text-yellow-500 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <p className="text-gray-500">{reviews.length} Reviews</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 p-2 rounded-full mr-3">
                                                <User size={16} />
                                            </div>
                                            <span className="font-bold">{review.user_name}</span>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Write Review Form */}
                <div className="bg-white border p-6 rounded-lg h-fit">
                    <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Your Name</label>
                            <input
                                type="text"
                                required
                                className="w-full border p-2 rounded focus:ring-black focus:border-black"
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className={`p-1 ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                    >
                                        <Star size={24} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Comment</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full border p-2 rounded focus:ring-black focus:border-black"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
