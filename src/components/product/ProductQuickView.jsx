import React, { useState } from 'react';
import { X, ShoppingCart, Heart, ZoomIn } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductQuickView = ({ product, isOpen, onClose }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (!isOpen || !product) return null;

    const images = [
        product.image_url_1,
        product.image_url_2,
        product.image_url_3,
        product.image_url_4,
        product.image_url_5
    ].filter(Boolean);

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }

        addToCart({
            ...product,
            selectedSize,
            quantity: 1
        });

        onClose();
    };

    const handleViewFullDetails = () => {
        navigate(`/product/${product.id}`);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                <img
                                    src={images[selectedImage] || '/placeholder-product.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={handleViewFullDetails}
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                                >
                                    <div className="bg-white rounded-full p-3">
                                        <ZoomIn size={24} />
                                    </div>
                                </button>
                            </div>

                            {/* Thumbnail Images */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-5 gap-2">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-[#d4af37]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {product.category} • SKU: {product.sku}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-bold text-[#d4af37]">
                                    ₹{product.selling_price?.toLocaleString()}
                                </span>
                                {product.mrp && product.mrp > product.selling_price && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{product.mrp.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-green-600 font-medium">
                                            {Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Select Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-lg transition-all ${selectedSize === size
                                                        ? 'border-[#d4af37] bg-[#d4af37] text-white'
                                                        : 'border-gray-300 hover:border-[#d4af37]'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div>
                                {product.stock_qty > 0 ? (
                                    <p className="text-sm text-green-600 font-medium">
                                        ✓ In Stock ({product.stock_qty} available)
                                    </p>
                                ) : (
                                    <p className="text-sm text-red-600 font-medium">
                                        Out of Stock
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_qty === 0}
                                    className="w-full bg-[#d4af37] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b5952f] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart size={20} />
                                    <span>Add to Cart</span>
                                </button>

                                <button
                                    onClick={handleViewFullDetails}
                                    className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                                >
                                    View Full Details
                                </button>
                            </div>

                            {/* Additional Info */}
                            {product.fabric && (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Fabric:</span>
                                            <span className="ml-2 font-medium">{product.fabric}</span>
                                        </div>
                                        {product.color && (
                                            <div>
                                                <span className="text-gray-500">Color:</span>
                                                <span className="ml-2 font-medium">{product.color}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductQuickView;
