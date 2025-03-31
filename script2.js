//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict 
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

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));

    // Show the selected page
    document.getElementById(pageId).classList.add("active");
}

// Get the level from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level');

// Display the level
document.querySelector('.level1 h1').textContent = `Grade ${level} - JavaScript`;