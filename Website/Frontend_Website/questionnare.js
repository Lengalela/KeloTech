document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementsByClassName('qsubmit-btn');
    
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Button clicked - redirecting...'); // Debug check
        window.location.href = "recommends.html";
      });
    } else {
      console.error('Could not find element with id "qsubmit-btn"');
    }
  });