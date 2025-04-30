// learning-effects.js

function showAnimatedMessage(message) {
    const animations = [popupSlide, popupFade, popupGrow, popupBounce, popupFlash];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    randomAnimation(message);
  }
  
  function popupSlide(message) {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '-300px';
    popup.style.background = '#4facfe';
    popup.style.color = '#fff';
    popup.style.padding = '15px 25px';
    popup.style.borderRadius = '8px';
    popup.style.fontSize = '18px';
    popup.style.zIndex = '9999';
    popup.style.transition = 'left 0.5s ease-out';
    document.body.appendChild(popup);
    setTimeout(() => popup.style.left = '50%', 10);
    setTimeout(() => {
      popup.style.left = '-300px';
      setTimeout(() => popup.remove(), 500);
    }, 3000);
  }
  
  function popupFade(message) {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '40px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#ff9a9e';
    popup.style.color = '#fff';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.fontSize = '18px';
    popup.style.opacity = '1';
    popup.style.transition = 'opacity 0.5s ease-out';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.opacity = '0';
      setTimeout(() => popup.remove(), 500);
    }, 3000);
  }
  
  function popupGrow(message) {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.background = '#43e97b';
    popup.style.color = '#fff';
    popup.style.padding = '15px 30px';
    popup.style.borderRadius = '30px';
    popup.style.fontSize = '16px';
    popup.style.transform = 'scale(0)';
    popup.style.transition = 'transform 0.5s ease-out';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => popup.style.transform = 'scale(1)', 50);
    setTimeout(() => {
      popup.style.transform = 'scale(0)';
      setTimeout(() => popup.remove(), 500);
    }, 3000);
  }
  
  function popupBounce(message) {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%) scale(0)';
    popup.style.background = '#fbc2eb';
    popup.style.color = '#000';
    popup.style.padding = '20px';
    popup.style.borderRadius = '50%';
    popup.style.fontSize = '20px';
    popup.style.transition = 'transform 0.5s ease';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => popup.style.transform = 'translate(-50%, -50%) scale(1.2)', 50);
    setTimeout(() => {
      popup.style.transform = 'translate(-50%, -50%) scale(0)';
      setTimeout(() => popup.remove(), 500);
    }, 3000);
  }
  
  function popupFlash(message) {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '10%';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = '#ffe53b';
    popup.style.color = '#000';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.fontSize = '18px';
    popup.style.animation = 'flash 0.5s alternate infinite';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
  }
  
  // You can also add keyframe animations if you want flash/bounce etc using CSS
  