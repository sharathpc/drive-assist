#!/bin/bash

# Start Ollama in the background
/bin/ollama serve &
# Record Process Id.
pid=$!

# Pause for Ollama to start.
sleep 5

echo "Retrive LLM model..."
ollama pull phi:latest
echo "Done!"

echo "Retrive Embeddings model..."
ollama pull nomic-embed-text
echo "Done!"

# Wait for Ollama process to finish
wait $pid