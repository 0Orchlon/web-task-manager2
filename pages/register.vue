<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

const router = useRouter();
const { $auth, $createUserWithEmailAndPassword } = useNuxtApp();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const loading = ref(false);

const register = async () => {
  errorMessage.value = "";

  // Basic validation
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = "All fields are required.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters.";
    return;
  }

  try {
    loading.value = true;
    await $createUserWithEmailAndPassword($auth, email.value, password.value);
    router.push("/");
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-4 text-center">Register</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 border rounded-md mb-3"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 border rounded-md mb-3"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="w-full p-2 border rounded-md mb-3"
      />

      <p v-if="errorMessage" class="text-red-500 text-sm mb-2">{{ errorMessage }}</p>

      <button
        @click="register"
        :disabled="loading"
        class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>

      <p class="text-sm text-center mt-3">
        Already have an account?
        <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>
