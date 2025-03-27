<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";

const router = useRouter();
const { $auth } = useNuxtApp();

const user = ref(null);
const loading = ref(true);
const currentPage = ref("dashboard"); // Track which page is displayed

onMounted(() => {
  onAuthStateChanged($auth, (currentUser) => {
    if (!currentUser) {
      router.push("/"); // Redirect if not logged in
    } else {
      user.value = currentUser;
      loading.value = false;
    }
  });
});

const logout = async () => {
  await $auth.signOut();
  router.push("/");
};
</script>

<template>
  <div v-if="user">
    <h1>Welcome, {{ user.email }}</h1>
    <button @click="logout">Logout</button>
    <div>
      <TaskManager />
    </div>
  </div>
</template>

<!-- Import TaskManager as a component -->
<script>
import TaskManager from "@/components/TaskManager.vue";
export default { components: { TaskManager } };
</script>
