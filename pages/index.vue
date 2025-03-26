<script setup>
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { signInWithPopup } from 'firebase/auth';

const router = useRouter();
const { $auth, $googleProvider, $facebookProvider } = useNuxtApp();

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup($auth, $googleProvider);
    console.log("Google User:", result.user);
    router.push("/dashboard");
  } catch (error) {
    console.error("Google Login Error:", error.message);
  }
};

const loginWithFacebook = async () => {
  try {
    const result = await signInWithPopup($auth, $facebookProvider);
    console.log("Facebook User:", result.user);
    router.push("/dashboard");
  } catch (error) {
    console.error("Facebook Login Error:", error.message);
  }
};
</script>

<template>
  <div>
    <h1>Login</h1>
    <button @click="loginWithGoogle">Login with Google</button>
    <button @click="loginWithFacebook">Login with Facebook</button>
  </div>
</template>
