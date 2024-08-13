import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Home from '@/views/HomeView.vue';
import GIS from '@/views/GIS.vue';
import About from '@/views/AboutView.vue';
import Report from '@/views/Report.vue';
import Manage from '@/views/Manage.vue';
import PendingGovernment from '@/views/PendingGovernment.vue';
import ApprovedGovernment from '@/views/ApprovedGovernment.vue';
import DeclinedGovernment from '@/views/DeclinedGovernment.vue';
import PendingPrivate from '@/views/PendingPrivate.vue';
import ApprovedPrivate from '@/views/ApprovedPrivate.vue';
import DeclinedPrivate from '@/views/DeclinedPrivate.vue';
import TreeCuttingAppointment from '../views/TreeCuttingAppointment.vue';

// Define routes
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/gis',
    name: 'GIS',
    component: GIS,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/report',
    name: 'Report',
    component: Report,
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage,
  },
  {
    path: '/treecuttingappointment',
    component: TreeCuttingAppointment,
    redirect: '/treecuttingappointment/pendingGovernment',
    children: [
      {
        path: 'pendingGovernment',
        component: PendingGovernment,
      },
      {
        path: 'approvedGovernment',
        component: ApprovedGovernment,
      },
      {
        path: 'declinedGovernment',
        component: DeclinedGovernment,
      },
      {
        path: 'pendingPrivate',
        component: PendingPrivate,
      },
      {
        path: 'approvedPrivate',
        component: ApprovedPrivate,
      },
      {
        path: 'declinedPrivate',
        component: DeclinedPrivate,
      },
    ],
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
