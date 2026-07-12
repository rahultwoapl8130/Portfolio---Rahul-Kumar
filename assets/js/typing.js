'use strict';

(function () {
  const initTypingAnimation = () => {
    const el = window.qs('#typing-text');
    if (!el) return;

    const roles = [
      'AI Solutions Architect',
      'Senior Data Scientist',
      'Machine Learning Engineer',
      'Enterprise BI Architect'
    ];

    const typeSpeed = 100;   // ms per character
    const deleteSpeed = 50;  // ms per character
    const pauseTime = 2000;  // ms pause after full word typed

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = currentRole.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = currentRole.substring(0, charIndex);
      }

      let delay = isDeleting ? deleteSpeed : typeSpeed;

      // Finished typing the full word
      if (!isDeleting && charIndex === currentRole.length) {
        delay = pauseTime;
        isDeleting = true;
      }

      // Finished deleting – move to next role
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400; // short pause before typing next word
      }

      setTimeout(tick, delay);
    };

    tick();
  };

  document.addEventListener('DOMContentLoaded', initTypingAnimation);
})();
