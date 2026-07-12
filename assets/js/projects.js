'use strict';

(function () {
  const initCertModal = () => {
    const certCards = window.qsa('.cert-card');
    const modal = window.qs('#cert-modal');
    if (!modal || !certCards.length) return;

    const modalClose = window.qs('.modal-close', modal) || window.qs('.modal__close', modal);
    const modalOverlay = window.qs('.modal-overlay', modal) || modal;
    const modalBody = window.qs('.modal-body', modal) || window.qs('.modal__body', modal);

    const openModal = (card) => {
      const name = card.getAttribute('data-cert-name') ||
                   card.querySelector('.cert-card__name')?.textContent ||
                   card.querySelector('.cert-name')?.textContent ||
                   'Certificate';
      const imgSrc = card.getAttribute('data-cert-img') ||
                     card.querySelector('img')?.getAttribute('src') || '';

      if (modalBody) {
        // Populate modal
        let content = `<h3>${name}</h3>`;
        if (imgSrc) {
          content += `<img src="${imgSrc}" alt="${name}" style="max-width:100%;border-radius:8px;margin-top:1rem;display:block;margin-left:auto;margin-right:auto;">`;
        }
        modalBody.innerHTML = content;
      }

      modal.classList.add('active');
      modal.style.display = 'flex'; // Ensure flex layout is active
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    certCards.forEach((card) => {
      card.addEventListener('click', () => openModal(card));
      card.style.cursor = 'pointer';
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }

    // Escape key handled globally in keyboard nav, but added here as fallback
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  };

  const initTestimonialsSlider = () => {
    const track = window.qs('.testimonials-track');
    const slides = window.qsa('.testimonial-slide') || window.qsa('.testimonial-card');
    const dots = window.qsa('.testimonials-dots .dot') || window.qsa('.slider-dot');
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

  const initProjectModal = () => {
    const caseStudyBtns = document.querySelectorAll('.btn-case-study');
    const modal = document.getElementById('project-modal');
    if (!modal || caseStudyBtns.length === 0) return;

    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');

    const elements = {
      title: document.getElementById('modal-title'),
      problem: document.getElementById('modal-problem'),
      solution: document.getElementById('modal-solution'),
      architecture: document.getElementById('modal-architecture'),
      impact: document.getElementById('modal-impact'),
      challenges: document.getElementById('modal-challenges'),
      image: document.getElementById('modal-image'),
      demoBtn: document.getElementById('modal-demo-btn'),
      githubBtn: document.getElementById('modal-github-btn')
    };

    const openModal = (card) => {
      // Get Data Attributes
      const title = card.querySelector('.project-title')?.textContent || 'Case Study';
      const imgSrc = card.querySelector('img')?.src || '';
      
      const problem = card.dataset.problem || 'No data available.';
      const solution = card.dataset.solution || 'No data available.';
      const architecture = card.dataset.architecture || 'No data available.';
      const impact = card.dataset.impact || 'No data available.';
      const challenges = card.dataset.challenges || 'No data available.';

      // Get external links from the card if they exist
      const githubLink = Array.from(card.querySelectorAll('.project-links a')).find(a => a.href.includes('github'));
      const demoLink = Array.from(card.querySelectorAll('.project-links a')).find(a => !a.href.includes('github') && a.href !== '#' && a.href !== '');

      // Populate Elements
      if (elements.title) elements.title.textContent = title;
      if (elements.problem) elements.problem.textContent = problem;
      if (elements.solution) elements.solution.textContent = solution;
      if (elements.architecture) elements.architecture.textContent = architecture;
      if (elements.impact) elements.impact.textContent = impact;
      if (elements.challenges) elements.challenges.textContent = challenges;
      
      if (elements.image) {
        if (imgSrc) {
          elements.image.src = imgSrc;
          elements.image.style.display = 'block';
        } else {
          elements.image.style.display = 'none';
        }
      }

      // Handle Buttons
      if (elements.githubBtn) {
        if (githubLink) {
          elements.githubBtn.href = githubLink.href;
          elements.githubBtn.style.display = 'inline-flex';
        } else {
          elements.githubBtn.style.display = 'none';
        }
      }

      if (elements.demoBtn) {
        if (demoLink) {
          elements.demoBtn.href = demoLink.href;
          elements.demoBtn.style.display = 'inline-flex';
        } else {
          elements.demoBtn.style.display = 'none';
        }
      }

      // Show Modal
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
    };

    // Event Listeners
    caseStudyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.project-card');
        if (card) openModal(card);
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initCertModal();
    initTestimonialsSlider();
    initProjectModal();
  });
})();
