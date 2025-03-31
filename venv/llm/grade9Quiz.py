import json

# Define the answer key for Grade 9 Lesson 1: JavaScript Functions Quiz
# Answer Key: 1-c, 2-b, 3-b, 4-a, 5-d, 6-c, 7-d, 8-c, 9-b, 10-a
answer_key = ['c', 'b', 'b', 'a', 'd', 'c', 'd', 'c', 'b', 'a']

def get_student_score(student_answers):
    """Calculate the percentage score from student's answers."""
    correct = sum(1 for answer, key in zip(student_answers, answer_key) if answer.lower() == key)
    return (correct / len(answer_key)) * 100

def recommend_grade9(score):
    """Return a recommendation based on the student's score for Grade 9."""
    if score >= 70:
        return "Excellent work! You have a strong grasp of JavaScript functions. You can move on to more advanced topics."
    elif 50 <= score < 70:
        return "Good effort. We recommend reviewing the lesson and practicing function exercises to improve your understanding."
    else:
        return "It looks like you need extra help. We suggest revisiting the basics of JavaScript functions and completing additional practice exercises."

def run_quiz():
    # Print an introductory header
    print("\n===================================")
    print("Grade 9 Lesson 1: JavaScript Functions Quiz")
    print("===================================\n")
    print("Please answer each question by typing a, b, c, or d.\n")
    
    # List of quiz questions for Grade 9
    questions = [
        "1. What is the primary purpose of a function in JavaScript? (a, b, c, or d): ",
        "2. Which of the following is a real-world example of using a JavaScript function? (a, b, c, or d): ",
        "3. How do you define a function in JavaScript? (a, b, c, or d): ",
        "4. What will this code do?\n   <button onclick=\"showMessage('Welcome to JavaScript!')\">Click Me</button>\n   <script>function showMessage(message) { alert(message); }</script>\n   (a, b, c, or d): ",
        "5. Which of the following is an example of using a function with parameters? (a, b, c, or d): ",
        "6. What does the following JavaScript function do?\n   function multiplyNumbers(a, b) { let result = a * b; alert(result); }\n   (a, b, c, or d): ",
        "7. How can you modify the function sayHello() to say \"Good morning, Grade 9 learners\"? (a, b, c, or d): ",
        "8. What type of value does a function with parameters return? (a, b, c, or d): ",
        "9. Which statement about functions is TRUE? (a, b, c, or d): ",
        "10. What is the output of the following code?\n    <button onclick=\"addTwoNumbers()\">Click Me</button>\n    <script>\n        function addTwoNumbers() { let num1 = 5; let num2 = 10; let sum = num1 + num2; alert(sum); }\n    </script>\n    (a, b, c, or d): "
    ]
    
    student_answers = []
    for q in questions:
        answer = input(q).strip()
        student_answers.append(answer)
    
    score = get_student_score(student_answers)
    recommendation = recommend_grade9(score)
    
    result = {
        "Grade": 9,
        "Score": score,
        "Recommendation": recommendation
    }
    
    # Save results to a JSON file
    with open("grade9_recommendation.json", "w") as f:
        json.dump(result, f, indent=4)
    
    # Print the final score and recommendation
    print("\n===================================")
    print("Quiz Completed!")
    print("===================================\n")
    print("Your Score: {:.2f}%".format(score))
    print("Recommendation:", recommendation)
    print("\nResults have been saved to 'grade9_recommendation.json'.\n")

if __name__ == "__main__":
    run_quiz()
