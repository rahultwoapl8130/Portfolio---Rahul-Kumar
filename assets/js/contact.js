'use strict';

(function () {
  const initContactForm = () => {
    const form = window.qs('#contact-form');
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
      const errorSpan = wrapper ? window.qs('.error-message', wrapper) : null;

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
        window.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();

        // Clear any remaining error states
        window.qsa('.form-group', form).forEach((g) => g.classList.remove('error'));
        window.qsa('.error-message', form).forEach((s) => { s.textContent = ''; });
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
          const errorSpan = wrapper ? window.qs('.error-message', wrapper) : null;
          if (errorSpan) errorSpan.textContent = '';
        });
      }
    });
  };

  const initCopyEmail = () => {
    const btn = window.qs('#copy-email');
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
        window.showToast('Email copied to clipboard!', 'success');
      } catch (err) {
        window.showToast('Failed to copy email.', 'error');
        console.error('Copy failed:', err);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initCopyEmail();
  });
})();
