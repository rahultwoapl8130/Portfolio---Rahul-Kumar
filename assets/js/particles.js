'use strict';

(function () {
  const initMouseTrail = () => {
    // Only on desktop
    if (window.isTouchDevice() || window.isMobile()) return;

    const MAX_PARTICLES = 50;
    let particles = [];

    const createParticle = (x, y) => {
      if (particles.length >= MAX_PARTICLES) return;

      const particle = document.createElement('div');
      particle.className = 'mouse-trail-particle';
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-primary, #8b5cf6);
        pointer-events: none;
        z-index: 9998;
        opacity: 0.6;
        transition: transform 0.6s ease-out, opacity 0.6s ease-out;
        transform: scale(1);
      `;

      document.body.appendChild(particle);
      particles.push(particle);

      // Animate out
      requestAnimationFrame(() => {
        particle.style.transform = 'scale(0)';
        particle.style.opacity = '0';
      });

      // Remove after animation
      setTimeout(() => {
        particle.remove();
        particles = particles.filter((p) => p !== particle);
      }, 600);
    };

    // Throttle mousemove to avoid flooding
    const onMouseMove = window.throttle((e) => {
      createParticle(e.clientX, e.clientY);
    }, 50);

    document.addEventListener('mousemove', onMouseMove);
  };

  document.addEventListener('DOMContentLoaded', initMouseTrail);
})();
