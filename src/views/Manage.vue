<template>
    <div class="main-container">
      <div class="content">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Approve</th>
              <th>Decline</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in pendingUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                <img v-if="user.image" :src="'http://127.0.0.1:8000/storage/' + user.image" alt="User Image" />
              </td>
              <td>{{ user.firstname }}</td>
              <td>{{ user.lastname }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button @click="approveUser(user.id)" class="btn-approve">
                  <span class="material-icons">check</span>
                </button>
              </td>
              <td>
                <button @click="declineUser(user.id)" class="btn-decline">
                  <span class="material-icons">cancel</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Manage_userComponent',
    data() {
      return {
        users: [],
        pendingUsers: [],
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://127.0.0.1:8000/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          this.users = response.data;
          this.pendingUsers = this.users.filter(user => user.status === 'pending');
        } else {
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        this.$router.push('/login');
      }
    },
    methods: {
      async approveUser(userId) {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`http://127.0.0.1:8000/api/approve-user/${userId}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          this.pendingUsers = this.pendingUsers.filter(user => user.id !== userId);
        } catch (error) {
          console.error('Error approving user:', error);
        }
      },
      async declineUser(userId) {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`http://127.0.0.1:8000/api/decline-user/${userId}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          this.pendingUsers = this.pendingUsers.filter(user => user.id !== userId);
        } catch (error) {
          console.error('Error declining user:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    height: 100vh; /* Full viewport height */
    flex-direction: column;
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
  
  .content {
    margin-left: 10px; /* Sidebar width */
    margin-top: 60px; /* Height of the top navbar */
    padding: 20px;
    flex: 1;
    overflow-y: auto; /* Enable scrolling if content overflows */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  /* Keep only row borders */
  thead th {
    border-bottom: 1px solid #ddd;
  }
  
  tbody td {
    border-bottom: 1px solid #ddd;
  }
  
  /* Remove column borders */
  th, td {
    padding: 8px;
  }
  
  /* Add background color to header cells */
  th {
    background-color: #f2f2f2;
  }
  
  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }
  
  /* Approve and Decline buttons */
  .btn-approve, .btn-decline {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
  }
  
  .btn-approve {
    color: green;
  }
  
  .btn-decline {
    color: red;
  }
  </style>
  