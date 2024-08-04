import { createApp } from 'vue';
import App from './App.vue';
import Axios from 'axios';
import router from './router';

// Create the Vue application instance
const app = createApp(App);

// Configure Axios
Axios.defaults.baseURL = 'http://127.0.0.1:8000/api/auth';
Axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

// Add the Axios instance to the app's global properties for global access
app.config.globalProperties.$http = Axios;
app.config.globalProperties.$axios = Axios;

// Use the router
app.use(router);

// Mount the Vue application instance
app.mount('#app');
