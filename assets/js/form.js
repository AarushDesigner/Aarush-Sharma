/* ============================================================
   AARUSH DESIGNER — CONTACT FORM VALIDATION + FIREBASE SUBMIT
   ============================================================ */

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const successMsg = document.querySelector('#form-success');
  const errorMsg = document.querySelector('#form-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => v.trim() === '' || /^[+]?[0-9\s-]{7,15}$/.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function setError(field, hasError) {
    const wrapper = field.closest('.field');
    if (!wrapper) return;
    wrapper.classList.toggle('has-error', hasError);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      const valid = validators[name](field.value);
      setError(field, !valid);
      if (!valid) isValid = false;
    });

    if (!isValid) return;
    if (errorMsg) errorMsg.style.display = 'none';

    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      await addDoc(collection(db, 'contacts'), {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim(),
        createdAt: serverTimestamp(),
      });

      form.reset();
      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    } catch (err) {
      console.error('Firestore submit error:', err);
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
      if (errorMsg) {
        errorMsg.textContent = `Could not send message (${err.code || err.message}). Please try WhatsApp or email instead.`;
        errorMsg.style.display = 'block';
      } else {
        alert('Something went wrong sending your message. Please try WhatsApp or email instead.');
      }
    }
  });

  /* Clear error state as user types */
  Object.keys(validators).forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener('input', () => setError(field, false));
  });
});
