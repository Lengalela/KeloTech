# venv/chatbot.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env.local
load_dotenv('../.env.local')
GOOGLE_API_KEY = os.getenv("API_KEY")

# Configure the Generative AI model
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')  # Or another suitable model

def generate_response(prompt):
    """Generates a response from the Gemini model."""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred: {e}"

def main():
    """Main function to run the chatbot."""
    print("Welcome to the Chatbot! Type 'quit' to exit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break
        if user_input:
            response = generate_response(user_input)
            print(f"Bot: {response}")

if __name__ == "__main__":
    main()