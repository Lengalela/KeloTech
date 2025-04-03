import http.server
import socketserver
import json
import ollama

PORT = 8000
CHAT_HISTORY_FILE = "chat_history.json"

def load_chat_history():
    try:
        with open(CHAT_HISTORY_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_chat_history(history):
    with open(CHAT_HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

def chatbot_response(user_input):
    history = load_chat_history()
    context = "\n".join([f"You: {h['user']}\nBot: {h['bot']}" for h in history[-5:]])

    response = ollama.generate(
        model="llama2",
        prompt=f"{context}\nYou: {user_input}\nBot:",
        options={"temperature": 0.1}
    )

    bot_reply = response['response'].strip()
    history.append({"user": user_input, "bot": bot_reply})
    save_chat_history(history)

    return bot_reply

class ChatbotHandler(http.server.SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == "/chat":
            content_length = int(self.headers.get("Content-Length", 0))

            # ✅ FIX: If Content-Length is 0, return an error
            if content_length == 0:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Empty request body"}).encode())
                return

            post_data = self.rfile.read(content_length).decode("utf-8")

            # ✅ FIX: Ensure request body is valid JSON
            try:
                request_data = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON format"}).encode())
                return

            user_input = request_data.get("message", "").strip()

            # ✅ FIX: Ensure "message" key exists and is not empty
            if not user_input:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Message cannot be empty"}).encode())
                return

            bot_response = chatbot_response(user_input)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"response": bot_response}).encode())

with socketserver.TCPServer(("", PORT), ChatbotHandler) as httpd:
    print(f"🚀 Server running on http://localhost:{PORT}")
    httpd.serve_forever()
