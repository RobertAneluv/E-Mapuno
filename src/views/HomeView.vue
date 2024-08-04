<template>
  <div class="main-container">
    <div class="content">
      <h2>DASHBOARD</h2>
      <div class="cards-container">
        <div class="card">
          <h3>Tree Tagger Available</h3>
          <p>{{ approvedCount }}</p>
        </div>
        <div class="card">
          <h3>Tree Tagger Request Access</h3>
          <p>{{ pendingCount }}</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'HomeComponent',
  components: {
   
  },
  data() {
    return {
      approvedCount: 0,
      pendingCount: 0,
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const approvedResponse = await axios.get('http://127.0.0.1:8000/api/auth/approved-users-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.approvedCount = approvedResponse.data.count;

        const pendingResponse = await axios.get('http://127.0.0.1:8000/api/auth/pending-users-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.pendingCount = pendingResponse.data.count;
      } else {
        if (this.$router.currentRoute.path !== '/login') {
          this.$router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      if (this.$router.currentRoute.path !== '/login') {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}

/* Fix the top navbar */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure it's on top of the side navbar */
}

/* Adjust the layout to accommodate the fixed top navbar */
.navbar {
  position: fixed;
  top: 60px; /* Height of the top navbar */
  left: 0;
  width: 200px; /* Sidebar width */
  height: calc(100vh - 60px); /* Full height minus the top navbar */
  z-index: 500; /* Ensure it's below the top navbar but above the content */
}

/* Content area */
.content {
  margin-left: 10px; /* Sidebar width */
  margin-top: 60px; /* Height of the top navbar */
  padding: 20px;
  flex: 1;
  overflow-y: auto; /* Enable scrolling if content overflows */
}

.cards-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.card {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

.card h3 {
  margin-bottom: 10px;
}

.card p {
  font-size: 24px;
  font-weight: bold;
}
</style>
