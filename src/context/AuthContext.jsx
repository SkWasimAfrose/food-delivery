import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import LoadingScreen from '../components/ui/LoadingScreen';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // Real-time listener for user data
        const docRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.warn("User authenticated but no profile found in Firestore.");
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });

        // Cleanup snapshot listener when auth state changes or component unmounts
        return () => unsubscribeSnapshot();
      } else {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAdmin: userData?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
