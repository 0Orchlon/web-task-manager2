<script setup>
import { useNuxtApp } from '#app';
import { useRouter } from 'vue-router';

const router = useRouter();
const { $auth } = useNuxtApp();

const user = $auth.currentUser;

if (!user) {
  // If the user is not logged in, redirect to login page
  router.push('/');
}
</script>

<template>
  <div v-if="$auth.currentUser">
    <h1>Welcome to your Dashboard!</h1>
    <p>Email: {{ $auth.currentUser.email }}</p>
  </div>
  <div v-else>
    <p>Please log in first.</p>
  </div>
</template>
