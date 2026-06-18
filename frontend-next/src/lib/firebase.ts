import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDfIKeb9ENXtv60wMGPMLg--eKb158Y2A4",
  authDomain: "time-lion-l.firebaseapp.com",
  projectId: "time-lion-l",
  storageBucket: "time-lion-l.firebasestorage.app",
  messagingSenderId: "800472091666",
  appId: "1:800472091666:web:f242456b0f69c322ce9ccb",
  measurementId: "G-CJ3G7E08DJ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, storage, analytics };
