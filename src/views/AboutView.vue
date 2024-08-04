<template>
  <main id="about-page">
    <h1>About</h1>
    <p>This is the about page</p>
  </main>
</template>

<script setup>
</script>

<style scoped>
#about-page {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  background-color: var(--light); /* Background color */
  overflow: hidden; /* Prevent overflow */
  text-align: center; /* Center text */
}

h1 {
  margin-bottom: 1rem; /* Space between the title and the paragraph */
  font-size: 2rem; /* Font size for the title */
}

p {
  font-size: 1rem; /* Font size for the paragraph */
}
</style>
