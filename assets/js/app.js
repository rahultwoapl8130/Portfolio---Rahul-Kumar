'use strict';

(function () {
  // =========================================================================
  // ===== 1. PRELOADER ======================================================
  // =========================================================================
  const initPreloader = () => {
    const preloader = window.qs('#preloader');
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
    if (window.isTouchDevice()) return;

    const outer = window.qs('.cursor-outer');
    const inner = window.qs('.cursor-inner');
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
    const interactiveSelectors = 'a, button, .interactive, input, textarea, [role="button"], .cert-card';

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
  // ===== 3. NAVIGATION =====================================================
  // =========================================================================
  const initNavigation = () => {
    const header = window.qs('#header');
    const navToggle = window.qs('#nav-toggle');
    const navMenu = window.qs('.nav-menu');
    const navLinks = window.qsa('.nav-menu a[href^="#"]');

    // Sticky header class on scroll
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

    // Active section highlighting via IntersectionObserver
    const sections = window.qsa('section[id]');
    if (sections.length && navLinks.length) {
      const observerOptions = {
        root: null,
        rootMargin: `-${window.HEADER_OFFSET}px 0px -40% 0px`,
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

    // Mobile menu toggle
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

    // Smooth scroll on nav link click
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = window.qs(href);
          if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - window.HEADER_OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  };

  // =========================================================================
  // ===== 4. SCROLL PROGRESS BAR ============================================
  // =========================================================================
  const initScrollProgress = () => {
    const bar = window.qs('#scroll-progress');
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
  // ===== 5. SKILLS FILTER ==================================================
  // =========================================================================
  const initSkillsFilter = () => {
    const filterBtns = window.qsa('.skills-filter-btn') || window.qsa('.filter-btn');
    const skillCards = window.qsa('.skill-card');
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
  // ===== 6. FAQ ACCORDION =================================================
  // =========================================================================
  const initFAQAccordion = () => {
    const faqItems = window.qsa('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const question = window.qs('.faq-question', item);
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('open') || item.classList.contains('active');

        // Close all other items first
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            other.classList.remove('active');
            const answer = window.qs('.faq-answer', other);
            if (answer) answer.style.maxHeight = null;
          }
        });

        // Toggle clicked item
        item.classList.toggle('open', !isActive);
        item.classList.toggle('active', !isActive);
        const answer = window.qs('.faq-answer', item);
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
  // ===== 7. BACK TO TOP ===================================================
  // =========================================================================
  const initBackToTop = () => {
    const btn = window.qs('#back-to-top');
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
  // ===== 8. VISITOR COUNTER ===============================================
  // =========================================================================
  const initVisitorCounter = () => {
    const key = 'portfolio-visits';
    let visits = parseInt(localStorage.getItem(key), 10) || 0;
    visits++;
    localStorage.setItem(key, visits.toString());

    const el = window.qs('#visitor-count');
    if (el) {
      el.textContent = visits.toLocaleString();
    }
  };

  // =========================================================================
  // ===== 9. SOCIAL SHARE ==================================================
  // =========================================================================
  const initSocialShare = () => {
    const buttons = window.qsa('[data-share]');
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
  // ===== 10. LAZY LOADING IMAGES ===========================================
  // =========================================================================
  const initLazyLoading = () => {
    const images = window.qsa('img[data-src]');
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
  // ===== 11. KEYBOARD NAVIGATION ==========================================
  // =========================================================================
  const initKeyboardNav = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }

      // Global Escape handler
      if (e.key === 'Escape') {
        // Close cert modal
        const certModal = window.qs('#cert-modal');
        if (certModal?.classList.contains('active')) {
          certModal.classList.remove('active');
          certModal.style.display = 'none';
          document.body.style.overflow = '';
        }

        // Close mobile menu
        const navMenu = window.qs('.nav-menu');
        if (navMenu?.classList.contains('active')) {
          navMenu.classList.remove('active');
          const navToggle = window.qs('#nav-toggle');
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
  // ===== 12. SMOOTH SCROLLING (GLOBAL) =====================================
  // =========================================================================
  const initSmoothScroll = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = window.qs(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - window.HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  };

  // Bootstrap all general modules
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initNavigation();
    initScrollProgress();
    initSkillsFilter();
    initFAQAccordion();
    initBackToTop();
    initVisitorCounter();
    initSocialShare();
    initLazyLoading();
    initKeyboardNav();
    initSmoothScroll();

    // Log confirmation
    console.log('%c Portfolio Main App Initialized ✓ ', 'background:#8b5cf6;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold;');
  });
})();
