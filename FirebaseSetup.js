import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzPBhGahVNb1IKXrnsHqDgQroW2KNaWKA",
  authDomain: "walletwatch-app.firebaseapp.com",
  projectId: "walletwatch-app",
  storageBucket: "walletwatch-app.appspot.com",
  messagingSenderId: "329487416008",
  appId: "1:329487416008:web:a97a96b75408d2711443fd",
  measurementId: "G-L47BXTNCYC",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { db, firestore, auth };
