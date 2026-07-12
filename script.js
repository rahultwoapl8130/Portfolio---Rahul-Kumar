'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // ===== UTILITY FUNCTIONS =================================================
  // =========================================================================

  /**
   * Debounce – delays execution until after `delay` ms of inactivity.
   * @param {Function} fn  – callback
   * @param {number}   delay – milliseconds
   * @returns {Function}
   */
  const debounce = (fn, delay = 250) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  /**
   * Throttle – ensures `fn` fires at most once every `limit` ms.
   * @param {Function} fn    – callback
   * @param {number}   limit – milliseconds
   * @returns {Function}
   */
  const throttle = (fn, limit = 100) => {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => { inThrottle = false; }, limit);
      }
    };
  };

  /**
   * Quick touch-device check.
   * @returns {boolean}
   */
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /**
   * Quick mobile-width check.
   * @returns {boolean}
   */
  const isMobile = () => window.innerWidth < 768;

  /** Safe querySelector wrapper – returns null without throwing. */
  const qs = (sel, root = document) => root.querySelector(sel);

  /** Safe querySelectorAll wrapper – returns empty NodeList-like array. */
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  /** Header height constant used for scroll offsets. */
  const HEADER_OFFSET = 80;


  // =========================================================================
  // ===== 1. PRELOADER ======================================================
  // =========================================================================

  const initPreloader = () => {
    const preloader = qs('#preloader');
    if (!preloader) return;

    const minDisplayTime = 1500; // ms
    const startTime = Date.now();

    window.addEventListener('load', () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.add('loaded');
        }, 500); // match CSS transition duration
      }, remaining);
    });

    // Fallback – force-hide if window.load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.add('loaded');
        }, 500);
      }, minDisplayTime);
    }
  };


  // =========================================================================
  // ===== 2. CUSTOM CURSOR ==================================================
  // =========================================================================

  const initCustomCursor = () => {
    // Bail on touch devices
    if (isTouchDevice()) return;

    const outer = qs('.cursor-outer');
    const inner = qs('.cursor-inner');
    if (!outer || !inner) return;

    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    const ease = 0.15; // lag factor for outer ring

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Inner dot follows immediately
      inner.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    // Outer ring follows with delay via rAF
    const animateCursor = () => {
      outerX += (mouseX - outerX) * ease;
      outerY += (mouseY - outerY) * ease;
      outer.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Hover scaling on interactive elements
    const interactiveSelectors = 'a, button, .interactive, input, textarea, [role="button"]';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        outer.classList.add('cursor-hover');
        inner.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        outer.classList.remove('cursor-hover');
        inner.classList.remove('cursor-hover');
      }
    });

    // Hide cursors when mouse leaves the viewport
    document.addEventListener('mouseleave', () => {
      outer.style.opacity = '0';
      inner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      outer.style.opacity = '1';
      inner.style.opacity = '1';
    });
  };


  // =========================================================================
  // ===== 3. THEME TOGGLE ===================================================
  // =========================================================================

  const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  const initThemeToggle = () => {
    const btn = qs('#theme-toggle');
    const html = document.documentElement;

    // Load saved preference or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(btn, savedTheme);

    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon(btn, next);
    });
  };

  /**
   * Swap the toggle button icon between sun and moon.
   * Dark mode shows moon (click to switch to light); light shows sun.
   */
  const updateThemeIcon = (btn, theme) => {
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? MOON_SVG : SUN_SVG;
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };


  // =========================================================================
  // ===== 4. NAVIGATION =====================================================
  // =========================================================================

  const initNavigation = () => {
    const header = qs('#header');
    const navToggle = qs('#nav-toggle');
    const navMenu = qs('.nav-menu');
    const navLinks = qsa('.nav-menu a[href^="#"]');

    // --- Sticky header class on scroll ---
    if (header) {
      const onScroll = () => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // initial check
    }

    // --- Active section highlighting via IntersectionObserver ---
    const sections = qsa('section[id]');
    if (sections.length && navLinks.length) {
      const observerOptions = {
        root: null,
        rootMargin: `-${HEADER_OFFSET}px 0px -40% 0px`,
        threshold: 0
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      }, observerOptions);

      sections.forEach((sec) => sectionObserver.observe(sec));
    }

    // --- Mobile menu toggle ---
    const closeMenu = () => {
      if (navMenu) navMenu.classList.remove('active');
      if (navToggle) navToggle.classList.remove('active');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      if (navMenu) navMenu.classList.add('active');
      if (navToggle) navToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('active');
        isOpen ? closeMenu() : openMenu();
      });
    }

    // Close on nav link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && e.target !== navToggle && !navToggle?.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Close on Escape key (also handled in keyboard nav section)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        closeMenu();
      }
    });

    // --- Smooth scroll on nav link click ---
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = qs(href);
          if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  };


  // =========================================================================
  // ===== 5. TYPING ANIMATION ==============================================
  // =========================================================================

  const initTypingAnimation = () => {
    const el = qs('#typing-text');
    if (!el) return;

    const roles = [
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Engineer',
      'Data Analyst',
      'Business Analyst'
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


  // =========================================================================
  // ===== 6. SCROLL PROGRESS BAR ============================================
  // =========================================================================

  const initScrollProgress = () => {
    const bar = qs('#scroll-progress');
    if (!bar) return;

    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${percent}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress(); // initial
  };


  // =========================================================================
  // ===== 7. SCROLL REVEAL ==================================================
  // =========================================================================

  const initScrollReveal = () => {
    const reveals = qsa('.reveal');
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


  // =========================================================================
  // ===== 8. ANIMATED COUNTERS ==============================================
  // =========================================================================

  const initCounters = () => {
    const counters = qsa('.counter[data-target]');
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


  // =========================================================================
  // ===== 9. SKILLS FILTER ==================================================
  // =========================================================================

  const initSkillsFilter = () => {
    const filterBtns = qsa('.skills-filter-btn');
    const skillCards = qsa('.skill-card');
    if (!filterBtns.length || !skillCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.style.display = '';
            // Trigger reflow then add visible class for animation
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            // Hide after animation
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  };


  // =========================================================================
  // ===== 10. SKILL PROGRESS BARS ===========================================
  // =========================================================================

  const initSkillBars = () => {
    const bars = qsa('.skill-progress-fill[data-progress]');
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


  // =========================================================================
  // ===== 11. FAQ ACCORDION =================================================
  // =========================================================================

  const initFAQAccordion = () => {
    const faqItems = qsa('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const question = qs('.faq-question', item);
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items first
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const answer = qs('.faq-answer', other);
            if (answer) answer.style.maxHeight = null;
          }
        });

        // Toggle clicked item
        item.classList.toggle('active', !isActive);
        const answer = qs('.faq-answer', item);
        if (answer) {
          if (!isActive) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
          } else {
            answer.style.maxHeight = null;
          }
        }
      });
    });
  };


  // =========================================================================
  // ===== 12. TESTIMONIALS SLIDER ===========================================
  // =========================================================================

  const initTestimonialsSlider = () => {
    const track = qs('.testimonials-track');
    const slides = qsa('.testimonial-card');
    const dots = qsa('.slider-dot');
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoSlideTimer = null;
    const interval = 5000; // ms

    const goToSlide = (index) => {
      currentIndex = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active dot
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const nextSlide = () => goToSlide(currentIndex + 1);

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, interval);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    // Dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoSlide(); // reset timer
      });
    });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Start
    goToSlide(0);
    startAutoSlide();
  };


  // =========================================================================
  // ===== 13. CERTIFICATE MODAL =============================================
  // =========================================================================

  const initCertModal = () => {
    const certCards = qsa('.cert-card');
    const modal = qs('#cert-modal');
    if (!modal || !certCards.length) return;

    const modalClose = qs('.modal-close', modal);
    const modalOverlay = qs('.modal-overlay', modal);
    const modalBody = qs('.modal-body', modal);

    const openModal = (card) => {
      const name = card.getAttribute('data-cert-name') ||
                   card.querySelector('.cert-name')?.textContent ||
                   'Certificate';
      const imgSrc = card.getAttribute('data-cert-img') ||
                     card.querySelector('img')?.getAttribute('src') || '';

      if (modalBody) {
        // Populate modal
        let content = `<h3>${name}</h3>`;
        if (imgSrc) {
          content += `<img src="${imgSrc}" alt="${name}" style="max-width:100%;border-radius:8px;margin-top:1rem;">`;
        }
        modalBody.innerHTML = content;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    certCards.forEach((card) => {
      card.addEventListener('click', () => openModal(card));
      card.style.cursor = 'pointer';
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Escape key handled in keyboard nav section – but also add here for safety
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  };


  // =========================================================================
  // ===== 14. CONTACT FORM VALIDATION =======================================
  // =========================================================================

  const initContactForm = () => {
    const form = qs('#contact-form');
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Validation rules keyed by input name.
     */
    const rules = {
      name: {
        required: true,
        minLength: 2,
        message: 'Name must be at least 2 characters.'
      },
      email: {
        required: true,
        pattern: emailRegex,
        message: 'Please enter a valid email address.'
      },
      subject: {
        required: true,
        minLength: 5,
        message: 'Subject must be at least 5 characters.'
      },
      message: {
        required: true,
        minLength: 20,
        message: 'Message must be at least 20 characters.'
      }
    };

    /**
     * Validate a single field.
     * @param {HTMLElement} field
     * @param {object}      rule
     * @returns {boolean}
     */
    const validateField = (field, rule) => {
      const value = field.value.trim();
      const wrapper = field.closest('.form-group') || field.parentElement;
      const errorSpan = wrapper ? qs('.error-message', wrapper) : null;

      let valid = true;
      let msg = '';

      if (rule.required && !value) {
        valid = false;
        msg = rule.message || 'This field is required.';
      } else if (rule.minLength && value.length < rule.minLength) {
        valid = false;
        msg = rule.message;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        valid = false;
        msg = rule.message;
      }

      if (wrapper) wrapper.classList.toggle('error', !valid);
      if (errorSpan) errorSpan.textContent = valid ? '' : msg;

      return valid;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      Object.keys(rules).forEach((name) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field && !validateField(field, rules[name])) {
          isValid = false;
        }
      });

      if (isValid) {
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();

        // Clear any remaining error states
        qsa('.form-group', form).forEach((g) => g.classList.remove('error'));
        qsa('.error-message', form).forEach((s) => { s.textContent = ''; });
      }
    });

    // Live validation on blur
    Object.keys(rules).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (field) {
        field.addEventListener('blur', () => validateField(field, rules[name]));
        // Clear error on input
        field.addEventListener('input', () => {
          const wrapper = field.closest('.form-group') || field.parentElement;
          if (wrapper) wrapper.classList.remove('error');
          const errorSpan = wrapper ? qs('.error-message', wrapper) : null;
          if (errorSpan) errorSpan.textContent = '';
        });
      }
    });
  };


  // =========================================================================
  // ===== 15. TOAST NOTIFICATIONS ===========================================
  // =========================================================================

  /**
   * Display a toast notification.
   * @param {string} message – text to show
   * @param {'success'|'error'|'info'} type – toast type
   */
  const showToast = (message, type = 'success') => {
    let container = qs('#toast-container');

    // Create container if missing
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    // Icon SVGs per type
    const icons = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    // Background colours per type
    const colours = {
      success: 'linear-gradient(135deg, #10b981, #059669)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 12px;
      background: ${colours[type] || colours.info};
      color: #fff;
      font-size: 0.9rem;
      font-family: inherit;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      pointer-events: all;
      transform: translateX(120%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      opacity: 1;
      max-width: 380px;
    `;

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" style="
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 1.1rem;
        margin-left: auto;
        padding: 0 0 0 10px;
        opacity: 0.7;
        transition: opacity 0.2s;
      " aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Close button
    const closeBtn = qs('.toast-close', toast);
    const removeToast = () => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    };

    if (closeBtn) closeBtn.addEventListener('click', removeToast);

    // Auto-remove after 4s
    setTimeout(removeToast, 4000);
  };


  // =========================================================================
  // ===== 16. COPY EMAIL ====================================================
  // =========================================================================

  const initCopyEmail = () => {
    const btn = qs('#copy-email');
    if (!btn) return;

    const email = 'rahultwoapl8130@gmail.com';

    btn.addEventListener('click', async () => {
      try {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Email copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy email.', 'error');
        console.error('Copy failed:', err);
      }
    });
  };


  // =========================================================================
  // ===== 17. BACK TO TOP ===================================================
  // =========================================================================

  const initBackToTop = () => {
    const btn = qs('#back-to-top');
    if (!btn) return;

    const toggleVisibility = () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // initial check

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };


  // =========================================================================
  // ===== 18. PARALLAX ======================================================
  // =========================================================================

  const initParallax = () => {
    const elements = qsa('.parallax-element[data-speed]');
    if (!elements.length) return;

    let ticking = false;

    const updateParallax = () => {
      // Disable on mobile for performance
      if (isMobile()) {
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


  // =========================================================================
  // ===== 19. MOUSE TRAIL (SUBTLE) ==========================================
  // =========================================================================

  const initMouseTrail = () => {
    // Only on desktop
    if (isTouchDevice() || isMobile()) return;

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
        background: var(--accent-color, #8b5cf6);
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
    const onMouseMove = throttle((e) => {
      createParticle(e.clientX, e.clientY);
    }, 50);

    document.addEventListener('mousemove', onMouseMove);
  };


  // =========================================================================
  // ===== 20. VISITOR COUNTER ===============================================
  // =========================================================================

  const initVisitorCounter = () => {
    const key = 'portfolio-visits';
    let visits = parseInt(localStorage.getItem(key), 10) || 0;
    visits++;
    localStorage.setItem(key, visits.toString());

    const el = qs('#visitor-count');
    if (el) {
      el.textContent = visits.toLocaleString();
    }
  };


  // =========================================================================
  // ===== 21. SOCIAL SHARE ==================================================
  // =========================================================================

  const initSocialShare = () => {
    const buttons = qsa('[data-share]');
    if (!buttons.length) return;

    const portfolioURL = encodeURIComponent(window.location.href);
    const portfolioTitle = encodeURIComponent('Check out Rahul Kumar\'s Portfolio!');

    const shareURLs = {
      twitter: `https://twitter.com/intent/tweet?url=${portfolioURL}&text=${portfolioTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${portfolioURL}`,
      whatsapp: `https://api.whatsapp.com/send?text=${portfolioTitle}%20${portfolioURL}`
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = btn.getAttribute('data-share');
        const url = shareURLs[platform];
        if (url) {
          window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
        }
      });
    });
  };


  // =========================================================================
  // ===== 22. LAZY LOADING IMAGES ===========================================
  // =========================================================================

  const initLazyLoading = () => {
    const images = qsa('img[data-src]');
    if (!images.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach((img) => observer.observe(img));
  };


  // =========================================================================
  // ===== 23. KEYBOARD NAVIGATION ==========================================
  // =========================================================================

  const initKeyboardNav = () => {
    // Track keyboard vs mouse usage for focus styling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }

      // Global Escape handler
      if (e.key === 'Escape') {
        // Close cert modal
        const certModal = qs('#cert-modal');
        if (certModal?.classList.contains('active')) {
          certModal.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Close mobile menu
        const navMenu = qs('.nav-menu');
        if (navMenu?.classList.contains('active')) {
          navMenu.classList.remove('active');
          const navToggle = qs('#nav-toggle');
          if (navToggle) navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  };


  // =========================================================================
  // ===== 24. SMOOTH SCROLLING (GLOBAL) =====================================
  // =========================================================================

  const initSmoothScroll = () => {
    // Handle all anchor links with href starting with '#'
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = qs(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  };


  // =========================================================================
  // ===== INIT – BOOTSTRAP ALL MODULES ======================================
  // =========================================================================

  // Fire in order (preloader first so it captures the load event)
  initPreloader();
  initCustomCursor();
  initThemeToggle();
  initNavigation();
  initTypingAnimation();
  initScrollProgress();
  initScrollReveal();
  initCounters();
  initSkillsFilter();
  initSkillBars();
  initFAQAccordion();
  initTestimonialsSlider();
  initCertModal();
  initContactForm();
  // showToast is a global utility – no init needed
  initCopyEmail();
  initBackToTop();
  initParallax();
  initMouseTrail();
  initVisitorCounter();
  initSocialShare();
  initLazyLoading();
  initKeyboardNav();
  initSmoothScroll();

  // Log confirmation
  console.log('%c Portfolio JS Loaded ✓ ', 'background:#8b5cf6;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold;');

}); // END DOMContentLoaded
