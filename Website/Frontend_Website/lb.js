// Add this with your other event listeners
document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});
Opt

// Global variables
let currentPeriod = 'daily';
let currentSearch = '';


// DOM elements
const leaderboardEntries = document.getElementById('leaderboard-entries');
const searchInput = document.getElementById('searchInput');

// Fetch leaderboard data
async function fetchLeaderboard() {
    try {
        leaderboardEntries.innerHTML = '<div class="loading">Loading leaderboard...</div>';
        
        const response = await fetch(`/api/users?period=${currentPeriod}&search=${encodeURIComponent(currentSearch)}`);
        const users = await response.json();
        
        if (users.length === 0) {
            leaderboardEntries.innerHTML = '<div class="no-results">No users found</div>';
            return;
        }
        
        renderLeaderboard(users);
    } catch (error) {
        leaderboardEntries.innerHTML = `<div class="error">Error loading leaderboard: ${error.message}</div>`;
        console.error('Error:', error);
    }
}

// Render leaderboard
function renderLeaderboard(users) {
    leaderboardEntries.innerHTML = '';
    
    users.forEach((user, index) => {
        const row = document.createElement('div');
        row.className = `leaderboard-row ${index < 3 ? 'top-three' : ''} ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}`;
        
        row.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="user">
                <div class="avatar" style="background-color: ${getAvatarColor(user.name)}">${getInitials(user.name)}</div>
                <div>${user.name}</div>
            </div>
            <div class="score">${user.score.toLocaleString()}</div>
            <div class="badges">
                ${user.badges ? user.badges.map(badge => `<span class="badge">${badge}</span>`).join('') : ''}
            </div>
        `;
        
        leaderboardEntries.appendChild(row);
    });
}

// Helper functions
function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

function getAvatarColor(name) {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
}

// Event listeners
document.querySelectorAll('.time-period button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('.time-period button.active').classList.remove('active');
        this.classList.add('active');
        currentPeriod = this.dataset.period;
        fetchLeaderboard();
    });
});

searchInput.addEventListener('input', function() {
    currentSearch = this.value;
    fetchLeaderboard();
});

// Initial load
fetchLeaderboard();