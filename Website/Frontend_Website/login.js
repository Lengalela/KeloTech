document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupBtn = document.getElementById("signupBtn");
  const responseDiv = document.getElementById("loginResponse");

  // Redirect to signup page if needed
  signupBtn.addEventListener("click", () => {
    window.location.href = "signup.html"; 
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/learners/login", {  // Relative URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error from server or invalid login
        responseDiv.innerText = `Login failed: ${data.error || "Unknown error"}`;
        return;
      }

      // On successful login, store JWT and redirect
      localStorage.setItem("jwt", data.token);
      responseDiv.innerText = "Login success! Redirecting...";
      window.location.href = "index.html";
    } catch (err) {
      // Handle network or other errors
      responseDiv.innerText = `Fetch error: ${err.message}`;
    }
  });
});
