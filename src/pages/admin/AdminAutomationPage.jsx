import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AutomationBuilder from '../../components/admin/automation/AutomationBuilder';

export default function AdminAutomationPage() {
    return (
        <AdminLayout>
            <div className="h-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Automation Builder</h1>
                    <p className="text-gray-600">Create automated workflows to manage your store.</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-180px)]">
                    <AutomationBuilder />
                </div>
            </div>
        </AdminLayout>
    );
}
