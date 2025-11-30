import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Use a real image from the project
const dummyImagePath = path.join(process.cwd(), 'public/categories/sarees.jpg');
// fs.writeFileSync(dummyImagePath, 'This is a dummy image content for testing upload endpoint.');

// In a real scenario, this would be a binary image file.
// Cloudinary might reject a text file if it checks magic numbers, but let's try.
// If it fails, we know the endpoint is reachable at least.
// Better: let's try to find a real image in the project or create a tiny 1x1 png.
// I'll just use the text file to check connectivity first.

async function testUpload() {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(dummyImagePath));

        console.log('Uploading to http://localhost:3001/api/upload-image...');
        const response = await fetch('http://localhost:3001/api/upload-image', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        console.log('Upload Success!');
        console.log('URL:', data.url);
        console.log('Public ID:', data.public_id);
    } catch (err) {
        console.error('Test Failed:', err.message);
    } finally {
        // if (fs.existsSync(dummyImagePath)) {
        //     fs.unlinkSync(dummyImagePath);
        // }
    }
}

testUpload();
