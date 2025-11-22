// scripts/batch-upload-cloudinary.js

const cloudinary = require('cloudinary').v2;
const fg = require('fast-glob');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// ==== CONFIGURE YOUR CLOUDINARY ACCOUNT ====
cloudinary.config({
  cloud_name: 'dw86lrpv6',
  api_key: '121943449379972',
  api_secret: 'uVWGCQ4jKjQWo5xZMCdRMs7rdLo'
});

// ==== CONFIGURE YOUR IMAGE FOLDER ====
const IMAGE_GLOB = path.join(__dirname, '../images/*.{jpg,png,jpeg}'); // Adjust if needed

(async () => {
  const imageFiles = await fg([IMAGE_GLOB]);
  console.log(`Found ${imageFiles.length} images.`);

  const uploadedData = [];

  for (const file of imageFiles) {
    try {
      const uploadRes = await cloudinary.uploader.upload(file, {
        folder: 'okasina-products' // Optional: will group images in Cloudinary
      });
      console.log(`Uploaded: ${file} -> ${uploadRes.secure_url}`);

      uploadedData.push({
        original_filename: path.basename(file),
        cloudinary_url: uploadRes.secure_url
      });
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err.message);
      uploadedData.push({
        original_filename: path.basename(file),
        cloudinary_url: 'UPLOAD_FAILED'
      });
    }
  }

  // ==== WRITE RESULTS TO A NEW CSV ====
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, '../cloudinary-upload-results.csv'),
    header: [
      { id: 'original_filename', title: 'Original Filename' },
      { id: 'cloudinary_url', title: 'Cloudinary URL' }
    ]
  });

  await csvWriter.writeRecords(uploadedData);
  console.log('CSV written: cloudinary-upload-results.csv');
})();
