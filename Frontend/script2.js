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

  // // Get the level from the URL query string
  // const urlParams = new URLSearchParams(window.location.search);
  // const level = urlParams.get('level');

  // // Display the level
  // document.querySelector('.level1 h1').textContent = `Grade ${level} - JavaScript`;

//Chat bot functions
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
      function sendMessage() {
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
              
              // Simulate bot response after a short delay
              setTimeout(() => {
                  const botMessage = document.createElement('div');
                  botMessage.className = 'message bot-message';
                  botMessage.textContent = getBotResponse(message);
                  chatMessages.appendChild(botMessage);
                  chatMessages.scrollTop = chatMessages.scrollHeight;
              }, 500);
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

      // Simple bot response logic
      // function getBotResponse(userMessage) {
      //     const lowerMsg = userMessage.toLowerCase();
          
      //     if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      //         return "Hi there! How can I assist you?";
      //     } else if (lowerMsg.includes('help')) {
      //         return "I'm here to help! What do you need assistance with?";
      //     } else if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) {
      //         return "You're welcome! Is there anything else I can help with?";
      //     } else {
      //         return "I understand. Our team will get back to you soon if you need further assistance.";
      //     }
      // }
  }
})();

(async function sendMessage() {
  let userInput = document.getElementById("user-input").value;
  if (!userInput) return; // Don't send empty messages
  
  let chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><b>You:</b> ${userInput}</p>`; // Display user message

  try {
      let response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userInput })
      });

      let data = await response.json();
      chatBox.innerHTML += `<p><b>Bot:</b> ${data.response}</p>`; // Display bot response
  } catch (error) {
      chatBox.innerHTML += `<p style="color:red;"><b>Error:</b> Could not connect to chatbot.</p>`;
      console.error("Chatbot error:", error);
  }

  document.getElementById("user-input").value = ""; // Clear input box
})();