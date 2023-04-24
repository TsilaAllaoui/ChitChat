import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWQ1csPxhFNXRhpG6x1nrgJsbBEAhtqgQ",
  authDomain: "chichat-firebase.firebaseapp.com",
  projectId: "chichat-firebase",
  storageBucket: "chichat-firebase.appspot.com",
  messagingSenderId: "24466417086",
  appId: "1:24466417086:web:26f97a6f53656efd3785ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth();
export const db = getFirestore();