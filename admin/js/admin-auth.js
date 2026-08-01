/* ============================================================
   AARUSH DESIGNER — ADMIN AUTH GUARD
   Include this on every protected admin page.
   Redirects to login.html if no authenticated user is found.
   ============================================================ */

import { auth } from '../../assets/js/firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let resolveUser;
export const currentUserReady = new Promise((resolve) => {
    resolveUser = resolve;
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace('login.html');
        return;
    }
    document.body.classList.add('is-authenticated');
    resolveUser(user);
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('[data-logout]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut(auth);
            window.location.replace('login.html');
        });
    }
});
