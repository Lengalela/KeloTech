# app.py
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai

app = Flask(__name__, static_folder='Website/Frontend_Website', static_url_path='')

# Load environment variables
load_dotenv('.env.local')
GOOGLE_API_KEY = os.getenv("API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def generate_response(prompt):
    """Generates a response from the Gemini model."""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred: {e}"

@app.route('/')
def index():
    """Serves the main HTML file."""
    return send_from_directory(app.static_folder, 'course_detail.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handles incoming chat messages and returns AI responses."""
    data = request.get_json()
    user_message = data.get('message')
    if user_message:
        ai_response = generate_response(user_message)
        return jsonify({'response': ai_response})
    return jsonify({'error': 'No message received'}), 400

if __name__ == '__main__':
    app.run(debug=True)