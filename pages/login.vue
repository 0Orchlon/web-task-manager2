<template>
    <div class="login">
      <h2>Login</h2>
      <button @click="loginWithGoogle">Login with Google</button>
      <button @click="loginWithFacebook">Login with Facebook</button>
    </div>
  </template>
  
  <script setup>
  import { auth } from '../plugins/firebase';
  
  const loginWithGoogle = async () => {
    const provider = new auth.GoogleAuthProvider();
    try {
      const result = await auth().signInWithPopup(provider);
      console.log('Google User:', result.user);
    } catch (error) {
      console.error(error);
    }
  };
  
  const loginWithFacebook = async () => {
    const provider = new auth.FacebookAuthProvider();
    try {
      const result = await auth().signInWithPopup(provider);
      console.log('Facebook User:', result.user);
    } catch (error) {
      console.error(error);
    }
  };
  </script>
  