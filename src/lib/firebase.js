import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMACWaT2ESi5A-q2vzBeNdWJZQDvDYOfk",
  authDomain: "hotel-lee.firebaseapp.com",
  projectId: "hotel-lee",
  storageBucket: "hotel-lee.firebasestorage.app",
  messagingSenderId: "763270960235",
  appId: "1:763270960235:web:5343e8f87976424642cd2e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
