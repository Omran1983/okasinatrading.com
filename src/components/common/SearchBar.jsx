import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { supabase } from '../../supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                performSearch();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('id, name, image_url, image, price, price_mur, category')
            .ilike('name', `%${query}%`)
            .limit(5);

        if (!error) {
            setResults(data);
        }
        setLoading(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            // Navigate to shop with search query (if we had a search page, for now just close)
            // Or better, navigate to the first result if available
            if (results.length > 0) {
                navigate(`/product/${results[0].id}`);
            }
        }
    };

    return (
        <div ref={searchRef} className="relative">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Search size={20} />
                </button>
            ) : (
                <div className="absolute right-0 top-0 w-72 md:w-96 bg-white shadow-xl border rounded-lg z-50 overflow-hidden">
                    <form onSubmit={handleSearchSubmit} className="flex items-center p-2 border-b">
                        <Search size={18} className="text-gray-400 ml-2" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search products..."
                            className="flex-grow p-2 outline-none text-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); setQuery(''); }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                    </form>

                    {query && (
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                            ) : results.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">No results found.</div>
                            ) : (
                                <div>
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                        >
                                            <div className="w-12 h-16 bg-gray-100 flex-shrink-0 overflow-hidden rounded mr-3">
                                                <img
                                                    src={product.image_url || product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                                                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                                                <p className="text-xs font-bold mt-1">
                                                    Rs {product.price_mur?.toLocaleString() || (product.price * 45).toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
