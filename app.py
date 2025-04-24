import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

load_dotenv('.env.local')
GOOGLE_API_KEY = os.getenv("API_KEY")

genai.configure(api_key=GOOGLE_API_KEY) # Configure here, it handles missing key gracefully

model = None  # Initialize model outside the if block
if GOOGLE_API_KEY:
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
    except Exception as e:
        print(f"Error initializing Gemini model: {e}")
else:
    print("Warning: Google API key not found. Kelotech won't be able to chat! 🔑 Missing!")

def generate_response(prompt):
    """Generates a response from the Gemini model with persona and name."""
    persona = """You are Kelotech, a helpful, friendly, and energetic learning assistant for an e-learning platform for K8–K10 students. Your main jobs are to:
1. Explain HTML, CSS, and JavaScript concepts in a fun and simple way.
2. Guide students to the right course based on their answers to a questionnaire.
3. Encourage learning and celebrate progress with emojis and positivity.
4. Speak in a way that's clear and engaging for young teens."""
    enhanced_prompt = f"{persona}\n\nStudent's question/request: {prompt}"
    if model:
        try:
            response = model.generate_content(enhanced_prompt)
            return response.text
        except Exception as e:
            return f"An error occurred in generate_response: {e}"
    else:
        return "Hi there! I'm Kelotech, but I'm not quite ready to chat yet. Please make sure the API key is set! 🔑"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')
    if user_message:
        ai_response = generate_response(user_message)
        return jsonify({'response': ai_response})
    return jsonify({'error': 'Oops! Kelotech couldn\'t process that request right now. 🙁'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)