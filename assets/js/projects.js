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

  document.addEventListener('DOMContentLoaded', () => {
    initCertModal();
    initTestimonialsSlider();
  });
})();
