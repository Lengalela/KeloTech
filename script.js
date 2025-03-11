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