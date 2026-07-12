'use strict';

// Global configurations and helper functions
window.HEADER_OFFSET = 80;

/**
 * Debounce – delays execution until after `delay` ms of inactivity.
 * @param {Function} fn  – callback
 * @param {number}   delay – milliseconds
 * @returns {Function}
 */
window.debounce = (fn, delay = 250) => {
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
window.throttle = (fn, limit = 100) => {
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
window.isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/**
 * Quick mobile-width check.
 * @returns {boolean}
 */
window.isMobile = () => window.innerWidth < 768;

/** Safe querySelector wrapper – returns null without throwing. */
window.qs = (sel, root = document) => root.querySelector(sel);

/** Safe querySelectorAll wrapper – returns empty NodeList-like array. */
window.qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

/**
 * Display a toast notification.
 * @param {string} message – text to show
 * @param {'success'|'error'|'info'} type – toast type
 */
window.showToast = (message, type = 'success') => {
  let container = window.qs('#toast-container');

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
  const closeBtn = window.qs('.toast-close', toast);
  const removeToast = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  };

  if (closeBtn) closeBtn.addEventListener('click', removeToast);

  // Auto-remove after 4s
  setTimeout(removeToast, 4000);
};
