from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the model configuration for the chatbot
modelfile = """
FROM llama2
SYSTEM "You are a helpful chatbot that answers school-related questions only to students from K8, K9, and K10. Your responses should be succinct, precise, informative, and polite. Avoid unnecessary details and focus on clarity."
PARAMETER temperature 0.1
"""

# File to store chat history
CHAT_HISTORY_FILE = "chat_history.json"

# Load chat history from file
def load_chat_history():
    try:
        with open(CHAT_HISTORY_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save chat history
def save_chat_history(history):
    with open(CHAT_HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

# Ensure Ollama is running
def is_ollama_running():
    try:
        ollama.list()  # Checks if Ollama is available
        return True
    except Exception as e:
        print(f"Ollama not running: {e}")  # Debugging statement
        return False

# Chat endpoint to interact with Ollama model
@app.route('/chat', methods=['POST'])
def chat():
    if not is_ollama_running():
        return jsonify({"response": "Ollama not running. Start it with `ollama serve`."})

    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"response": "No message received."})

    # Load chat history
    history = load_chat_history()

    # Use last 5 messages for context
    context = "\n".join([f"You: {h['user']}\nBot: {h['bot']}" for h in history[-5:]])

    # Combine system message and user input with context
    prompt = f"{modelfile}\n{context}\nYou: {user_input}\nBot:"

    try:
        # Generate a response using Ollama with the model configuration and prompt
        response = ollama.generate(
            model="llama2",  # You can change this to any specific model or use a custom model
            prompt=prompt,
            options={"temperature": 0.1}  # Additional parameters if needed
        )
        bot_reply = response['response'].strip()

        # Save chat history
        history.append({"user": user_input, "bot": bot_reply})
        save_chat_history(history)

        return jsonify({"response": bot_reply})

    except Exception as e:
        return jsonify({"response": f"Error generating response: {e}"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)  # Make sure it's running on port 8000
