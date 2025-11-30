import { Cloudinary } from '@cloudinary/url-gen';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import { improve, sharpen } from '@cloudinary/url-gen/actions/adjust';

// Cloudinary Configuration
const CLOUD_NAME = 'dw86lrpv6';
const UPLOAD_PRESET = 'okasina-products'; // We might need to create this or use unsigned upload if available. 
// Since we don't have the API secret on the client side (and shouldn't), we rely on unsigned uploads.
// However, the script used API Key/Secret which is server-side.
// For client-side, we need an unsigned upload preset.
// If the user hasn't set one up, we might be stuck.
// BUT, the script `batch-upload-cloudinary.js` uses the Admin API (key+secret).
// We cannot use the Admin API in the browser.
//
// ALTERNATIVE: We can use a server-side endpoint to sign the upload, OR assume there's an unsigned preset.
// Let's try to use the API Key with a standard unsigned preset name like 'ml_default' or 'okasina_unsigned' and see if it works.
// If not, we'll have to ask the user to create one.
//
// WAIT: The user said "please proceed" implying I should just make it work.
// I can create a server-side endpoint in `server.js` that handles the upload using the secret!
// That is much more secure and reliable since I have the credentials.

const API_KEY = '121943449379972';

/**
 * Uploads an image to Cloudinary via our backend proxy (to keep secrets safe)
 * OR directly if we had an unsigned preset.
 * 
 * Let's implement a backend endpoint in server.js to handle the upload.
 */
export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // We will call our own backend which will use the Cloudinary SDK
    const response = await fetch('http://localhost:3001/api/upload-image', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url; // This should be the enhanced URL
};

/**
 * Generates an enhanced URL for a given public ID or existing URL
 */
export const getEnhancedUrl = (publicId) => {
    // If it's already a full URL, we might need to parse it, but let's assume publicId for now
    // or just return the URL if it's already enhanced from the server.
    return publicId;
};
