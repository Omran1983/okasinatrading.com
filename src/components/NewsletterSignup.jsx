import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

import { sanitizeInput } from '../utils/sanitize';

const NewsletterSignup = ({ className = '' }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedEmail = sanitizeInput(email);

        if (!sanitizedEmail || !/^\S+@\S+\.\S+$/.test(sanitizedEmail)) {
            setStatus('error');
            addToast('Please enter a valid email address', 'error');
            return;
        }

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            addToast('Successfully subscribed to newsletter!');
            setEmail('');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="text-green-600" size={24} />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Subscribed!</h3>
                <p className="text-sm text-gray-600">
                    Thank you for subscribing. You'll receive our latest updates and exclusive offers soon.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-sm text-green-700 font-medium hover:underline"
                >
                    Subscribe another email
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                        }}
                        placeholder="Enter your email"
                        disabled={status === 'loading'}
                        className={`w-full bg-[#222] text-white px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 border ${status === 'error' ? 'border-red-500' : 'border-transparent'
                            } transition-colors disabled:opacity-60`}
                    />
                    <Mail
                        size={18}
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${status === 'error' ? 'text-red-500' : 'text-gray-400'
                            }`}
                    />
                </div>

                {status === 'error' && (
                    <p className="text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        Please enter a valid email address
                    </p>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-white text-black font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                    {status === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </form>
        </div>
    );
};

export default NewsletterSignup;
