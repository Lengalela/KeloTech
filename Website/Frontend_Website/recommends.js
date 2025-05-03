// Sample data - in a real app this would come from your bot/backend
const suggestedLanguages = [
    { code: 'Js', name: 'JavaScript'},
    { code: 'Ja', name: 'Java'},
    { code: 'CSS', name: 'CSS'},
    { code: 'html', name: 'HTML'}
];

// Track subscribed languages
const subscribedLanguages = new Set();

// Render language cards
const container = document.getElementById('languageContainer');

suggestedLanguages.forEach(lang => {
    const card = document.createElement('div');
    card.className = 'language-card';
    card.innerHTML = `
        <div class="language-name">${lang.name}</div>
        <button class="subscribe-btn" data-lang="${lang.code}">Subscribe</button>
    `;
    container.appendChild(card);
});

// Function to get recommendation from backend (Flask)
async function fetchRecommendation() {
    const data = {
        answers: [
            { question: 1, answer: "yes" },
            { question: 2, answer: "no" },
            { question: 3, answer: "yes" },
            { question: 4, answer: "yes" },
            { question: 5, answer: "no" },
            { question: 6, answer: "yes" }
        ]
    };

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const recommendationText = result.response || 'We recommend exploring some courses based on your interests!';
        
        // Display recommendation text
        document.getElementById('recommendationText').innerText = '🎓 ' + recommendationText;
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        document.getElementById('recommendationText').innerText = 'Sorry, something went wrong!';
    }
}

// Fetch recommendation when page loads
fetchRecommendation();

// Handle subscribe button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('subscribe-btn')) {
        const langCode = e.target.getAttribute('data-lang');
        
        if (subscribedLanguages.has(langCode)) {
            // Unsubscribe
            subscribedLanguages.delete(langCode);
            e.target.textContent = 'Subscribe';
            e.target.classList.remove('subscribed');
        } else {
            // Subscribe
            subscribedLanguages.add(langCode);
            e.target.textContent = 'Subscribed';
            e.target.classList.add('subscribed');
        }
    }
    
    // Close button
    if (e.target.classList.contains('close-btn')) {
        alert('Dialog closed. Selected languages: ' + Array.from(subscribedLanguages).join(', '));
        // In a real app, you might hide the dialog here
    }
    
    // Confirm button
    if (e.target.classList.contains('confirm-btn')) {
        if (subscribedLanguages.size === 0) {
            alert('Please select at least one language to subscribe to.');
        } else {
            alert('Successfully subscribed to: ' + Array.from(subscribedLanguages).join(', '));
            // In a real app, you would send this data to your server
        }
    }
});
