document.addEventListener('DOMContentLoaded', async () => {
    // 0) Auth & sidebar profile
    const token = localStorage.getItem('jwt');
    if (!token) {
      return window.location.href = 'login.html';
    }
  
    // Fetch profile for sidebar
    try {
      const profileRes = await fetch('/api/learners/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const { learner } = await profileRes.json();
        document.getElementById('usernameDisplay').innerText = learner.username;
        const enroll = JSON.parse(localStorage.getItem('currentEnrollment') || '{}');
        if (enroll.current_level) {
          document.querySelector('#learnerLevel b').innerText = enroll.current_level;
        }
      }
    } catch (e) {
      console.warn('Profile load failed', e);
    }
  
    // Sidebar buttons
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('jwt');
      window.location.href = 'login.html';
    });
    document.getElementById('backButton').addEventListener('click', () => {
      window.history.back();
    });
  
    // 1) DOM refs & state
    const container   = document.getElementById('leaderboard-entries');
    const searchInput = document.getElementById('searchInput');
    let allUsers = [];
  
    // 2) Helper: avatar color
    function avatarColor(name) {
      let hash = 0;
      for (let c of name) hash = (hash << 5) - hash + c.charCodeAt(0);
      const colors = [
        '#f44336','#e91e63','#9c27b0',
        '#3f51b5','#2196f3','#009688',
        '#4caf50','#ff9800','#795548'
      ];
      return colors[Math.abs(hash) % colors.length];
    }
  
    // 3) Render function
    function render(list) {
      container.innerHTML = '';
      if (list.length === 0) {
        container.innerHTML = '<div class="loading">No users found.</div>';
        return;
      }
      list.forEach((u, idx) => {
        const row = document.createElement('div');
        row.className = 
          'leaderboard-entry ' +
          (idx===0?'first ':idx===1?'second ':idx===2?'third ':'');
        row.innerHTML = `
          <div class="rank">#${idx+1}</div>
          <div class="user">
            <div class="avatar" style="background:${avatarColor(u.username)}">
              ${u.username.charAt(0).toUpperCase()}
            </div>
            ${u.username}
          </div>
          <div class="score">${u.total_score}</div>
          <div class="badges">
            <span class="badge">🥇 ${u.gold_count}</span>
            <span class="badge">🥈 ${u.silver_count}</span>
            <span class="badge">🥉 ${u.bronze_count}</span>
          </div>
        `;
        container.appendChild(row);
      });
    }
  
    // 4) Load from API
    async function load() {
      container.innerHTML = '<div class="loading">Loading leaderboard…</div>';
      try {
        const res = await fetch('/api/leaderboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const list = await res.json();
        allUsers = list;
        render(allUsers);
      } catch (err) {
        container.innerHTML = '<div class="error">Failed to load leaderboard.</div>';
        console.error(err);
      }
    }
  
    // 5) Search filter
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.trim().toLowerCase();
      render(allUsers.filter(u => u.username.toLowerCase().includes(term)));
    });
  
    // 6) Initial fetch
    load();
  });
  