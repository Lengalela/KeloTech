document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupBtn = document.getElementById("signupBtn");
    const responseDiv = document.getElementById("loginResponse");
  
    // If you have a separate signup.html, link it here:
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html"; 
    });
  
    // Handle the form submission
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // stop normal form post
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("http://localhost:5001/api/learners/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // Error from server or invalid login
          responseDiv.innerText = `Login failed: ${data.error || "Unknown error"}`;
          return;
        }
  
        // Login success: store JWT
        localStorage.setItem("jwt", data.token);
        responseDiv.innerText = "Login success! Redirecting...";
  
        // Redirect to index.html
        window.location.href = "index.html";
      } catch (err) {
        // Network or other error
        responseDiv.innerText = `Fetch error: ${err.message}`;
      }
    });
  });
  