import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

import SearchBar from './SearchBar';

export default function Header() {
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Calculate total items safely
    const totalItems = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-3xl font-serif font-bold text-gray-900 tracking-widest z-50">
                    OKASINA
                </Link>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <SearchBar />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8 mr-8">
                    <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black uppercase tracking-widest transition-colors">Home</Link>
                    <Link to="/shop?category=clothing" className="text-sm font-medium text-gray-700 hover:text-black uppercase tracking-widest transition-colors">Clothing</Link>
                    <Link to="/shop?category=accessories" className="text-sm font-medium text-gray-700 hover:text-black uppercase tracking-widest transition-colors">Accessories</Link>
                </nav>

                {/* Right Icons */}
                <div className="flex items-center gap-6">
                    <Link to="/wishlist" className="text-gray-400 hover:text-black transition-colors hidden sm:block" aria-label="Wishlist">
                        <Heart size={20} />
                    </Link>
                    <Link to="/account" className="text-gray-400 hover:text-black transition-colors hidden sm:block" aria-label="Account">
                        <User size={20} />
                    </Link>

                    {/* Cart Link - Wrapped to prevent layout issues */}
                    <div className="relative">
                        <Link to="/cart" className="text-gray-900 hover:text-gray-600 transition-colors block" aria-label="Shopping Cart">
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full pointer-events-none">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden hover:text-black focus:outline-none z-50"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-white z-40 pt-24 px-6">
                    <nav className="flex flex-col gap-6 text-xl font-medium">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600">Home</Link>
                        <Link to="/shop?category=clothing" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600">Clothing</Link>
                        <Link to="/shop?category=accessories" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600">Accessories</Link>
                        <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600">Cart ({totalItems})</Link>
                        <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600">Wishlist</Link>
                        <Link to="/account" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600">Account</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
