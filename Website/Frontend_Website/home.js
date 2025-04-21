// Add click event to buttons
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Pulse animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Only prevent default if it's a # link
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        }
        // For actual pages, the default behavior will proceed
    });
});

// Card click handler
document.querySelectorAll('.tech-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add active class
        this.classList.toggle('active');
        
        // In a real app, you might show more details
        console.log(`Selected: ${this.querySelector('.tech-title').textContent}`);
    });
});

// Scroll animation
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const cards = document.querySelectorAll('.tech-card');
    
    cards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top;
        if (cardPosition < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Trigger initial scroll check
window.dispatchEvent(new Event('scroll'));