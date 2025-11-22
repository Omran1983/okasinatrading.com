import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#111111] text-white pt-20 pb-10 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-serif font-bold text-white mb-6 tracking-widest">OKASINA</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Redefining elegance with a curated collection of modern Indian wear. Tradition meets contemporary style.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={18} /></a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop?category=clothing" className="hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link to="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                            <li><Link to="/shop?category=sale" className="hover:text-white transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link to="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
                            <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
                            <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#222] text-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 border border-transparent"
                            />
                            <button className="bg-white text-black font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-gray-200 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wider">
                    <p>&copy; {new Date().getFullYear()} OKASINA FASHION. ALL RIGHTS RESERVED.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
                        <Link to="/admin" className="hover:text-white">Admin Dashboard</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
