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

    const colors = ['#ff5e57', '#ffdd59', '#0be881', '#4bcffa', '#3c40c6', '#f53b57', '#ffa801', '#0fb9b1', '#575fcf', '#ef5777'];

    // Animate Name: Rahul Kumar
    if (nameContainer) {
      const name = "Rahul Kumar";
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
            span.style.display = 'inline-block';
            span.style.animation = 'fadeInChar 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
          }
          nameContainer.appendChild(span);
          nameCharIndex++;
          setTimeout(typeName, 100); // Faster name typing for wave effect
        }
      };
      setTimeout(typeName, 500);
    }

    // ----------------------------------------------------
    // Universal "Smooth Wave" Typing for All Headings
    // ----------------------------------------------------
    const typingHeadings = document.querySelectorAll('.typing-heading');
    if (typingHeadings.length > 0) {
      const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const textToType = el.getAttribute('data-text');
            if (!textToType || el.classList.contains('typing-started')) return;
            
            el.classList.add('typing-started');
            el.innerHTML = ''; // clear initially
            el.style.minHeight = '1.2em';
            
            let charIdx = 0;
            const typeHeading = () => {
              if (charIdx < textToType.length) {
                const char = textToType[charIdx];
                const span = document.createElement('span');
                span.textContent = char;
                if (char !== ' ') {
                  const color = colors[charIdx % colors.length];
                  span.style.color = color;
                  span.style.opacity = '0';
                  span.style.display = 'inline-block';
                  span.style.animation = 'fadeInChar 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
                }
                el.appendChild(span);
                charIdx++;
                setTimeout(typeHeading, 60); // Smooth wave typing speed
              }
            };
            setTimeout(typeHeading, 200); // delay before starting
            headingObserver.unobserve(el); // Only play once
          }
        });
      }, { threshold: 0.5 });
      
      typingHeadings.forEach(heading => {
        headingObserver.observe(heading);
      });
    }

    // Add keyframes dynamically if not present
    if (!document.getElementById('typing-keyframes')) {
      const style = document.createElement('style');
      style.id = 'typing-keyframes';
      style.innerHTML = `@keyframes fadeInChar { 0% { opacity: 0; transform: translateY(10px) scale(0.9); filter: blur(10px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); } }`;
      document.head.appendChild(style);
    }
  };

  document.addEventListener('DOMContentLoaded', initTypingAnimation);
})();
