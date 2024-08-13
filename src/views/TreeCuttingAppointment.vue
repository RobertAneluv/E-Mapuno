<template>
  <div class="container-fluid">
    <div v-if="isGovernmentRoute">
      <GovernmentNav />
    </div>
    <div v-else-if="isPrivateRoute">
      <PrivateNav />
    </div>
    <div class="row no-gutters">
      <div class="col">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import GovernmentNav from '@/components/GovernmentNav.vue';
import PrivateNav from '@/components/PrivateNav.vue';

export default {
  components: {
    GovernmentNav,
    PrivateNav,
  },
  setup() {
    const route = useRoute();
    const isGovernmentRoute = computed(() =>
      route.path.includes('/treecuttingappointment/pendingGovernment') ||
      route.path.includes('/treecuttingappointment/approvedGovernment') ||
      route.path.includes('/treecuttingappointment/declinedGovernment')
    );

    const isPrivateRoute = computed(() =>
      route.path.includes('/treecuttingappointment/pendingPrivate') ||
      route.path.includes('/treecuttingappointment/approvedPrivate') ||
      route.path.includes('/treecuttingappointment/declinedPrivate')
    );

    return {
      isGovernmentRoute,
      isPrivateRoute,
    };
  },
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
