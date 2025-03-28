// plugins/firebase.ts
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";



// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeLYUVyXyc3FMgJmHUExYBtQKJJp_h9Vo",
  authDomain: "web-based-task-managment.firebaseapp.com",
  databaseURL: "https://web-based-task-managment-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-based-task-managment",
  storageBucket: "web-based-task-managment.firebasestorage.app",
  messagingSenderId: "665525790077",
  appId: "1:665525790077:web:00bac259cc968310145814",
  measurementId: "G-VNGW1J8964"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app);

export default defineNuxtPlugin(() => {
  return {
    
    provide: {
      auth,
      googleProvider,
      facebookProvider,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      db,
      collection,
      addDoc,
      getDocs,
      deleteDoc,
      doc,
    },
  };
});
