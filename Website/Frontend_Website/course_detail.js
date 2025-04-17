document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      window.location.href = "login.html";
      return;
    }
  
    // Retrieve current course and enrollment from localStorage
    const course = JSON.parse(localStorage.getItem("currentCourse"));
    let enrollment = JSON.parse(localStorage.getItem("currentEnrollment"));
    if (!course || !enrollment) {
      alert("Missing course or enrollment data.");
      window.location.href = "index.html";
      return;
    }
  
    // Display course header details
    document.getElementById("courseTitle").innerText = course.title;
    document.getElementById("courseDescription").innerText = course.description || "";
  
    // Fetch detailed course data including lessons grouped by level
    const courseResponse = await fetch(`/api/courses/${course.course_id}`);
    const courseData = await courseResponse.json();
  
    // Build the lessons sidebar
    const sidebar = document.getElementById("sidebarLessons");
    sidebar.innerHTML = ""; // Clear any static content
    const levels = ["Beginner", "Intermediate", "Advanced"];
    levels.forEach(level => {
      const levelSection = document.createElement("div");
      levelSection.className = "level-section";
      levelSection.innerHTML = `<h2>${level} Lessons</h2>`;
      const lessons = (courseData.lessons && courseData.lessons[level]) ? courseData.lessons[level] : [];
      lessons.forEach(lesson => {
        // Determine if the lesson is locked: unlocked if lesson.order_number <= (enrollment.current_lesson + 1)
        const isLocked = lesson.order_number > (enrollment.current_lesson + 1);
        const lessonItem = document.createElement("div");
        lessonItem.className = "lesson-item";
        lessonItem.innerHTML = `<p>${lesson.title} ${isLocked ? "<span class='locked'>Locked</span>" : ""}</p>`;
        if (!isLocked) {
          lessonItem.addEventListener("click", async () => {
            // Update enrollment when a lesson is opened
            const updatedEnrollment = {
              current_level: lesson.level,
              current_lesson: lesson.order_number,
              quiz_marks: enrollment.quiz_marks || null,
              quiz_answers: enrollment.quiz_answers || null,
              ai_feedback: enrollment.ai_feedback || null
            };
  
            const updateResponse = await fetch(`/api/enrollments/${enrollment.enrollment_id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
              },
              body: JSON.stringify(updatedEnrollment)
            });
            if (updateResponse.ok) {
              enrollment = await updateResponse.json();
              localStorage.setItem("currentEnrollment", JSON.stringify(enrollment));
              localStorage.setItem("currentLesson", JSON.stringify(lesson));
              window.location.href = "lesson-detail.html"; // Navigate to lesson detail page
            } else {
              alert("Failed to update progress. Please try again.");
            }
          });
        }
        levelSection.appendChild(lessonItem);
      });
      sidebar.appendChild(levelSection);
    });
  
    // ----- Chat Bot Initialization (Visible only on course detail page) -----
    const chatButton = document.getElementById("chatButton");
    const chatPopup = document.getElementById("chatPopup");
    const closeChat = document.getElementById("closeChat");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-btn");
    const chatMessages = document.getElementById("chatMessages");
  
    chatButton.addEventListener("click", () => {
      chatPopup.style.display = chatPopup.style.display === "flex" ? "none" : "flex";
    });
  
    closeChat.addEventListener("click", () => {
      chatPopup.style.display = "none";
    });
  
    sendButton.addEventListener("click", async () => {
      const message = messageInput.value.trim();
      if (!message) return;
      // Append user's message
      const userMsgDiv = document.createElement("div");
      userMsgDiv.className = "message user-message";
      userMsgDiv.textContent = message;
      chatMessages.appendChild(userMsgDiv);
      messageInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
  
      // Send the message to the chatbot API
      try {
        const response = await fetch("/chat", { // Adjust endpoint if needed
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        const botMsgDiv = document.createElement("div");
        botMsgDiv.className = "message bot-message";
        botMsgDiv.textContent = data.response;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } catch (error) {
        console.error("Error sending chat message:", error);
        const errDiv = document.createElement("div");
        errDiv.className = "message bot-message";
        errDiv.textContent = "Error connecting to chatbot server.";
        chatMessages.appendChild(errDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  });
  