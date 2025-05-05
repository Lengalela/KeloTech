// DOM Elements
const editToggle = document.getElementById('editToggle');
const editForm = document.getElementById('editForm');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Profile display elements
const userName = document.getElementById('userName');
const userTitle = document.getElementById('userTitle');
const userBio = document.getElementById('userBio');
const userEmail = document.getElementById('userEmail');
const userSchool = document.getElementById('userSchool');
const userSince = document.getElementById('userSince');
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

// Load learner data from new simple profile endpoint
window.addEventListener('DOMContentLoaded', async () => {
    console.log("📦 DOM loaded, starting profile fetch...");

    try {
    const res = await fetch(`${window.location.origin}/api/learners/profile-simple`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    console.log("📡 Fetch response status:", res.status);
const text = await res.text();

console.log("🧾 Raw response text:", text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  console.error("❌ Failed to parse JSON:", e.message);
  return;
}

if (!res.ok) {
  console.error("🚫 Server responded with error:", data.error || text);
  return;
}

console.log("✅ Parsed profile data:", data);


    userName.textContent = data.first_name + ' ' + data.last_name;
    userTitle.textContent = 'Learner';
    userBio.textContent = 'No bio yet';
    userEmail.textContent = data.email;
    userSchool.textContent = data.school;
    userSince.textContent = new Date(data.created_at).toLocaleDateString();

    profilePic.src = 'icons/image.png';

    // Form values
    editName.value = userName.textContent;
    editTitle.value = '';
    editBio.value = '';
    editPic.value = '';

    // No marks in simple profile — skip badges or simulate
    calculateBadges({ lesson1: 95, lesson2: 86, lesson3: 72 }); // mock marks for now
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
});

// Badge calculator
function calculateBadges(marks) {
  let gold = 0, silver = 0, bronze = 0;
  const scores = Object.values(marks);
  scores.forEach(score => {
    if (score >= 90) gold++;
    else if (score >= 80) silver++;
    else if (score >= 70) bronze++;
  });

  goldCount.textContent = gold;
  silverCount.textContent = silver;
  bronzeCount.textContent = bronze;
}

// UI handlers
editToggle.addEventListener('click', () => {
  editForm.classList.toggle('hidden');
});

cancelBtn.addEventListener('click', () => {
  editForm.classList.add('hidden');
  fileInput.value = '';
  fileName.textContent = 'No file chosen';
  imagePreview.style.display = 'none';
  selectedFile = null;
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    selectedFile = e.target.files[0];
    fileName.textContent = selectedFile.name;
    editPic.value = '';

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

editPic.addEventListener('input', () => {
  if (editPic.value) {
    fileInput.value = '';
    fileName.textContent = 'No file chosen';
    selectedFile = null;
    imagePreview.style.display = 'none';
  }
});

saveBtn.addEventListener('click', async () => {
  const updated = {
    title: editTitle.value,
    bio: editBio.value,
    profile_pic: selectedFile ? null : editPic.value,
  };

  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      updated.profile_pic = e.target.result;
      await updateProfile(updated);
    };
    reader.readAsDataURL(selectedFile);
  } else {
    await updateProfile(updated);
  }
});

async function updateProfile(data) {
  try {
    const res = await fetch('/api/learners/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw await res.text();
    window.location.reload();
  } catch (err) {
    console.error('Failed to update profile:', err);
  }
}
