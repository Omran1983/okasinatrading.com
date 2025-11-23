# Ollama Setup for Product Image Analysis

## Install Ollama (if not already installed)
Download from: https://ollama.com/download

## Pull the vision model
```bash
ollama pull llava:7b
```

## Start Ollama server
```bash
ollama serve
```

The server will run on `http://localhost:11434`

## Test it works
```bash
curl http://localhost:11434/api/tags
```

You should see `llava:7b` in the list.

---

## How It Will Work

1. **Album Import** → Downloads photos from Facebook/Instagram
2. **Your Laptop (Ollama)** → Analyzes each photo locally
3. **Generates** → Product name, description, category, price suggestion
4. **Creates Products** → Automatically adds to your Supabase database

**Privacy:** All AI processing happens on your laptop - images never leave your machine!

**Speed:** ~3-5 seconds per product with your GTX 1660 Ti
