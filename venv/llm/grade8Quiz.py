import json

# Define the answer key for Grade 8 Lesson 1 Quiz
answer_key = ['b', 'b', 'b', 'b', 'c']

def get_student_score(student_answers):
    """Calculate the score percentage based on student's answers."""
    correct = sum(1 for answer, key in zip(student_answers, answer_key) if answer.lower() == key)
    return (correct / len(answer_key)) * 100

def recommend_grade8(score):
    """Return a recommendation based on the student's score."""
    if score >= 70:
        return "Great job! You are ready to move on to the next lesson on real-world JavaScript applications."
    elif 50 <= score < 70:
        return "You did okay. We recommend reviewing Lesson 1 and practicing the exercises for more understanding."
    else:
        return "It looks like you need extra help. We suggest a remedial session on JavaScript basics."

def run_quiz():
    # Clear introductory message
    print("\n==============================")
    print("Grade 8 Lesson 1: Introduction to JavaScript Quiz")
    print("==============================\n")
    
    # List of quiz questions
    questions = [
        "1. What is JavaScript used for? (a, b, c, or d): ",
        "2. Which of the following is a real-world example of JavaScript? (a, b, c, or d): ",
        "3. Which tag is used to add JavaScript inside an HTML file? (a, b, c, or d): ",
        "4. What will the following code do?\n   <script>alert('Welcome to JavaScript!')</script>\n   (a, b, c, or d): ",
        "5. How do you display a pop-up asking for the user's name? (a, b, c, or d): "
    ]

    student_answers = []
    for q in questions:
        answer = input(q).strip()
        student_answers.append(answer)

    score = get_student_score(student_answers)
    recommendation = recommend_grade8(score)

    result = {
        "Grade": 8,
        "Score": score,
        "Recommendation": recommendation
    }

    with open("grade8_recommendation.json", "w") as f:
        json.dump(result, f, indent=4)

    # Clear final output for clarity
    print("\n==============================")
    print("Quiz Completed!")
    print("==============================\n")
    print("Your Score: {:.2f}%".format(score))
    print("Recommendation:", recommendation)
    print("\nResults have been saved to 'grade8_recommendation.json'.\n")

if __name__ == "__main__":
    run_quiz()
