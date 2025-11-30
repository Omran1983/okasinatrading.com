// Pre-built Workflow Templates for Okasina Fashion Store

export const workflowTemplates = [
    {
        id: 'bulk-publish-drafts',
        name: 'Publish All Draft Products',
        description: 'Automatically publish all products in draft status',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start', description: 'Click to run' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Status',
                    actionType: 'filter_status',
                    description: 'Select draft products'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Publish',
                    actionType: 'publish',
                    description: 'Make products active'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'seasonal-discount',
        name: 'Apply Seasonal Discount',
        description: 'Apply 20% discount to all clothing items',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Category',
                    actionType: 'filter_category',
                    description: 'Select Clothing'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Apply Discount',
                    actionType: 'apply_discount',
                    description: '20% off'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'low-stock-alert',
        name: 'Set Low Stock Alerts',
        description: 'Configure alerts for products with low inventory',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Stock',
                    actionType: 'filter_stock',
                    description: 'Low stock items'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Set Low Stock Alert',
                    actionType: 'set_stock_alert',
                    description: 'Alert at 5 units'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'price-increase',
        name: 'Increase Prices by 10%',
        description: 'Raise all active product prices by 10%',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Status',
                    actionType: 'filter_status',
                    description: 'Active products'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Increase Price',
                    actionType: 'increase_price',
                    description: '+10%'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'archive-out-of-stock',
        name: 'Archive Out of Stock Products',
        description: 'Move all out-of-stock items to archive',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Stock',
                    actionType: 'filter_stock',
                    description: 'Out of stock'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Archive',
                    actionType: 'archive',
                    description: 'Move to archive'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'new-collection',
        name: 'Create Summer Collection',
        description: 'Tag selected products for summer collection',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Category',
                    actionType: 'filter_category',
                    description: 'Select category'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Add to Collection',
                    actionType: 'add_collection',
                    description: 'Summer 2025'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'social-media-blast',
        name: 'Social Media Blast',
        description: 'Post new products to all social media platforms',
        nodes: [
            {
                id: '1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: { label: 'Manual Start' }
            },
            {
                id: '2',
                type: 'action',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Filter by Status',
                    actionType: 'filter_status',
                    description: 'Active products'
                }
            },
            {
                id: '3',
                type: 'action',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Post to All',
                    actionType: 'post_all_social',
                    description: 'Share everywhere'
                }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'clearance-sale',
        name: 'Clearance Event',
        description: '50% off Accessories + Tag as Clearance',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Category', actionType: 'filter_category', description: 'Accessories' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Decrease Price', actionType: 'decrease_price', description: '50% off' } },
            { id: '4', type: 'action', position: { x: 1000, y: 100 }, data: { label: 'Add Tag', actionType: 'add_tag', description: 'Clearance' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: 'restock-announcement',
        name: 'Restock Announcement',
        description: 'Post to social media when stock is high',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Stock', actionType: 'filter_stock', description: 'High Stock' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Post to All', actionType: 'post_all_social', description: 'Back in Stock!' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'end-of-season',
        name: 'End of Season Sale',
        description: '30% off Clothing + Instagram Post',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Category', actionType: 'filter_category', description: 'Clothing' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Decrease Price', actionType: 'decrease_price', description: '30% off' } },
            { id: '4', type: 'action', position: { x: 1000, y: 100 }, data: { label: 'Post to Instagram', actionType: 'post_instagram', description: 'Sale Alert' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: 'liquidation-sale',
        name: 'Liquidation Sale',
        description: '70% off Low Stock Items + TikTok',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Stock', actionType: 'filter_stock', description: 'Low Stock' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Decrease Price', actionType: 'decrease_price', description: '70% off' } },
            { id: '4', type: 'action', position: { x: 1000, y: 100 }, data: { label: 'Post to TikTok', actionType: 'post_tiktok', description: 'Last Chance!' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: 'launch-teaser',
        name: 'Product Launch Teaser',
        description: 'Tease Draft Products on Facebook',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Status', actionType: 'filter_status', description: 'Drafts' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Post to Facebook', actionType: 'post_facebook', description: 'Coming Soon' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'holiday-prep',
        name: 'Holiday Sale Prep',
        description: 'Tag all products for Holiday Sale',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Status', actionType: 'filter_status', description: 'Active' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Add Tag', actionType: 'add_tag', description: 'Holiday Sale' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'midnight-madness',
        name: 'Midnight Madness',
        description: '40% off EVERYTHING + Social Blast',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Status', actionType: 'filter_status', description: 'Active' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Decrease Price', actionType: 'decrease_price', description: '40% off' } },
            { id: '4', type: 'action', position: { x: 1000, y: 100 }, data: { label: 'Post to All', actionType: 'post_all_social', description: 'Flash Sale!' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: 'promote-category',
        name: 'Promote Specific Category',
        description: 'Select category and post to all platforms',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Category', actionType: 'filter_category', description: 'Select Category' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Post to All', actionType: 'post_all_social', description: 'Check this out!' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'bulk-category-change',
        name: 'Bulk Category Reassignment',
        description: 'Move products from one category to another',
        nodes: [
            { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Start' } },
            { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Filter Category', actionType: 'filter_category', description: 'Select Old Category' } },
            { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Change Category', actionType: 'change_category', description: 'Select New Category' } }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    }
];
