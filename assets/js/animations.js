'use strict';

(function () {
  const initScrollReveal = () => {
    const reveals = window.qsa('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Support data-reveal-delay for staggered animations
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) {
            el.style.transitionDelay = delay;
          }

          el.classList.add('active');
          obs.unobserve(el); // only animate once
        }
      });
    }, {
      threshold: 0.15
    });

    reveals.forEach((el) => observer.observe(el));
  };

  const initCounters = () => {
    // Find all elements that have a data-target attribute (handles .counter, .github-stat-number, etc.)
    const counters = window.qsa('[data-target]');
    if (!counters.length) return;

    /**
     * easeOutQuart easing function.
     * @param {number} t – progress 0..1
     * @returns {number}
     */
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOutQuart(progress) * target);

        el.textContent = value.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target); // trigger only once
        }
      });
    }, { threshold: 0.3 });

    counters.forEach((el) => observer.observe(el));
  };

  const initParallax = () => {
    const elements = window.qsa('.parallax-element[data-speed]');
    if (!elements.length) return;

    let ticking = false;

    const updateParallax = () => {
      // Disable on mobile for performance
      if (window.isMobile()) {
        elements.forEach((el) => { el.style.transform = 'translateY(0)'; });
        ticking = false;
        return;
      }

      const scrollY = window.scrollY;

      elements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  };

  const initSkillBars = () => {
    const bars = window.qsa('.skill-progress-fill[data-progress]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const progress = bar.getAttribute('data-progress');
          // Set width – CSS transition handles the animation
          bar.style.width = `${progress}%`;
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach((bar) => {
      bar.style.width = '0%'; // ensure starting point
      observer.observe(bar);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initParallax();
    initSkillBars();
  });
})();
