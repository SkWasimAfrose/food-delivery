// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  inMemoryPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMACWaT2ESi5A-q2vzBeNdWJZQDvDYOfk",
  authDomain: "hotel-lee.firebaseapp.com",
  projectId: "hotel-lee",
  storageBucket: "hotel-lee.firebasestorage.app",
  messagingSenderId: "763270960235",
  appId: "1:763270960235:web:5343e8f87976424642cd2e"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with persistence
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.warn("Error setting auth persistence:", error);
      return setPersistence(auth, inMemoryPersistence);
    });
  
  // Initialize Firestore with offline persistence
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Offline persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support offline persistence.");
    }
  });
  
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  // Show user-friendly error message
  if (document.getElementById('firebase-error')) {
    document.getElementById('firebase-error').style.display = 'block';
  }
}

// Export Firebase services
export { app, auth, db };

// Export other Firebase modules that might be needed
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

export { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
