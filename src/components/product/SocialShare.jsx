import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Link2, MessageCircle, Check } from 'lucide-react';

const SocialShare = ({ product, url }) => {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const shareUrl = url || window.location.href;
    const shareText = `Check out ${product.name} at Okasina Fashion Store!`;
    const shareImage = product.image_url_1;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => navigator.share ? handleNativeShare() : setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
            >
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
            </button>

            {/* Share Options Dropdown */}
            {isOpen && !navigator.share && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Share this product</h3>

                        {/* Facebook */}
                        <button
                            onClick={handleFacebookShare}
                            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Facebook size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Share on Facebook</span>
                        </button>

                        {/* Twitter */}
                        <button
                            onClick={handleTwitterShare}
                            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                <Twitter size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Share on Twitter</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <MessageCircle size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Share on WhatsApp</span>
                        </button>

                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                {copied ? (
                                    <Check size={16} className="text-white" />
                                ) : (
                                    <Link2 size={16} className="text-white" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {copied ? 'Link Copied!' : 'Copy Link'}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default SocialShare;
