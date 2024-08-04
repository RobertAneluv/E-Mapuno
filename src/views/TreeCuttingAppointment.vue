<template>
  <div class="container-fluid">
    <TreeCuttingNavBar />
    <div class="row no-gutters">
      <div class="col">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import TreeCuttingNavBar from '@/components/TreeCuttingNavBar.vue';

export default {
  name: 'TreeCuttingAppointment',
  components: {
    TreeCuttingNavBar
  }
};
</script>

<style scoped>
.container-fluid {
  padding: 0;
}

.row {
  margin: 0;
}

.col {
  padding: 0;
  bottom: 170px;
}

nav {
  position: fixed;
  top: 80px; /* Height of the top navbar */
  left: 350px;
  width: 200px; /* Sidebar width */
  height: calc(100vh - 60px); /* Full height minus the top navbar */
  z-index: 500;  /* Ensure there's no margin below the nav */
}


.no-gutters {
  margin: 0;
  padding: 0;
}
</style>
