<script setup>
import { ref, computed, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { onAuthStateChanged } from "firebase/auth";
import { query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const { $auth, $db, $collection, $addDoc, $getDocs, $deleteDoc, $doc } = useNuxtApp();

const newTask = ref({
  title: "",
  description: "",
  dueDate: "",
  priority: 2,
});

const loading = ref(true);
const user = ref(null);
const tasks = ref([]); // List of tasks
const sortBy = ref("dueDate"); // Default sorting option

// Task for editing
const editingTask = ref(null); // Task being edited

// Function to calculate days left
const daysLeft = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due - today;
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days
  return days;
};

// Function to get priority as a string
const priorityLabel = (priority) => {
  if (priority === 1) return "Low";
  if (priority === 2) return "Medium";
  return "High";
};

// Fetch tasks from Firestore
const fetchTasks = async () => {
  if (!user.value) return;

  loading.value = true;
  const q = query($collection($db, "tasks"), where("userId", "==", user.value.uid));
  const querySnapshot = await $getDocs(q);
  tasks.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  loading.value = false;
};

// Add a new task
const addTask = async () => {
  try {
    const task = {
      ...newTask.value,
      completed: false,
      createdAt: new Date(),
      userId: user.value.uid,
    };

    const docRef = await $addDoc($collection($db, "tasks"), task);
    tasks.value.push({ id: docRef.id, ...task });

    newTask.value = { title: "", description: "", dueDate: "", priority: 2 };
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Edit task
const editTask = (task) => {
  editingTask.value = { ...task }; // Set the task being edited
  window.scrollTo(0, 0);

};

// Save edited task
const saveEditedTask = async () => {
  try {
    const taskRef = $doc($db, "tasks", editingTask.value.id);
    await updateDoc(taskRef, {
      title: editingTask.value.title,
      description: editingTask.value.description,
      dueDate: editingTask.value.dueDate,
      priority: editingTask.value.priority,
    });

    // Update the task in the local list
    const index = tasks.value.findIndex((task) => task.id === editingTask.value.id);
    if (index !== -1) {
      tasks.value[index] = editingTask.value;
    }

    editingTask.value = null; // Clear the editing state
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

// Sort tasks based on selected criteria
const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    if (sortBy.value === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy.value === "dueDated") return new Date(b.dueDate) - new Date(a.dueDate);
    if (sortBy.value === "status") return a.completed - b.completed;
    if (sortBy.value === "statusd") return b.completed - a.completed;
    if (sortBy.value === "priority") return b.priority - a.priority;
    if (sortBy.value === "priorityd") return a.priority - b.priority;
  });
});

// Toggle completion status of a task
const toggleCompletion = async (task) => {
  try {
    task.completed = !task.completed;
    const taskRef = $doc($db, "tasks", task.id);
    await updateDoc(taskRef, { completed: task.completed });
  } catch (error) {
    console.error("Error toggling task completion:", error);
  }
};

// Delete a task
const deleteTask = async (taskId) => {
  try {
    const taskRef = $doc($db, "tasks", taskId);
    await $deleteDoc(taskRef);
    tasks.value = tasks.value.filter((task) => task.id !== taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Fetch tasks when the component is mounted
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
</script>

<template>
  <div>
    <h2>📝 Task Management</h2>

    <!-- Add Task Form -->
    <form @submit.prevent="addTask">
      <input v-model="newTask.title" placeholder="Task Title" required />
      <textarea v-model="newTask.description" placeholder="Task Description" required></textarea>
      <input type="date" v-model="newTask.dueDate" required />
      <select v-model="newTask.priority">
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </select>
      <button type="submit">Add Task</button>
    </form>

    <hr />

    <!-- Sort Tasks -->
    <div>
      <label for="sort">Sort By:</label>
      <select v-model="sortBy" @change="fetchTasks">
        <option value="dueDate">Due Date ↑</option>
        <option value="dueDated">Due Date ↓</option>
        <option value="status">Pending Status ↑</option>
        <option value="statusd">Completed Status</option>
        <option value="priority">Priority ↓</option>
        <option value="priorityd">Priority ↑</option>
      </select>
    </div>
    <div v-if="editingTask" class="edit-task-form">
      <h3>Edit Task</h3>
      <form @submit.prevent="saveEditedTask">
        <input v-model="editingTask.title" placeholder="Task Title" required />
        <textarea v-model="editingTask.description" placeholder="Task Description" required></textarea>
        <input type="date" v-model="editingTask.dueDate" required />
        <select v-model="editingTask.priority">
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>
        <button type="submit">Save Changes</button>
        <button type="button" @click="editingTask = null">Cancel</button>
      </form>
    </div>
    <!-- Task List -->
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Days Left</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in sortedTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>
            <textarea rows="3" readonly style="resize: none; width: 100%;">{{ task.description }}</textarea> 
          </td>
          <td>{{ task.dueDate }}</td>
          <td>{{ daysLeft(task.dueDate) }} days left</td>
          <td>{{ priorityLabel(task.priority) }}</td>
          <td :class="{ completed: task.completed }">
            {{ task.completed ? "Completed" : "Pending" }}
          </td>
          <td>
            <button @click="toggleCompletion(task)">Toggle Completion</button>
            <button @click="deleteTask(task.id)">Delete</button>
            <button @click="editTask(task)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Task Form (Appears when a task is being edited) -->
   
  </div>
</template>

<style scoped>
.completed {
  color: green;
  font-weight: bold;
}
button {
  margin-left: 5px;
  padding: 5px;
  cursor: pointer;
}
table, th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.edit-task-form {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.edit-task-form input,
.edit-task-form textarea {
  width: 100%;
  margin-bottom: 10px;
}
</style>
