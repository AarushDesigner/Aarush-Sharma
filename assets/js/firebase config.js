/* ============================================================
   AARUSH DESIGNER — FIREBASE CONFIG
   Shared Firebase app + Firestore instance (ES module)
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZE-fuaL1auRnoXG8IOS4g7-xWnUi9nbU",
  authDomain: "aarush-designer.firebaseapp.com",
  projectId: "aarush-designer",
  storageBucket: "aarush-designer.firebasestorage.app",
  messagingSenderId: "783410104663",
  appId: "1:783410104663:web:7c23c079d07eb2dec89612",
  measurementId: "G-ETGGXBRPRL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
