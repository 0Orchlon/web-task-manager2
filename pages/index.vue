<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const router = useRouter();
const { $auth, $googleProvider, $facebookProvider, $signInWithEmailAndPassword } = useNuxtApp();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const loginWithEmail = async () => {
  try {
    await $signInWithEmailAndPassword($auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value=error.message=("email or password wrong!");
  }
};

const loginWithGoogle = async () => {
  try {
    await signInWithPopup($auth, $googleProvider);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.message;
  }
};
onMounted(() => {
  onAuthStateChanged($auth, (currentUser) => {
    if (currentUser) {
      router.push("/dashboard"); // Redirect if not logged in
    } else {
      user.value = currentUser;
      loading.value = false;
    }
  });
});
const loginWithFacebook = async () => {
  try {
    await signInWithPopup($auth, $facebookProvider);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.message;
  }
};
const register = async () =>{
  try {
    router.push("/register");
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<template>
  <div>
    <nav>
      <router-link to="/tos">Terms of Service</router-link>
      <br> </br>
      <router-link to="/privacypolicy">Privacy Policy</router-link>
    </nav>
    <h1>Login</h1>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="loginWithEmail">Login with Email</button>
    <button @click="loginWithGoogle">Login with Google</button>
    <button @click="loginWithFacebook">Login with Facebook</button>
    <fb:login-button 
  scope="public_profile,email"
  onlogin="checkLoginState();">
</fb:login-button>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p>Don't have an account? <button @click="register">Register</button></p>
  </div>
  
</template>