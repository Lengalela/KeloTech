//Index File
// JavaScript to show and hide the pop-up dialog
var popupDialog = document.getElementById("popup-dialog");
var submitBtn = document.getElementById("submit-btn");
var cancelBtn = document.getElementById("cancel-btn");

// Show the pop-up dialog
function showPopup() {
  popupDialog.style.display = "block";
}

// Hide the pop-up dialog
function hidePopup() {
  popupDialog.style.display = "none";
}

// Add event listeners to the buttons
submitBtn.addEventListener("click", function() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  console.log("Name: " + name + ", Email: " + email);
  hidePopup();
});

cancelBtn.addEventListener("click", function() {
  hidePopup();
});

// Show the pop-up dialog when the page loads
window.onload = function() {
  showPopup();
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Check localStorage for JWT
  const token = localStorage.getItem("jwt");
  if (!token) {
    // No token => user not logged in; force them to login
    window.location.href = "login.html";
    return;
  }

  // 2) (Optional) verify the token with server or decode it client-side
  // Example of calling a "profile" endpoint:
  // fetch("http://localhost:5000/api/learners/profile", {
  //   method: "GET",
  //   headers: { Authorization: `Bearer ${token}` }
  // })
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log("Profile data:", data);
  //     // If the token was invalid, the server might return 403 => handle that
  //   })
  //   .catch(err => console.error(err));

  console.log("Token found, user is logged in:", token);

  // The rest of your index logic goes here if needed:
  // ...
});