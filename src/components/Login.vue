<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="outer-box">
            <div class="logo-box">
              <!-- Add your logo here -->
              <img :src="require('@/assets/logofinal.png')" alt="Logo" class="logo" />
              <h2 class="text-center mb-4">Welcome Let's get Started!</h2>
            </div>
            <div class="inner-box">
             
              <form @submit.prevent="login" class="login-form">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" v-model="email" id="email" class="form-control" required />
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" v-model="password" id="password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-login">Login</button>
              </form>
              <div class="login-link mt-3">
                <span>No Account Yet?</span>
                <a @click="goToRegister" class="btn btn-link">Register</a>
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
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
            email: this.email,
            password: this.password
          });
          localStorage.setItem('token', response.data.access_token);
          this.$router.push('/home');
        } catch (error) {
          console.error('Login error:', error.response.data);
        }
      },
      goToRegister() {
        this.$router.push('/register');
      }
    },
  };
  </script>
  
  <style scoped>
  .outer-box {
    background-color: #325F62; /* Light green color */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
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
  .btn-login {
    background-color: #325F62; /* Light green color */
    border: none;
    color: #000;
    border-radius: 50px; /* 50% border-radius */
    padding: 10px 120px; /* Adjust padding as needed */
    font-size: 16px; /* Adjust font size as needed */
    margin-top: 10px; /* Add margin to the top */
  }
  
  .btn-login:hover {
    background-color: #007060; /* Darker green on hover */
    color: #fff;
  }
  
  .form-control {
    margin-bottom: 15px;
  }
  
  .btn-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .btn-link:hover {
    text-decoration: underline;
  }
  
  .login-link {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
  </style>
  