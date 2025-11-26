import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Zap, Settings, Database, Tag, DollarSign, FileText } from 'lucide-react';

const NodeWrapper = ({ children, label, icon: Icon, color = 'bg-white', selected }) => (
    <div className={`shadow-lg rounded-lg border-2 ${selected ? 'border-blue-500' : 'border-gray-200'} bg-white min-w-[200px]`}>
        <div className={`p-2 ${color} rounded-t-md flex items-center gap-2 border-b border-gray-100`}>
            {Icon && <Icon size={16} className="text-white" />}
            <span className="text-xs font-bold text-white uppercase tracking-wider">{label}</span>
        </div>
        <div className="p-3">
            {children}
        </div>
    </div>
);

export const TriggerNode = memo(({ data, selected }) => {
    return (
        <NodeWrapper label="Trigger" icon={Zap} color="bg-yellow-500" selected={selected}>
            <div className="text-sm font-medium text-gray-900">{data.label}</div>
            <p className="text-xs text-gray-500 mt-1">{data.description || 'Starts the workflow'}</p>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-yellow-500" />
        </NodeWrapper>
    );
});

export const ActionNode = memo(({ data, selected }) => {
    const getIcon = () => {
        switch (data.actionType) {
            case 'update_price': return DollarSign;
            case 'update_description': return FileText;
            case 'add_tag': return Tag;
            default: return Settings;
        }
    };

    const Icon = getIcon();

    return (
        <NodeWrapper label="Action" icon={Icon} color="bg-blue-600" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-600" />
            <div className="text-sm font-medium text-gray-900">{data.label}</div>
            <p className="text-xs text-gray-500 mt-1">{data.description || 'Performs an action'}</p>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-600" />
        </NodeWrapper>
    );
});
