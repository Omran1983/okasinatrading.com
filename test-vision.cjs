// test-vision.js
const vision = require('@google-cloud/vision');

// Instantiates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './server/service-account.json', // adjust path as needed
});

async function quickTest() {
  const [result] = await client.labelDetection({
    image: {source: {imageUri: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg'}},
  });
  console.log('Labels:', result.labelAnnotations.map(label => label.description));
}

quickTest().catch(console.error);
