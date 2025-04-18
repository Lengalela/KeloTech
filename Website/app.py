from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import json
import os
import subprocess

app = Flask(__name__)
CORS(app)

# Constants
CHAT_HISTORY_FILE = "chat_history.json"
MODEL_NAME = "deepseek-school"
MODELFILE_NAME = "Modelfile"

# Define your DeepSeek Modelfile content
modelfile_content = """
FROM deepseek-r1:8b

SYSTEM "You are a helpful chatbot that answers school-related questions only to students from K8, K9, and K10. Your responses should be succinct, precise, informative, and polite. Avoid unnecessary details and focus on clarity."

PARAMETER temperature 0.1
"""

# Setup and build the model if needed
def setup_model():
    write_file = False
    if not os.path.exists(MODELFILE_NAME):
        write_file = True
    else:
        with open(MODELFILE_NAME, "r") as f:
            if f.read().strip() != modelfile_content.strip():
                write_file = True

    if write_file:
        with open(MODELFILE_NAME, "w") as f:
            f.write(modelfile_content)

        try:
            subprocess.run(["ollama", "create", MODEL_NAME, "-f", MODELFILE_NAME], check=True)
            print(f"[INFO] Model '{MODEL_NAME}' created successfully from deepseek-r1:8b.")
        except subprocess.CalledProcessError as e:
            print(f"[ERROR] Model creation failed: {e}")

# Load chat history from file
def load_chat_history():
    try:
        with open(CHAT_HISTORY_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save chat history to file
def save_chat_history(history):
    with open(CHAT_HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

# Check if Ollama is running
def is_ollama_running():
    try:
        ollama.list()
        return True
    except Exception as e:
        print(f"Ollama not running: {e}")
        return False

# Chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    if not is_ollama_running():
        return jsonify({"response": "Ollama not running. Start it with `ollama serve`."})

    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"response": "No message received."})

    # Load last 5 messages for context
    history = load_chat_history()
    context = "\n".join([f"You: {h['user']}\nBot: {h['bot']}" for h in history[-5:]])
    prompt = f"{context}\nYou: {user_input}\nBot:"

    try:
        response = ollama.generate(
            model=MODEL_NAME,
            prompt=prompt,
            options={"temperature": 0.1}
        )
        bot_reply = response['response'].strip()

        # Save new exchange to history
        history.append({"user": user_input, "bot": bot_reply})
        save_chat_history(history)

        return jsonify({"response": bot_reply})

    except Exception as e:
        return jsonify({"response": f"Error generating response: {e}"})


if __name__ == '__main__':
    setup_model()  # Ensure model is ready before serving
    app.run(debug=True, host='0.0.0.0', port=8000)
