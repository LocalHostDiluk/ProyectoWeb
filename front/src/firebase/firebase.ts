import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBb9yCHIAJBWwOGyolg3dTH_G1-qkowscg",
  authDomain: "proyra-9feb9.firebaseapp.com",
  projectId: "proyra-9feb9",
  storageBucket: "proyra-9feb9.firebasestorage.app",
  messagingSenderId: "30125654786",
  appId: "1:30125654786:web:d2927c2fe6f0cfb7ccf81b",
  measurementId: "G-L2L6XC0JZ6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
