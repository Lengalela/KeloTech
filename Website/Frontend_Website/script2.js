// Dropdown functionality
(function() {
  var dropdown = document.getElementsByClassName("dropdown-btn");
  var i;

  for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
          this.classList.toggle("actived");
          var dropdownContent = this.nextElementSibling;
          if (dropdownContent.style.display === "block") {
              dropdownContent.style.display = "none";
          } else {
              dropdownContent.style.display = "block";
          }
      });
  }
})();

// Page navigation functionality
(function() {
  function showPage(pageId) {
      // Hide all pages
      document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));

      // Show the selected page
      document.getElementById(pageId).classList.add("active");
  }

  // Make showPage available globally if needed
  window.showPage = showPage;
})();

// Chat bot functions
(function() {
    // Get DOM elements
    const chatButton = document.getElementById('chatButton');
    const chatPopup = document.getElementById('chatPopup');
    const closeChat = document.getElementById('closeChat');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chatMessages');

    // Only initialize if chat elements exist
    if (chatButton && chatPopup) {
        // Toggle chat popup
        chatButton.addEventListener('click', () => {
            chatPopup.style.display = chatPopup.style.display === 'flex' ? 'none' : 'flex';
        });

        // Close chat popup
        closeChat.addEventListener('click', () => {
            chatPopup.style.display = 'none';
        });

        // Send message function
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                // Add user message to chat
                const userMessage = document.createElement('div');
                userMessage.className = 'message user-message';
                userMessage.textContent = message;
                chatMessages.appendChild(userMessage);

                // Clear input
                messageInput.value = '';

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Ensure the chat popup is still visible
                chatPopup.style.display = 'flex';

                // Send the message to the backend (Python server)
                try {
                    const response = await fetch('http://localhost:8000/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: message })
                    });

                    const data = await response.json();
                    const botReply = data.response;

                    // Add bot message to chat
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot-message';
                    botMessage.textContent = botReply;
                    chatMessages.appendChild(botMessage);

                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                } catch (error) {
                    console.error('Error:', error);
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'message bot-message';
                    errorMessage.textContent = 'Error connecting to chatbot server.';
                    chatMessages.appendChild(errorMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        }

        // Send message on button click
        sendButton.addEventListener('click', sendMessage);

        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
})();
async function loadLessonFromDatabase(lessonId) {
    const response = await fetch(`http://localhost:5001/api/lessons/${lessonId}`);
    const lesson = await response.json();
  
    document.getElementById("lessonTitle").innerHTML = `<h2>${lesson.title}</h2>`;
  
    // Objectives
    const objectivesHTML = lesson.content.objectives.map(item => `<li>${item}</li>`).join("");
    document.getElementById("lessonObjectives").innerHTML = `<h3>Objectives</h3><ul>${objectivesHTML}</ul>`;
  
    // Explanation
    const explanationHTML = lesson.content.explanation.map(p => `<p>${p}</p>`).join("");
    document.getElementById("lessonExplanation").innerHTML = `<h3>Explanation</h3>${explanationHTML}`;
  
    // Example code
    document.getElementById("lessonExampleCode").innerHTML = `
      <h3>${lesson.content.exampleCode.title}</h3>
      <pre><code>${lesson.content.exampleCode.code}</code></pre>
    `;
  
    // Exercises
    const exercisesHTML = lesson.content.exercises.map(ex => `
      <h4>${ex.title}</h4>
      <p>${ex.description}</p>
      <pre><code>${ex.code}</code></pre>
    `).join("");
    document.getElementById("lessonExercises").innerHTML = `<h3>Exercises</h3>${exercisesHTML}`;
  
    // Summary
    const summaryHTML = lesson.content.summary.map(s => `<li>${s}</li>`).join("");
    document.getElementById("lessonSummary").innerHTML = `<h3>Summary</h3><ul>${summaryHTML}</ul>`;
  
    // Quiz
    const quizHTML = lesson.content.quiz.map((q, i) => `
      <div>
        <h4>Q${i + 1}: ${q.question}</h4>
        ${q.options.map(opt => `<p>${opt}</p>`).join("")}
      </div>
    `).join("");
    document.getElementById("lessonQuiz").innerHTML = `<h3>Quiz</h3>${quizHTML}`;
  }
  