import json

# Answer key for Grade 10 Lesson 1: Working with Arrays and Objects Quiz
# Answers:
# 1. c) A collection of ordered values
# 2. a) array[0]
# 3. b) A collection of key-value pairs
# 4. a) push()
# 5. b) blue
# 6. d) All of the above
# 7. c) Arrays can store values of different data types
# 8. b) Adds an element to the end of the array
# 9. c) Both a and b
# 10. a) Charlie
answer_key = ['c', 'a', 'b', 'a', 'b', 'd', 'c', 'b', 'c', 'a']

def get_student_score(student_answers):
    """Calculate the score percentage based on the student's answers."""
    correct = sum(1 for answer, key in zip(student_answers, answer_key) if answer.lower() == key)
    return (correct / len(answer_key)) * 100

def recommend_grade10(score):
    """Return a recommendation based on the student's score for Grade 10."""
    if score >= 70:
        return "Excellent! You have a solid understanding of arrays and objects. You can move on to more advanced topics."
    elif 50 <= score < 70:
        return "Good effort. We recommend reviewing the lesson and practicing more exercises on arrays and objects."
    else:
        return "It looks like you need additional support. We suggest a remedial session focusing on the basics of arrays and objects."

def run_quiz():
    # Print introductory header and instructions
    print("\n===================================")
    print("Grade 10 Lesson 1: Arrays and Objects Quiz")
    print("===================================\n")
    print("Answer each question by typing a, b, c, or d.\n")
    
    # List of quiz questions for Grade 10
    questions = [
        "1. What is an array in JavaScript? (a, b, c, or d): ",
        "2. How do you access the first element in an array? (a, b, c, or d): ",
        "3. What is an object in JavaScript? (a, b, c, or d): ",
        "4. Which method is used to add an item to the end of an array? (a, b, c, or d): ",
        "5. What will the following code display?\n   let car = { make: 'Tesla', model: 'Model 3', year: 2021 };\n   car.color = 'blue';\n   console.log(car.color);\n   (a, b, c, or d): ",
        "6. How can you loop through an array of objects to display each object's property in JavaScript? (a, b, c, or d): ",
        "7. Which of the following is true about arrays in JavaScript? (a, b, c, or d): ",
        "8. What does the push() method do when applied to an array? (a, b, c, or d): ",
        "9. How do you access a property of an object in JavaScript? (a, b, c, or d): ",
        "10. Given the code:\n    let students = [\n       { name: 'Alice', age: 17 },\n       { name: 'Bob', age: 18 }\n    ];\n    students.push({ name: 'Charlie', age: 16 });\n    console.log(students[2].name);\n    (a, b, c, or d): "
    ]
    
    student_answers = []
    for q in questions:
        answer = input(q).strip()
        student_answers.append(answer)
    
    score = get_student_score(student_answers)
    recommendation = recommend_grade10(score)
    
    result = {
        "Grade": 10,
        "Score": score,
        "Recommendation": recommendation
    }
    
    with open("grade10_recommendation.json", "w") as f:
        json.dump(result, f, indent=4)
    
    # Final output with clear formatting
    print("\n===================================")
    print("Quiz Completed!")
    print("===================================\n")
    print("Your Score: {:.2f}%".format(score))
    print("Recommendation:", recommendation)
    print("\nResults have been saved to 'grade10_recommendation.json'.\n")

if __name__ == "__main__":
    run_quiz()
