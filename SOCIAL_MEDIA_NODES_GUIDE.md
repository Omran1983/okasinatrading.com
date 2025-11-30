# Social Media Marketing Nodes - Manual Integration

## Problem
The file editing tool is having issues with `CustomNodes.jsx`. The Sidebar.jsx has been successfully updated with social media nodes, but CustomNodes.jsx needs manual updates.

## What's Already Done ✅
- ✅ Sidebar.jsx - Social Media section added with 4 nodes
- ✅ All other automation features working

## What Needs Manual Update
File: `src/components/admin/automation/CustomNodes.jsx`

### Step 1: Update Imports (Line 7)
**Find this line:**
```javascript
    Copy, PlusCircle
```

**Replace with:**
```javascript
    Copy, PlusCircle, Facebook, Instagram, Share2, Video
```

### Step 2: Add Social Media Icons (After line 63, before `default:`)
**Find this section:**
```javascript
            // Filters
            case 'filter_category': return Filter;
            case 'filter_stock': return Package;
            case 'filter_status': return Tag;
            
            default: return Settings;
```

**Replace with:**
```javascript
            // Filters
            case 'filter_category': return Filter;
            case 'filter_stock': return Package;
            case 'filter_status': return Tag;
            
            // Social Media
            case 'post_facebook': return Facebook;
            case 'post_instagram': return Instagram;
            case 'post_tiktok': return Video;
            case 'post_all_social': return Share2;
            
            default: return Settings;
```

### Step 3: Add Social Media Colors (After line 73, before `return 'bg-blue-600';`)
**Find this section:**
```javascript
        if (type?.includes('category') || type?.includes('collection')) return 'bg-indigo-600';
        return 'bg-blue-600';
```

**Replace with:**
```javascript
        if (type?.includes('category') || type?.includes('collection')) return 'bg-indigo-600';
        if (type === 'post_facebook') return 'bg-blue-600';
        if (type === 'post_instagram') return 'bg-pink-600';
        if (type === 'post_tiktok') return 'bg-gray-800';
        if (type === 'post_all_social') return 'bg-purple-600';
        return 'bg-blue-600';
```

## Result
After these changes, you'll have 4 new social media marketing nodes:
- 📘 Post to Facebook (blue)
- 📸 Post to Instagram (pink)
- 🎵 Post to TikTok (dark gray)
- 🔄 Post to All Platforms (purple)

## Alternative: Copy-Paste Full File
If the above is too complex, I can provide the complete corrected file content to copy-paste.
