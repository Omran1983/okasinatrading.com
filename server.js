// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- AI Chat endpoint using Ollama/Llama3 ---
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ message: "Server is working!" });
});

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

// --- Cloudinary Upload Endpoint ---
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dw86lrpv6',
  api_key: '121943449379972',
  api_secret: 'uVWGCQ4jKjQWo5xZMCdRMs7rdLo'
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/upload-image", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'okasina-products',
      // AI Enhancements applied ON UPLOAD
      transformation: [
        { quality: "auto", fetch_format: "auto" }, // Optimize size/format
        { effect: "improve:outdoor" },            // AI Enhance (lighting/color)
        { effect: "sharpen:100" }                 // Crisp details
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Supabase Admin Endpoints ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Update product categories
app.post('/api/update-category', async (req, res) => {
  try {
    const { productIds, category } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs are required' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log(`Updating ${productIds.length} products to category: ${category}`);

    const { data, error, count } = await supabaseAdmin
      .from('products')
      .update({ category }, { count: 'exact' })
      .in('id', productIds);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Successfully updated ${count} products`);

    return res.status(200).json({
      success: true,
      count,
      message: `Updated ${count} products to ${category}`
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete product
app.post('/api/delete-product', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    console.log(`Deleting product: ${productId}`);
    console.log(`Using key starting with: ${supabaseKey?.substring(0, 5)}...`);

    // Check if product exists and is visible
    const { data: checkData, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (checkError) {
      console.log('Error checking product visibility:', checkError);
    } else {
      console.log('Product is visible to server:', checkData);
    }

    const { error, count } = await supabaseAdmin
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', productId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (count === 0) {
      return res.status(404).json({ error: 'Product not found or already deleted' });
    }

    console.log(`Successfully deleted product`);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Create product
app.post('/api/create-product', async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.name || !productData.price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    console.log(`Creating product: ${productData.name}`);

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Successfully created product: ${data.id}`);

    return res.status(201).json({
      success: true,
      product: data,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Update product
app.post('/api/update-product', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    console.log(`Updating product: ${id}`);

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Successfully updated product: ${id}`);

    return res.status(200).json({
      success: true,
      product: data,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI backend running on port ${PORT} (Llama 3 local AI active)`);
});
