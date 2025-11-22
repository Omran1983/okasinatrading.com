// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- AI Chat endpoint using Ollama/Llama3 ---
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const prompt = messages.map(m =>
      `${m.role === "user" ? "User" : "AI"}: ${m.content}`
    ).join('\n') + "\nAI:";

    // Send to Ollama running Llama3 locally
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt,
        stream: false
      }
    );
    res.json({ answer: response.data.response.trim() });
  } catch (err) {
    console.error("Ollama API Chat Error:", err?.response?.data || err.message);
    res.status(500).json({ error: err.message, details: err?.response?.data });
  }
});

// --- OPTIONAL: Product Recommendation and Feedback Analysis (stubbed for now) ---
app.post("/api/recommend", async (req, res) => {
  // You can reimplement with Ollama if desired
  res.json({ recommendations: ["AI Recommendations are currently disabled (Ollama only supports chat for now)."] });
});
app.post("/api/feedback-analyze", async (req, res) => {
  res.json({ result: "Feedback analysis AI is currently disabled (Ollama only supports chat for now)." });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI backend running on port ${PORT} (Llama 3 local AI active)`);
});
