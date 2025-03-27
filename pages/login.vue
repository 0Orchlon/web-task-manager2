<script setup>
import { useNuxtApp } from "#app";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

const { $firebaseAuth, $googleProvider, $facebookProvider, $signInWithEmailAndPassword } = useNuxtApp();
const router = useRouter();

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup($firebaseAuth, $googleProvider);
    console.log("User:", result.user);
    router.push("/dashboard");  // Redirect after successful login
  } catch (error) {
    console.error("Google Login Error:", error.message);
  }
};

const loginWithFacebook = async () => {
  try {
    const result = await signInWithPopup($firebaseAuth, $facebookProvider);
    console.log("User:", result.user);
    router.push("/dashboard");  // Redirect after successful login
  } catch (error) {
    console.error("Facebook Login Error:", error.message);
  }
};
</script>

<template>
  <div>
    <button @click="loginWithGoogle">Login with Google</button>
    <button @click="loginWithFacebook">Login with Facebook</button>
  </div>
</template>
