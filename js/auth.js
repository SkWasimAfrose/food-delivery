import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Sign Up Function
export async function signUpUser(email, password, fullName, phoneNumber) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      addresses: [],
      createdAt: new Date().toISOString(),
    });

    console.log("User created successfully:", user.uid);
    return { success: true, user: user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
}

// Sign In Function
export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed in successfully:", user.uid);
    return { success: true, user: user };
  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, error: error.message };
  }
}

// Sign Out Function
export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
}

// Check Auth State
export function checkAuthState(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// Get User Data from Firestore
export async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No user data found" };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return { success: false, error: error.message };
  }
}
