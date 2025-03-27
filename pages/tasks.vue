<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { query, where, getDocs } from "firebase/firestore";

const router = useRouter();
const { $auth, $db, $collection, $addDoc, $getDocs, $deleteDoc, $doc } = useNuxtApp();

const user = ref(null);
const tasks = ref([]);
const newTask = ref("");
const loading = ref(true);

onMounted(() => {
  onAuthStateChanged($auth, (currentUser) => {
    if (!currentUser) {
      router.push("/"); // Redirect if not logged in
    } else {
      user.value = currentUser;
      fetchTasks();
    }
  });
});

const fetchTasks = async () => {
  if (!user.value) return;

  loading.value = true;
  const q = query($collection($db, "tasks"), where("userId", "==", user.value.uid));
  const querySnapshot = await getDocs(q);
  tasks.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  loading.value = false;
};

const addTask = async () => {
  if (newTask.value.trim() === "") return;
  await $addDoc($collection($db, "tasks"), {
    text: newTask.value,
    userId: user.value.uid, // Associate task with user
  });
  newTask.value = "";
  fetchTasks();
};

const deleteTask = async (id) => {
  await $deleteDoc($doc($db, "tasks", id));
  fetchTasks();
};
</script>

<template>
  <div v-if="user">
    <h1>Task Management</h1>
    <p>Welcome, {{ user.email }}</p>
    <select v-model="sortOption" @change="fetchTasks">
  <option value="dueDate">Sort by Due Date</option>
  <option value="status">Sort by Completion Status</option>
</select>

    <input v-model="newTask" type="text" placeholder="New task..." />
    <button @click="addTask">Add Task</button>

    <h2>Your Tasks</h2>
    <p v-if="loading">Loading tasks...</p>
    <ul v-if="!loading && tasks.length">
      <li v-for="task in tasks" :key="task.id">
        {{ task.text }}
        <button @click="deleteTask(task.id)">Delete</button>
      </li>
    </ul>
    <p v-if="!loading && tasks.length === 0">No tasks found.</p>
  </div>
</template>
