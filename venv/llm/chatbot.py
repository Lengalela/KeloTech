from langchain_ollama import OllamaLLM
import ollama
import json

model = OllamaLLM(model="llama2")


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

# Define the model configuration for the chatbot
modelfile = """
FROM llama2
SYSTEM "You are a helpful chatbot that answers school-related questions only to students from K8, K9, and K10. Your responses should be succinct, precise, informative, and polite. Avoid unnecessary details and focus on clarity."
PARAMETER temperature 0.1
"""

# Create the model (if needed, ensure it is created)
##/ollama.create(model="chatbot", modelfile=modelfile)

# Chat function for terminal interaction
def chat():
    print("Starting the chatbot...")
    if not is_ollama_running():
        print("⚠️ Ollama is not running. Start it with `ollama serve`.")  # Ensure Ollama is running first
        return

    history = load_chat_history()  # Load previous chat history

    print("\n🤖 Chatbot is ready! Type 'exit' to quit.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("\nChat history saved. Goodbye! 👋")
            break

        # Use last 5 messages for better context
        context = "\n".join([f"You: {h['user']}\nBot: {h['bot']}" for h in history[-5:]])

        try:
            # Send request to Ollama with the updated model for K8-K10 students
            response = ollama.generate(
                model="llama2",  # This is your custom model for K8-K10 students
                prompt=f"{context}\nYou: {user_input}\nBot:",
                options={"temperature": 0.1}
            )
            bot_reply = response['response'].strip()
            print(f"🤖 Bot: {bot_reply}")
            
            # Store chat history
            history.append({"user": user_input, "bot": bot_reply})
            save_chat_history(history)

        except Exception as e:
            print(f"Error generating response: {e}")  # Debugging statement

# Run chatbot
if __name__ == "__main__":
    chat()
