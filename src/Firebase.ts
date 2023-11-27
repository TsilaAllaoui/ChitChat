import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWQ1csPxhFNXRhpG6x1nrgJsbBEAhtqgQ",
  authDomain: "chichat-firebase.firebaseapp.com",
  projectId: "chichat-firebase",
  storageBucket: "chichat-firebase.appspot.com",
  messagingSenderId: "24466417086",
  appId: "1:24466417086:web:26f97a6f53656efd3785ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
export const gauthProvider = new GoogleAuthProvider();
