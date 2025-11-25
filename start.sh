#!/bin/bash
MODEL="${OLLAMA_MODEL:-finalend/hermes-3-llama-3.1}"
echo "🛸 starting Ollama server..."
ollama serve &
echo "🌱 waiting for server to wake up..."
sleep 5
echo "🍿 pulling model: $MODEL"
ollama pull "$MODEL"
echo "☣️ model ready, Ollama running on port 11434"
echo "⚡ starting Node.js app..."
exec npm start