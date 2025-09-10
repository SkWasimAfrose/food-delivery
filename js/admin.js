// // /js/admin.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
// import {
//   getFirestore,
//   doc,
//   getDoc,
// } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// // ✅ Firebase Config (same as firebase-config.js but self-contained for admin)
// const firebaseConfig = {
//   apiKey: "AIzaSyBMACWaT2ESi5A-q2vzBeNdWJZQDvDYOfk",
//   authDomain: "hotel-lee.firebaseapp.com",
//   projectId: "hotel-lee",
//   storageBucket: "hotel-lee.firebasestorage.app",
//   messagingSenderId: "763270960235",
//   appId: "1:763270960235:web:5343e8f87976424642cd2e",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // 🔑 Check if user has role=admin
// export async function isAdmin(user) {
//   if (!user) return false;
//   try {
//     const snap = await getDoc(doc(db, "users", user.uid));
//     return snap.exists() && snap.data().role === "admin";
//   } catch (err) {
//     console.error("Error checking admin role:", err);
//     return false;
//   }
// }

// // 🔐 Require admin access for a page
// export function requireAdmin(callback) {
//   onAuthStateChanged(auth, async (user) => {
//     if (!user) {
//       window.location.href = "login.html";
//       return;
//     }
//     if (await isAdmin(user)) {
//       callback(user); // ✅ safe to load page content
//     } else {
//       await signOut(auth);
//       alert("❌ Unauthorized. Admins only.");
//       window.location.href = "../index.html";
//     }
//   });
// }

// // 🔓 Shared logout handler
// export async function handleLogout() {
//   await signOut(auth);
//   window.location.href = "login.html";
// }
