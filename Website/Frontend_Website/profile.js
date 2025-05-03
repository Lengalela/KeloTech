// DOM Elements
const editToggle = document.getElementById('editToggle');
const editForm = document.getElementById('editForm');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Profile display elements
const userName = document.getElementById('userName');
const userTitle = document.getElementById('userTitle');
const userBio = document.getElementById('userBio');
const profilePic = document.getElementById('profilePic');

// Badge counters
const goldCount = document.getElementById('goldCount');
const silverCount = document.getElementById('silverCount');
const bronzeCount = document.getElementById('bronzeCount');

// Form input elements
const editName = document.getElementById('editName');
const editTitle = document.getElementById('editTitle');
const editBio = document.getElementById('editBio');
const editPic = document.getElementById('editPic');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const imagePreview = document.getElementById('imagePreview');

// Track if a file was selected
let selectedFile = null;

// Toggle edit form
editToggle.addEventListener('click', () => {
    editForm.classList.toggle('hidden');
});

cancelBtn.addEventListener('click', () => {
    editForm.classList.add('hidden');
    // Reset file selection
    fileInput.value = '';
    fileName.textContent = 'No file chosen';
    imagePreview.style.display = 'none';
    selectedFile = null;
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        fileName.textContent = selectedFile.name;
        
        // Clear URL input when file is selected
        editPic.value = '';
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(selectedFile);
    } else {
        fileName.textContent = 'No file chosen';
        imagePreview.style.display = 'none';
        selectedFile = null;
    }
});

// Handle URL input change
editPic.addEventListener('input', () => {
    if (editPic.value) {
        // Clear file selection when URL is entered
        fileInput.value = '';
        fileName.textContent = 'No file chosen';
        selectedFile = null;
        imagePreview.style.display = 'none';
    }
});

// Save profile changes
saveBtn.addEventListener('click', () => {
    userName.textContent = editName.value;
    userTitle.textContent = editTitle.value;
    userBio.textContent = editBio.value;
    
    // Handle profile picture update
    if (selectedFile) {
        // In a real app, you would upload the file to a server
        // For this demo, we'll use the local file URL
        const reader = new FileReader();
        reader.onload = (event) => {
            profilePic.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    } else if (editPic.value) {
        profilePic.src = editPic.value;
    }
    
    editForm.classList.add('hidden');
    
    // Reset file selection
    fileInput.value = '';
    fileName.textContent = 'No file chosen';
    imagePreview.style.display = 'none';
    selectedFile = null;
    
    // In a real app, you would save to a server here
    // For demo, we'll just update the badge counts randomly
    updateBadges();
});

// Function to update badge counts (simulating progress)
function updateBadges() {
    // In a real app, these would come from a server/database
    goldCount.textContent = Math.floor(Math.random() * 10) + 1;
    silverCount.textContent = Math.floor(Math.random() * 20) + 5;
    bronzeCount.textContent = Math.floor(Math.random() * 30) + 10;
}

// Initialize with some random badge counts
updateBadges();