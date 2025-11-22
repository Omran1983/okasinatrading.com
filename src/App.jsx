import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminMarketingPage from './pages/admin/AdminMarketingPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import MediaManagerPage from './pages/admin/MediaManagerPage';
import StockManagerPage from './pages/StockManagerPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';

export default function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                            <Route path="/admin" element={<AdminDashboardPage />} />
                            <Route path="/admin/products" element={<AdminProductsPage />} />
                            <Route path="/admin/orders" element={<AdminOrdersPage />} />
                            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                            <Route path="/admin/marketing" element={<AdminMarketingPage />} />
                            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
                            <Route path="/admin/media" element={<MediaManagerPage />} />
                            <Route path="/admin/stock-manager" element={<StockManagerPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </CartProvider>
    );
}
