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

// Voice Guide Functionality
document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voiceGuideBtn');
    const voicePopup = document.getElementById('voiceGuidePopup');
    const closeBtn = document.getElementById('closeVoiceGuide');
    const voiceOptions = document.querySelectorAll('.voice-option');
    
    // Toggle popup visibility
    voiceBtn.addEventListener('click', function() {
      voicePopup.style.display = voicePopup.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close popup
    closeBtn.addEventListener('click', function() {
      voicePopup.style.display = 'none';
    });
    
    // Handle voice options
    voiceOptions.forEach(option => {
      option.addEventListener('click', function() {
        const command = this.getAttribute('data-command');
        handleVoiceCommand(command);
      });
    });
    
    // Voice command handler
    function handleVoiceCommand(command) {
      const speech = new SpeechSynthesisUtterance();
      speech.lang = 'en-US';
      
      switch(command) {
        case 'welcome':
          speech.text = 'Welcome to Kelotech - Code Your Future. Explore our coding courses to unlock your potential.';
          break;
        case 'courses':
          speech.text = 'We offer courses in HTML, CSS, JavaScript, and Python. Click Get Started to begin your journey.';
          break;
        case 'navigation':
          speech.text = 'Use the Get Started button to login. The Browse Courses button will show available courses.';
          break;
        case 'stop':
          window.speechSynthesis.cancel();
          return;
        default:
          speech.text = 'Command not recognized.';
      }
      
      window.speechSynthesis.speak(speech);
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', function(event) {
      if (!voicePopup.contains(event.target) && event.target !== voiceBtn) {
        voicePopup.style.display = 'none';
      }
    });
  });