import json
from langchain_ollama import OllamaLLM
import ollama

model = OllamaLLM(model="llama2")
# Questions and possible responses
questions = [
    {"question": "Do you enjoy solving puzzles and logic problems? (yes/no)", "course": "JavaScript"},
    {"question": "Do you prefer designing layouts and visuals? (yes/no)", "course": "HTML & CSS"},
    {"question": "Have you ever written any code before? (yes/no)", "course": "Beginner"},
    {"question": "Would you like to create interactive web pages? (yes/no)", "course": "JavaScript"},
    {"question": "Are you interested in making animations or games? (yes/no)", "course": "JavaScript"},
    {"question": "Do you prefer structuring content over interactivity? (yes/no)", "course": "HTML & CSS"},
]

# Store user choices
responses = {"JavaScript": 0, "HTML & CSS": 0}

# Ask questions and count responses
for q in questions:
    answer = input(q["question"]).strip().lower()
    if answer == "yes":
        if q["course"] in responses:
            responses[q["course"]] += 1

# Determine recommended course
recommended_course = max(responses, key=responses.get)

# Save results
with open("recommended_course.json", "w") as f:
    json.dump({"Recommended Course": recommended_course}, f, indent=4)

print(f"\n✅ Based on your answers, we recommend learning: {recommended_course} 🚀")
