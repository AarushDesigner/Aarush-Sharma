/* ============================================================
   AARUSH DESIGNER — ADMIN DASHBOARD DATA
   Runs only after admin-auth.js confirms a logged-in user.
   ============================================================ */

import { db } from '../../assets/js/firebase-config.js';
import { currentUserReady } from './admin-auth.js';
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function formatDate(ts) {
    if (!ts || !ts.toDate) return '—';
    return ts.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return escapeHtml(text);
    return escapeHtml(text.substring(0, maxLength)) + '…';
}

async function loadDashboard() {
    const user = await currentUserReady;

    const adminEmailEl = document.querySelector('[data-admin-email]');
    if (adminEmailEl) adminEmailEl.textContent = user.email;

    const contactsTable = document.querySelector('#contacts-table-body');
    const newsletterTable = document.querySelector('#newsletter-table-body');
    const statContacts = document.querySelector('[data-stat="contacts"]');
    const statNewsletter = document.querySelector('[data-stat="newsletter"]');
    const statThisMonth = document.querySelector('[data-stat="this-month"]');

    let totalContacts = 0;
    let thisMonthCount = 0;
    const now = new Date();

    /* ====== LOAD CONTACTS ====== */
    try {
        const contactsQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(50));
        const contactsSnap = await getDocs(contactsQuery);

        totalContacts = contactsSnap.size;

        if (contactsTable) {
            if (contactsSnap.empty) {
                contactsTable.innerHTML = `<tr><td colspan="5" class="empty-row">No enquiries yet.</td></tr>`;
            } else {
                contactsTable.innerHTML = contactsSnap.docs.map((doc) => {
                    const c = doc.data();
                    if (c.createdAt?.toDate) {
                        const d = c.createdAt.toDate();
                        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                            thisMonthCount++;
                        }
                    }
                    return `
                        <tr>
                            <td><strong>${escapeHtml(c.name)}</strong></td>
                            <td><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></td>
                            <td>${escapeHtml(c.phone) || '—'}</td>
                            <td class="truncate-cell" title="${escapeHtml(c.message)}">${truncateText(c.message, 80)}</td>
                            <td>${formatDate(c.createdAt)}</td>
                        </tr>`;
                }).join('');
            }
        }

        if (statContacts) statContacts.textContent = totalContacts;
        if (statThisMonth) statThisMonth.textContent = thisMonthCount;

    } catch (err) {
        console.error('Error loading contacts:', err);
        if (contactsTable) {
            contactsTable.innerHTML = `<tr><td colspan="5" class="empty-row">⚠️ Could not load enquiries. Please check your internet connection.</td></tr>`;
        }
    }

    /* ====== LOAD NEWSLETTER SUBSCRIBERS ====== */
    try {
        const newsletterQuery = query(collection(db, 'newsletter'), orderBy('createdAt', 'desc'), limit(50));
        const newsletterSnap = await getDocs(newsletterQuery);

        if (statNewsletter) statNewsletter.textContent = newsletterSnap.size;

        if (newsletterTable) {
            if (newsletterSnap.empty) {
                newsletterTable.innerHTML = `<tr><td colspan="2" class="empty-row">No subscribers yet.</td></tr>`;
            } else {
                newsletterTable.innerHTML = newsletterSnap.docs.map((doc) => {
                    const n = doc.data();
                    return `
                        <tr>
                            <td><a href="mailto:${escapeHtml(n.email)}">${escapeHtml(n.email)}</a></td>
                            <td>${formatDate(n.createdAt)}</td>
                        </tr>`;
                }).join('');
            }
        }
    } catch (err) {
        console.error('Error loading newsletter list:', err);
        if (newsletterTable) {
            newsletterTable.innerHTML = `<tr><td colspan="2" class="empty-row">⚠️ Could not load subscribers. Please check your internet connection.</td></tr>`;
        }
    }
}

loadDashboard();
