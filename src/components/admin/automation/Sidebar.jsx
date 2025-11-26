import React from 'react';
import { Zap, DollarSign, FileText, Tag, PlusCircle } from 'lucide-react';

export default function Sidebar() {
    const onDragStart = (event, nodeType, actionType = null, label = 'New Node') => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        if (actionType) event.dataTransfer.setData('actionType', actionType);
        event.dataTransfer.setData('label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-6 h-full overflow-y-auto">
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Triggers</h3>
                <div className="space-y-3">
                    <div
                        className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-grab hover:shadow-md transition-shadow"
                        onDragStart={(event) => onDragStart(event, 'trigger', null, 'Manual Start')}
                        draggable
                    >
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                            <Zap size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Manual Start</p>
                            <p className="text-xs text-gray-500">Click to run</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Product Actions</h3>
                <div className="space-y-3">
                    <div
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab hover:shadow-md transition-shadow"
                        onDragStart={(event) => onDragStart(event, 'action', 'update_price', 'Update Price')}
                        draggable
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <DollarSign size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Update Price</p>
                            <p className="text-xs text-gray-500">Bulk change prices</p>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab hover:shadow-md transition-shadow"
                        onDragStart={(event) => onDragStart(event, 'action', 'update_description', 'Update Description')}
                        draggable
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <FileText size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Description</p>
                            <p className="text-xs text-gray-500">Modify descriptions</p>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab hover:shadow-md transition-shadow"
                        onDragStart={(event) => onDragStart(event, 'action', 'add_tag', 'Add Tag')}
                        draggable
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Tag size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Add Tag</p>
                            <p className="text-xs text-gray-500">Tag products</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
