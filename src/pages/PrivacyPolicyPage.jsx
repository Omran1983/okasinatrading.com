import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, UserCheck, FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Shield className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900">Privacy Policy</h1>
                            <p className="text-gray-600 mt-1">Last Updated: November 22, 2025</p>
                        </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        At OKASINA Trading, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                        or make a purchase from our store.
                    </p>
                </div>

                {/* Company Information */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">About OKASINA Trading</h2>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <p className="font-medium">Physical Store Address:</p>
                                <p>Morrisson Street, Souillac (near Souillac Hospital)</p>
                                <p>Savanne District, Mauritius 60810</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <p className="font-medium">Contact Number:</p>
                                <p>+230 5755 6565</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <p className="font-medium">Email:</p>
                                <p>info@okasinatrading.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Compliance */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="text-blue-600" size={20} />
                        Legal Compliance
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        This Privacy Policy complies with the <strong>Data Protection Act 2017 of Mauritius</strong>,
                        which aligns with the European Union's General Data Protection Regulation (GDPR). We are registered
                        with the Data Protection Office of Mauritius and adhere to all applicable data protection laws.
                    </p>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            Information We Collect
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.1 Personal Information</h3>
                        <p className="text-gray-700 mb-3">When you make a purchase or create an account, we collect:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Billing and shipping address</li>
                            <li>Payment information (processed securely through our payment providers)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on our website</li>
                            <li>Referring website addresses</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.3 Information You Provide</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Product reviews and ratings</li>
                            <li>Customer service communications</li>
                            <li>Newsletter subscription preferences</li>
                            <li>Survey responses and feedback</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                            How We Use Your Information
                        </h2>

                        <p className="text-gray-700 mb-4">We use your personal information for the following purposes:</p>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm">✓</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Processing & Fulfillment</p>
                                    <p className="text-gray-600">To process your orders, arrange delivery, and provide customer support</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm">✓</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Communication</p>
                                    <p className="text-gray-600">To send order confirmations, shipping updates, and respond to inquiries</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm">✓</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Marketing (with consent)</p>
                                    <p className="text-gray-600">To send promotional emails about new arrivals, special offers, and events</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm">✓</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Website Improvement</p>
                                    <p className="text-gray-600">To analyze usage patterns and improve our website functionality</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm">✓</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Fraud Prevention</p>
                                    <p className="text-gray-600">To detect and prevent fraudulent transactions and protect our customers</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm">✓</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Legal Compliance</p>
                                    <p className="text-gray-600">To comply with legal obligations and respond to lawful requests</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">3</span>
                            </div>
                            Legal Basis for Processing (Data Protection Act 2017)
                        </h2>

                        <p className="text-gray-700 mb-4">Under the Data Protection Act 2017, we process your personal data based on:</p>

                        <ul className="space-y-3 text-gray-700">
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">•</span>
                                <span><strong>Consent:</strong> You have given explicit consent for us to process your personal data for specific purposes (e.g., marketing communications)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">•</span>
                                <span><strong>Contract Performance:</strong> Processing is necessary to fulfill our contract with you (e.g., processing and delivering your order)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">•</span>
                                <span><strong>Legal Obligation:</strong> We must process your data to comply with legal requirements</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">•</span>
                                <span><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests (e.g., fraud prevention, website improvement)</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">4</span>
                            </div>
                            Information Sharing and Disclosure
                        </h2>

                        <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information with:</p>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                                <p className="text-gray-700">Third-party companies that help us operate our business (payment processors, shipping companies, email service providers). These parties are contractually obligated to protect your data.</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                                <p className="text-gray-700">When required by law, court order, or government regulation, or to protect our rights and safety.</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                                <p className="text-gray-700">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">5</span>
                            </div>
                            Your Rights Under the Data Protection Act 2017
                        </h2>

                        <p className="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="text-blue-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Right to Access</h4>
                                </div>
                                <p className="text-gray-700 text-sm">Request a copy of the personal data we hold about you</p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCheck className="text-purple-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                                </div>
                                <p className="text-gray-700 text-sm">Request correction of inaccurate or incomplete data</p>
                            </div>

                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="text-red-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Right to Erasure</h4>
                                </div>
                                <p className="text-gray-700 text-sm">Request deletion of your personal data ("right to be forgotten")</p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock className="text-green-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Right to Restrict Processing</h4>
                                </div>
                                <p className="text-gray-700 text-sm">Request limitation on how we use your data</p>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="text-yellow-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Right to Object</h4>
                                </div>
                                <p className="text-gray-700 text-sm">Object to processing for direct marketing purposes</p>
                            </div>

                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="text-indigo-600" size={20} />
                                    <h4 className="font-semibold text-gray-900">Right to Data Portability</h4>
                                </div>
                                <p className="text-gray-700 text-sm">Receive your data in a structured, machine-readable format</p>
                            </div>
                        </div>

                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-gray-700">
                                <strong>To exercise any of these rights,</strong> please contact us at <a href="mailto:info@okasinatrading.com" className="text-blue-600 hover:underline">info@okasinatrading.com</a> or call <a href="tel:+2305755656" className="text-blue-600 hover:underline">+230 5755 6565</a>. We will respond to your request within 30 days.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">6</span>
                            </div>
                            Data Security
                        </h2>

                        <p className="text-gray-700 mb-4">We implement appropriate technical and organizational security measures to protect your personal data:</p>

                        <ul className="space-y-2 text-gray-700 ml-4">
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>SSL/TLS encryption for all data transmission</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>Secure payment processing through certified payment gateways</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>Regular security audits and updates</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>Access controls and authentication measures</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>Employee training on data protection</span>
                            </li>
                        </ul>

                        <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-gray-700">
                                <strong>Data Breach Notification:</strong> In the event of a personal data breach that poses a high risk to your rights and freedoms, we will notify you and the Data Protection Commissioner within 72 hours, as required by the Data Protection Act 2017.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">7</span>
                            </div>
                            Cookies and Tracking Technologies
                        </h2>

                        <p className="text-gray-700 mb-4">We use cookies and similar technologies to enhance your browsing experience:</p>

                        <div className="space-y-3">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-1">Essential Cookies</h4>
                                <p className="text-gray-700 text-sm">Required for website functionality (shopping cart, checkout)</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                                <p className="text-gray-700 text-sm">Help us understand how visitors use our website</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                                <p className="text-gray-700 text-sm">Used to deliver relevant advertisements (with your consent)</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mt-4">
                            You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">8</span>
                            </div>
                            Data Retention
                        </h2>

                        <p className="text-gray-700 mb-4">We retain your personal data only for as long as necessary:</p>

                        <ul className="space-y-2 text-gray-700 ml-4">
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span><strong>Order Information:</strong> 7 years (for tax and accounting purposes)</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span><strong>Marketing Data:</strong> Until you withdraw consent or request deletion</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span><strong>Account Data:</strong> Until account deletion is requested</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span><strong>Analytics Data:</strong> Anonymized after 26 months</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 9 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">9</span>
                            </div>
                            Children's Privacy
                        </h2>

                        <p className="text-gray-700">
                            Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children.
                            If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately,
                            and we will delete such information from our systems.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">10</span>
                            </div>
                            International Data Transfers
                        </h2>

                        <p className="text-gray-700">
                            Your personal data may be transferred to and processed in countries outside of Mauritius, including servers located in other jurisdictions.
                            We ensure that such transfers comply with the Data Protection Act 2017 and that appropriate safeguards are in place to protect your data,
                            including standard contractual clauses approved by the Data Protection Commissioner.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">11</span>
                            </div>
                            Changes to This Privacy Policy
                        </h2>

                        <p className="text-gray-700">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
                            We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                            We encourage you to review this Privacy Policy periodically.
                        </p>
                    </section>

                    {/* Contact Section */}
                    <section className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white">
                        <h2 className="text-2xl font-serif font-bold mb-4">Contact Us</h2>
                        <p className="mb-6">
                            If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail size={20} />
                                <a href="mailto:info@okasinatrading.com" className="hover:underline">info@okasinatrading.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} />
                                <a href="tel:+2305755656" className="hover:underline">+230 5755 6565</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>Morrisson Street, Souillac (near Souillac Hospital), Mauritius 60810</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/20">
                            <p className="text-sm">
                                <strong>Data Protection Officer:</strong> For matters specifically related to data protection,
                                you may also contact the Data Protection Office of Mauritius at{' '}
                                <a href="https://dataprotection.govmu.org" className="underline" target="_blank" rel="noopener noreferrer">
                                    dataprotection.govmu.org
                                </a>
                            </p>
                        </div>
                    </section>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
