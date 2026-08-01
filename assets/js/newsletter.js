/* ============================================================
   AARUSH DESIGNER — NEWSLETTER SUBSCRIBE (FIREBASE)
   ============================================================ */

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const originalLabel = btn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#8a4a4a';
      return;
    }
    input.style.borderColor = '';
    btn.disabled = true;
    btn.textContent = 'Subscribing...';

    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: serverTimestamp(),
      });
      form.reset();
      btn.textContent = 'Subscribed ✓';
    } catch (err) {
      console.error('Firestore newsletter error:', err);
      btn.textContent = originalLabel;
      btn.disabled = false;
      alert('Could not subscribe right now — please try again later.');
    }
  });
});
