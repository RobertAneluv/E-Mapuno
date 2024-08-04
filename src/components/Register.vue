<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="outer-box">
            <div class="logo-box">
              <img :src="require('@/assets/logofinal.png')" alt="Logo" class="logo" />
              <h2 class="text-center mb-4">Create Account</h2>
            </div>
            <div class="inner-box">
              <form @submit.prevent="register" class="register-form" enctype="multipart/form-data">
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="firstname">First Name</label>
                    <input type="text" v-model="firstname" id="firstname" class="form-control" required />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="lastname">Last Name</label>
                    <input type="text" v-model="lastname" id="lastname" class="form-control" required />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="middlename">Middle Name</label>
                    <input type="text" v-model="middlename" id="middlename" class="form-control" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" id="email" class="form-control" required />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" id="password" class="form-control" required />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="password_confirmation">Confirm Password</label>
                    <input type="password" v-model="password_confirmation" id="password_confirmation" class="form-control" required />
                  </div>
                </div>
                <div class="form-group col-md-12">
                  <label for="profileImage">Profile Image</label>
                  <input type="file" @change="handleFileUpload" id="profileImage" class="form-control" />
                </div>
                <button type="submit" class="btn btn-register">Create Account</button>
              </form>
              <div class="login-link mt-3">
                <span>Already have an account?</span>
                <a @click="goToLogin" class="btn btn-link">Log In</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Register',
    data() {
      return {
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        this.image = event.target.files[0];
      },
      async register() {
        const formData = new FormData();
        formData.append('firstname', this.firstname);
        formData.append('middlename', this.middlename);
        formData.append('lastname', this.lastname);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('password_confirmation', this.password_confirmation);
        if (this.image) {
          formData.append('image', this.image);
        }
  
        try {
          await axios.post('http://127.0.0.1:8000/api/auth/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.$router.push('/login');
        } catch (error) {
          console.error('Registration failed:', error.response.data);
        }
      },
      goToLogin() {
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  
  <style scoped>
  .outer-box {
    background-color: #325F62; /* Light green color */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    width: 100%; /* Full width of its parent */
    max-width: 600px; /* Maximum width of the outer box */
    margin: 0 auto; /* Center the outer box */
  }
  
  .logo-box {
    margin-bottom: 20px;
  }
  
  .logo {
    width: 200px; /* Adjust the logo size as needed */
    height: 70px;
  }
  
  .inner-box {
    padding: 20px;
    border-radius: 8px;
    background-color: #f8f9fa; /* Light grey background for form */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }
  
  .form-group {
    flex: 1;
    padding: 0 10px;
  }
  
  .btn-register {
    background-color: #325F62; /* Light green color */
    border: none;
    color: #000;
    border-radius: 50px; /* 50% border-radius */
    padding: 10px 120px; /* Adjust padding as needed */
    font-size: 16px; /* Adjust font size as needed */
    margin-top: 10px; /* Add margin to the top */
  }
  
  .btn-register:hover {
    background-color: #007060; /* Darker green on hover */
    color: #fff;
  }
  
  .btn-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .btn-link:hover {
    text-decoration: underline;
  }
  
  .login-link {
    margin-top: 20px;
  }
  
  </style>
  