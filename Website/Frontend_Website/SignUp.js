document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const signupResponse = document.getElementById("signupResponse");
  const loginRedirectBtn = document.getElementById("loginRedirectBtn");

  // Redirect to login page if the user clicks the login button
  loginRedirectBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // Handle sign-up form submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form input values
    const first_name = document.getElementById("firstName").value.trim();
    const last_name = document.getElementById("lastName").value.trim();
    const school = document.getElementById("school").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Check for matching passwords on the client side
    if (password !== confirmPassword) {
      signupResponse.textContent = "Passwords do not match!";
      return;
    }

    try {
      // Call the registration endpoint using a relative URL
      const response = await fetch("/api/learners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          school,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        signupResponse.textContent = data.error
          ? `Sign Up failed: ${data.error}`
          : "Sign Up failed: Unknown error.";
        return;
      }

      signupResponse.textContent =
        data.message || "Sign Up successful! Logging you in...";

      // Automatically log the user in after successful signup
      const loginResponse = await fetch("/api/learners/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        signupResponse.textContent = loginData.error
          ? `Login failed: ${loginData.error}`
          : "Login failed: Unknown error.";
        return;
      }

      // Store the received JWT in localStorage and redirect to main page
      localStorage.setItem("jwt", loginData.token);
      window.location.href = "index.html";
    } catch (err) {
      signupResponse.textContent = "Error: Could not connect to server.";
      console.error("Network error:", err);
    }
  });
});
