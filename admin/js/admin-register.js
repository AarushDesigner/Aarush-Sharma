/* ============================================================
   AARUSH DESIGNER — ADMIN REGISTRATION
   ============================================================ */

import { auth } from '../../assets/js/firebase-config.js';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#register-form');
    const errorBox = document.querySelector('#register-error');
    const successBox = document.querySelector('#register-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    /* Already logged in? Skip straight to dashboard. */
    onAuthStateChanged(auth, (user) => {
        if (user) window.location.replace('dashboard.html');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';
        successBox.style.display = 'none';

        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form['confirm-password'].value;

        /* Validation */
        if (!email || !password || !confirmPassword) {
            errorBox.textContent = 'Please fill in all fields.';
            errorBox.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorBox.textContent = 'Password must be at least 6 characters.';
            errorBox.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorBox.textContent = 'Passwords do not match.';
            errorBox.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        try {
            await createUserWithEmailAndPassword(auth, email, password);

            /* Success - show message, then redirect after a moment */
            successBox.textContent = 'Account created successfully! Redirecting to dashboard...';
            successBox.style.display = 'block';
            form.style.display = 'none';

            setTimeout(() => {
                window.location.replace('dashboard.html');
            }, 1500);

        } catch (err) {
            let message = 'Something went wrong. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Please login instead.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Please enter a valid email address.';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password is too weak. Please use at least 6 characters.';
            } else if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your internet connection.';
            }
            errorBox.textContent = message;
            errorBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
});
