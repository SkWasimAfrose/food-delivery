// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your Firebase config (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyBMACWaT2ESi5A-q2vzBeNdWJZQDvDYOfk",
  authDomain: "hotel-lee.firebaseapp.com",
  projectId: "hotel-lee",
  storageBucket: "hotel-lee.firebasestorage.app",
  messagingSenderId: "763270960235",
  appId: "1:763270960235:web:5343e8f87976424642cd2e",
  // measurementId: "G-6E04X00FK2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
