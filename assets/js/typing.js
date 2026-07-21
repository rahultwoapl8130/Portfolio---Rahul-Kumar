'use strict';

(function () {
  const initTypingAnimation = () => {
    const nameContainer = window.qs('#hero-typing-name-container');
    const oldRoleText = window.qs('#typing-text');
    
    // Animate Roles
    if (oldRoleText) {
      const roles = ['Data Scientist', 'Machine Learning Engineer', 'Business Analyst', 'Data Analyst'];
      const typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000;
      let roleIndex = 0, charIndex = 0, isDeleting = false;
      const tick = () => {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
          charIndex--;
          oldRoleText.textContent = currentRole.substring(0, charIndex);
        } else {
          charIndex++;
          oldRoleText.textContent = currentRole.substring(0, charIndex);
        }
        let delay = isDeleting ? deleteSpeed : typeSpeed;
        if (!isDeleting && charIndex === currentRole.length) {
          delay = pauseTime;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 400;
        }
        setTimeout(tick, delay);
      };
      tick();
    }

    // Animate Name: Rahul Kumar
    if (nameContainer) {
      const name = "Rahul Kumar";
      const colors = ['#ff5e57', '#ffdd59', '#0be881', '#4bcffa', '#3c40c6', '#f53b57', '#ffa801', '#0fb9b1', '#575fcf', '#ef5777'];
      let nameCharIndex = 0;
      nameContainer.innerHTML = ''; // clear initially

      const typeName = () => {
        if (nameCharIndex < name.length) {
          const char = name[nameCharIndex];
          const span = document.createElement('span');
          span.textContent = char;
          if (char !== ' ') {
            // Apply a random or sequential color
            const color = colors[nameCharIndex % colors.length];
            span.style.color = color;
            span.style.opacity = '0';
            span.style.animation = 'fadeInChar 0.1s forwards';
          }
          nameContainer.appendChild(span);
          nameCharIndex++;
          setTimeout(typeName, 150); // Typing speed for name
        }
      };
      // Add keyframes dynamically if not present
      if (!document.getElementById('typing-keyframes')) {
        const style = document.createElement('style');
        style.id = 'typing-keyframes';
        style.innerHTML = `@keyframes fadeInChar { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`;
        document.head.appendChild(style);
      }
      setTimeout(typeName, 500);
    }
  };

  document.addEventListener('DOMContentLoaded', initTypingAnimation);
})();
