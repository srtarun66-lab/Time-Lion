'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // Fetch or create user profile in Firestore
          const userRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as User;
            if (fbUser.photoURL && data.photoURL !== fbUser.photoURL) {
              data.photoURL = fbUser.photoURL;
              await setDoc(userRef, { photoURL: fbUser.photoURL }, { merge: true });
            }
            setUser(data);
          } else {
            const newUser: User = {
              id: fbUser.uid,
              fullName: fbUser.displayName || '',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '',
              photoURL: fbUser.photoURL || '',
              address: '',
              city: '',
              pincode: '',
              state: ''
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error: any) {
          console.error("Firestore Permission Error. Make sure rules allow access to /users", error);
          window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Firestore Permission Denied. Please update Firestore Rules.', type: 'error' } }));
          // Fallback to minimal user
          setUser({
              id: fbUser.uid,
              fullName: fbUser.displayName || '',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '',
              address: '',
              city: '',
              pincode: '',
              state: ''
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'srtarun66@gmail.com,jofrashivaa@gmail.com').split(',').map(e => e.trim());
      
      if (result.user.email && ADMIN_EMAILS.includes(result.user.email)) {
        await signOut(auth);
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Admin accounts cannot be used to shop. Please login via the Admin Portal.', type: 'error' } }));
        return;
      }

      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Logged in with Google', type: 'success' } }));
    } catch (error: any) {
      console.error(error);
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: error.message, type: 'error' } }));
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Successfully logged out', type: 'success' } }));
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
