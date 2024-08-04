<template>
    <div class="top-navbar">
      <img :src="require('@/assets/logofinal.png')" alt="Logo" class="logo" />
      <div class="user-info" v-if="user">
        <!-- Show profile image from the database -->
        <img class="profile-image" v-if="user.image" :src="'http://127.0.0.1:8000/storage/' + user.image" alt="User Image" />
        <span class="user-name">{{ user.firstname }} {{ user.lastname }}</span>
        <div class="dropdown">
          <button class="dropdown-button" @click="toggleDropdown">▼</button>
          <div class="dropdown-menu" v-if="dropdownVisible">
            <a @click="showUpdateForm">Update Profile</a>
            <a @click="logout">Logout</a>
          </div>
        </div>
      </div>
      <div v-else>
        <span>Loading...</span>
      </div>
  
      <!-- Update Profile Form -->
      <div class="update-form" v-if="showUpdateProfile">
        <form @submit.prevent="updateProfile">
          <label>First Name:</label>
          <input type="text" v-model="updateData.firstname" required />
          <label>Middle Name:</label>
          <input type="text" v-model="updateData.middlename" />
          <label>Last Name:</label>
          <input type="text" v-model="updateData.lastname" required />
          <label>Email:</label>
          <input type="email" v-model="updateData.email" required />
          <label>Profile Image:</label>
          <input type="file" @change="handleFileUpload" />
          <button type="submit">Update</button>
          <button type="button" @click="cancelUpdate">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TopNavComponent',
    data() {
      return {
        user: null,
        dropdownVisible: false,
        showUpdateProfile: false,
        updateData: {
          firstname: '',
          middlename: '',
          lastname: '',
          email: '',
          image: null
        }
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://127.0.0.1:8000/api/auth/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          this.user = response.data;
          this.updateData = { ...response.data, image: null };
        } else {
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        this.$router.push('/login');
      }
    },
    methods: {
      toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
      },
      showUpdateForm() {
        this.showUpdateProfile = true;
        this.dropdownVisible = false;
      },
      cancelUpdate() {
        this.showUpdateProfile = false;
      },
      handleFileUpload(event) {
        this.updateData.image = event.target.files[0];
      },
      async updateProfile() {
        try {
          const token = localStorage.getItem('token');
          const formData = new FormData();
          formData.append('firstname', this.updateData.firstname);
          formData.append('middlename', this.updateData.middlename);
          formData.append('lastname', this.updateData.lastname);
          formData.append('email', this.updateData.email);
          if (this.updateData.image) {
            formData.append('image', this.updateData.image);
          }
          const response = await axios.post('http://127.0.0.1:8000/api/auth/update-profile', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          this.user = response.data;
          this.showUpdateProfile = false;
        } catch (error) {
          console.error('Error updating profile:', error.response ? error.response.data : error.message);
        }
      },
      async logout() {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          localStorage.removeItem('token');
          this.$router.push('/login');
        } catch (error) {
          console.error('Error logging out:', error.response ? error.response.data : error.message);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .top-navbar {
    display: flex;
    align-items: center;
    background-color: #325F62; /* Light green color */
    padding: 10px 20px;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: space-between;
  }
  
  .logo {
    height: 45px;
    margin-left: 70px;

  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .profile-image {
    height: 40px; /* Adjust the profile image size as needed */
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .user-name {
    color: #fff;
    font-weight: bold;
   
  }
  
  .dropdown {
    position: relative;
    display: inline-block;
    margin-right: 100px;
  }
  
  .dropdown-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
  }
  
  .dropdown-menu {
    display: block;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 1;
    right: 0;

  }
  
  .dropdown-menu a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-menu a:hover {
    background-color: #f1f1f1;
  }
  
  .update-form {
    position: absolute;
    top: 60px;
    right: 20px;
    background: white;
    padding: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  
  .update-form form {
    display: flex;
    flex-direction: column;
  }
  
  .update-form label {
    margin-bottom: 5px;
  }
  
  .update-form input[type="text"],
  .update-form input[type="email"],
  .update-form input[type="file"] {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ddd;
  }
  
  .update-form button {
    margin-top: 10px;
    padding: 10px;
    border: none;
    background-color: #4ade80;
    color: white;
    cursor: pointer;
  }
  
  .update-form button[type="button"] {
    background-color: #f44336;
  }
  </style>
  