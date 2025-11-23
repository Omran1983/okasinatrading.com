import { useState } from 'react';
import { supabase } from '../supabase.js';

export default function FeedbackPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const { error } = await supabase.from('feedback').insert([form]);

        if (error) {
            console.error(error);
            setStatus('error');
        } else {
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Feedback</h1>
            <p className="text-gray-600 mb-8">We value your feedback and suggestions. Please share your thoughts with us.</p>

            {status === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded mb-6">
                    ✓ Thank you! Your feedback has been received.
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded mb-6">
                    ✗ Oops – something went wrong. Please try again.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        placeholder="What is your feedback about?"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                        name="message"
                        placeholder="Share your thoughts, suggestions, or report an issue..."
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {status === 'loading' ? 'Sending...' : 'Send Feedback'}
                </button>
            </form>
        </div>
    );
}
