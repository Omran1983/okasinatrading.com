import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                        alt="Elegant Fashion"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" /> {/* Lighter overlay */}
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                    <p className="text-yellow-400 font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">
                        New Collection 2025
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight tracking-tight">
                        Elegance Redefined
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover the finest collection of modern Indian wear and accessories, curated for the sophisticated individual who values tradition and style.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block bg-white text-gray-900 hover:bg-gray-100 transition-colors px-10 py-4 text-sm font-bold tracking-widest uppercase"
                    >
                        Shop Collection
                    </Link>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-70 animate-bounce">
                        <span className="text-[10px] uppercase tracking-widest mb-2">Scroll</span>
                        <div className="w-[1px] h-12 bg-white/50"></div>
                    </div>
                </div>
            </section>

            {/* Placeholder for Featured Products */}
            <section className="py-24 px-4 max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Featured Collection</h2>
                <div className="w-16 h-[2px] bg-yellow-500 mx-auto mb-12" />
                <p className="text-gray-500">Loading products...</p>
            </section>
        </div>
    );
}
