<template>
  <div class="app">
    <!-- Conditionally render Topnav -->
    <Topnav v-if="showTopnav" />

    <!-- Main Content Container -->
    <div class="content-container">
      <!-- Conditionally render Sidebar -->
      <Sidebar v-if="showSidebar" />

      <!-- Content -->
      <main :class="{ 'no-sidebar': !showSidebar }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import Topnav from './components/Topnav.vue';

// Get the current route
const route = useRoute();

// Determine whether to show the sidebar based on the route
const showSidebar = computed(() => {
  return !['/login', '/register'].includes(route.path);
});

// Determine whether to show the top navigation based on the route
const showTopnav = computed(() => {
  return !['/login', '/register'].includes(route.path);
});
</script>

<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Make the app container take up the full viewport height */
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden; /* Ensure content container takes up remaining space and hides overflow */
}

Sidebar {
  position: fixed; /* Fix the sidebar in position */
  top: 0;
  left: 0;
  height: 100vh; /* Make the sidebar full height */
  width: var(--sidebar-width); /* Define the width of the sidebar */
  background: var(--dark-alt);
}

main {
  flex: 1;
  padding: 2rem;
  background: var(--light);
 /* Add margin to the main content to avoid overlap with fixed sidebar */
  overflow-y: auto; /* Ensure only the main content scrolls */
  display: flex;
  justify-content: center; /* Center the content horizontally */
  align-items: center; /* Center the content vertically */
  
  
  @media (max-width: 1024px) {
    padding-left: 6rem;
  }
}

main.no-sidebar {
  padding-left: 0; /* Remove padding when sidebar is hidden */
  margin-left: 0; /* Remove margin when sidebar is hidden */
}

main > router-view {
  width: 100%;
  height: 100%; /* Ensure the router-view takes up full available height */
}
</style>
