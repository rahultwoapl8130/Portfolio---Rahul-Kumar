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

    const colors = ['#ffffff', '#c026d3', '#a29bfe'];

    // Animate Name: RAHUL KUMAR
    if (nameContainer) {
      const name = "RAHUL KUMAR";
      let nameCharIndex = 0;
      nameContainer.innerHTML = ''; // clear initially

      const typeName = () => {
        if (nameCharIndex < name.length) {
          const char = name[nameCharIndex];
          const span = document.createElement('span');
          span.textContent = char;
          if (char !== ' ') {
            // First half white, second half purple
            const words = name.split(' ');
            const midPoint = Math.ceil(words.length / 2);
            let currentWordIdx = name.substring(0, nameCharIndex).split(' ').length - 1;
            const color = currentWordIdx < midPoint ? '#ffffff' : 'var(--accent-primary)';
            span.style.color = color;
            span.style.opacity = '0';
            span.style.transition = 'opacity 0.2s ease-in, transform 0.2s ease-out';
            span.style.transform = 'translateY(5px)';
            span.style.display = 'inline-block';
            
            // Force browser reflow and trigger transition
            setTimeout(() => {
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            }, 10);
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
            const words = textToType.split(' ');
            const midPoint = Math.ceil(words.length / 2);
            
            const typeHeading = () => {
              if (charIdx < textToType.length) {
                const char = textToType[charIdx];
                const span = document.createElement('span');
                span.textContent = char;
                if (char !== ' ') {
                  let currentWordIdx = textToType.substring(0, charIdx).split(' ').length - 1;
                  const color = currentWordIdx < midPoint ? '#ffffff' : 'var(--accent-primary)';
                  span.style.color = color;
                  span.style.opacity = '0';
                  span.style.transition = 'opacity 0.2s ease-in, transform 0.2s ease-out';
                  span.style.transform = 'translateY(5px)';
                  span.style.display = 'inline-block';
                  
                  // Force browser reflow and trigger transition
                  setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                  }, 10);
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

  };

  document.addEventListener('DOMContentLoaded', initTypingAnimation);
})();
