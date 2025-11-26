import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex px-4 py-3 text-gray-700 border-b border-gray-100 bg-gray-50/50" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-yellow-600">
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const name = value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={to}>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                {isLast ? (
                                    <span className="ml-1 text-sm font-medium text-gray-900 md:ml-2">{name}</span>
                                ) : (
                                    <Link to={to} className="ml-1 text-sm font-medium text-gray-500 hover:text-yellow-600 md:ml-2">
                                        {name}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
