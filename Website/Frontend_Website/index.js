document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // If no token is found, redirect to the login page
      window.location.href = "login.html";
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/learners/profile", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      if (!response.ok) {
        // If the token is invalid or expired, redirect to login
        window.location.href = "login.html";
        return;
      }
      const data = await response.json();
      const usernameDisplay = document.getElementById("usernameDisplay");
      usernameDisplay.innerText = data.learner.username;
    } catch (err) {
      console.error("Error retrieving profile", err);
    }
  });
  