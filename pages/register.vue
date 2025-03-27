<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
const router = useRouter();
const { $auth, $createUserWithEmailAndPassword } = useNuxtApp();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const register = async () => {
  try {
    await $createUserWithEmailAndPassword($auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div>
    <h1>Register</h1>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p>Already have an account? <router-link to="/">Login</router-link></p>
  </div>
</template>
