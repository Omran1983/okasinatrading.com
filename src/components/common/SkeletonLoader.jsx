import React from 'react';

// Base skeleton component
export const Skeleton = ({ className = '', width, height }) => (
    <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width, height }}
    />
);

// Product card skeleton
export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <Skeleton className="w-full h-64" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>
        </div>
    </div>
);

// Product grid skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
            <ProductCardSkeleton key={index} />
        ))}
    </div>
);

// Product detail skeleton
export const ProductDetailSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div>
                <Skeleton className="w-full h-96 mb-4" />
                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-20" />
                    ))}
                </div>
            </div>

            {/* Details skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4">
                    <Skeleton className="h-10 w-32 mb-4" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead>
                <tr>
                    {Array.from({ length: columns }).map((_, i) => (
                        <th key={i} className="px-6 py-3">
                            <Skeleton className="h-4" />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <td key={colIndex} className="px-6 py-4">
                                <Skeleton className="h-4" />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Skeleton;
