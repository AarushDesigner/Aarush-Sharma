/* ============================================================
   AARUSH DESIGNER — ADMIN LOGIN
   ============================================================ */

import { auth } from '../../assets/js/firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login-form');
    const errorBox = document.querySelector('#login-error');
    const submitBtn = form.querySelector('button[type="submit"]');

    /* Already logged in? Skip straight to dashboard. */
    onAuthStateChanged(auth, (user) => {
        if (user) window.location.replace('dashboard.html');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';

        const email = form.email.value.trim();
        const password = form.password.value;

        if (!email || !password) {
            errorBox.textContent = 'Please enter both email and password.';
            errorBox.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.replace('dashboard.html');
        } catch (err) {
            let message = 'Something went wrong. Please try again.';
            if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(err.code)) {
                message = 'Incorrect email or password.';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many attempts. Please wait a moment and try again.';
            } else if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your internet connection.';
            }
            errorBox.textContent = message;
            errorBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
});
