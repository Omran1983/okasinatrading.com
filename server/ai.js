// Install with: npm install express cors body-parser node-fetch
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());

// POST /api/ai { prompt: "..." }
app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: "mistral", // or "llama3"
      prompt,
      stream: false
    }),
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await response.json();
  res.json({ result: json.response });
});

app.listen(5050, () => console.log("Ollama AI API listening on http://localhost:5050/api/ai"));
