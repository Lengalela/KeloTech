import os
import traceback
import time
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# ─── Setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})

# Load API key from .env.local
load_dotenv('.env.local')
GOOGLE_API_KEY = os.getenv("API_KEY")

# Logging
logging.basicConfig(level=logging.INFO)

# Initialize Gemini model
model = None
if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        logging.info("✅ Gemini model initialized successfully.")
    except Exception as e:
        logging.error(f"❌ Error initializing Gemini model: {e}")
else:
    logging.warning("⚠️ API_KEY not found; AI features disabled.")

# ─── Helpers ──────────────────────────────────────────────────────────────
def build_prompt(student_prompt: str) -> str:
    persona = """You are Kelotech, a helpful, concise (4 Sentences or less unless necessary) and clear (with certainty) friendly learning assistant for K8-K10 students. Your tasks:
1. Explain programming concepts in a fun, simple way
2. Provide personalized quiz feedback and recommendations
3. Suggest review topics and next learning steps
4. Use emojis and positive encouragement
5. Adapt responses to the quiz topic and student's performance"""
    return f"{persona}\n\nStudent's request: {student_prompt}"

def generate_response(prompt: str) -> str:
    """Send prompt to Gemini and return text (no retry)."""
    if not model:
        logging.warning("AI model is unavailable. Returning default suggestion.")
        return "🤖 AI is currently offline. Based on your answers, we recommend starting with HTML or JavaScript to build your foundation in web development. 🚀"

    enhanced = build_prompt(prompt)
    try:
        resp = model.generate_content(enhanced)
        return getattr(resp, 'text', "Error reading AI response")
    except Exception:
        logging.error(traceback.format_exc())
        return "⚠️ An error occurred while generating the AI response. Please try again later."

def generate_response_with_retry(prompt: str, retries: int = 3, delay: int = 2) -> str:
    """Retry wrapper around generate_response."""
    for attempt in range(retries):
        out = generate_response(prompt)
        if not out.startswith("⚠️ An error"):
            return out
        time.sleep(delay)
    return "Sorry, AI service is temporarily unavailable. Try again later."

# ─── API Endpoint ─────────────────────────────────────────────────────────
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}

    # 1) Quiz feedback path (score/total)
    if 'score' in data and 'total' in data:
        try:
            score = int(data['score'])
            total = int(data['total'])
            if total <= 0:
                return jsonify(error="Invalid total questions"), 400

            pct = (score / total) * 100
            levels = [
                (100, "perfect score! 🎯 Suggest advanced topics for {topic}."),
                (80,  "great score! 😎 Suggest review areas and next steps for {topic}."),
                (50,  "good attempt! 💪 Suggest specific {topic} concepts to practice."),
                (0,   "practice needed! 🌱 Suggest fundamental {topic} concepts.")
            ]
            levels.sort(reverse=True)

            topic = data.get('topic', 'this quiz')
            for lvl, msg in levels:
                if pct >= lvl:
                    prompt = f"I scored {score}/{total} on {topic}. {msg.format(topic=topic)}"
                    break

            ai_text = generate_response_with_retry(prompt)
            return jsonify(response=ai_text)

        except Exception as e:
            logging.error(traceback.format_exc())
            return jsonify(error=str(e)), 500

    # 2) Questionnaire path (answers array)
    answers = data.get('answers')
    if isinstance(answers, list):
        prompt = "Student completed a questionnaire with these responses:\n"
        for qa in answers:
            qnum = qa.get('question')
            ans  = qa.get('answer')
            prompt += f"Q{qnum}: {ans}\n"
        prompt += (
            "\nBased on these responses, recommend which course(s) the student should take next "
            "— JavaScript, CSS, HTML, or Java — and explain why."
        )
        ai_text = generate_response_with_retry(prompt)
        return jsonify(response=ai_text)

    # 3) Free-form chat path
    if 'message' in data:
        ai_text = generate_response_with_retry(data['message'])
        return jsonify(response=ai_text)

    return jsonify(error="Invalid request"), 400

# ─── Main ──────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)
