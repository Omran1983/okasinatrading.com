const fs = require('fs');
const axios = require('axios');

const API_TOKEN = process.env.HF_API_TOKEN;
const MODEL_URL = 'https://api-inference.huggingface.co/models/google/vit-base-patch16-224';

async function tagImage(imagePath) {
  const image = fs.readFileSync(imagePath);
  const response = await axios.post(MODEL_URL, image, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/octet-stream',
    },
  });
  return response.data;
}

// Example usage:
tagImage('./path-to-your-image.jpg').then(tags => {
  console.log('Tags:', tags);
}).catch(err => {
  console.error(err.response ? err.response.data : err.message);
});
