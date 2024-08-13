<template>
    <div>
      <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
        <div class="menu-toggle-wrap">
          <button class="menu-toggle" @click="ToggleMenu">
            <span class="material-icons">{{ is_expanded ? 'menu' : 'keyboard_double_arrow_right' }}</span>
          </button>
        </div>
  
        <h3>Main</h3>
        <div class="menu">
          <router-link to="/home" class="button">
            <span class="material-icons">home</span>
            <span class="text">Home</span>
          </router-link>
          <router-link to="/manage" class="button">
            <span class="material-icons">group</span>
            <span class="text">Manage User</span>
          </router-link>
          <router-link to="/gis" class="button">
            <span class="material-icons">near_me</span>
            <span class="text">GIS</span>
          </router-link>
          <router-link to="/report" class="button">
            <span class="material-icons">description</span>
            <span class="text">Reports</span>
          </router-link>
          <div class="dropdown">
            <div class="button" @click="toggleDropdownTree">
              <span class="material-icons">menu</span>
              <span class="text">Tree Cutting Appointment</span>
              <span class="material-icons arrow">{{ showDropdownTree ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            </div>
            <div class="dropdown-content" v-if="showDropdownTree">
              <router-link to="/treecuttingappointment/pendingGovernment" class="button"> <span class="text">Government Agency</span></router-link>
              <router-link to="/treecuttingappointment/pendingPrivate" class="button"> <span class="text">Private Individual</span></router-link>
            </div>
          </div>
        </div>
  
        <div class="flex"></div>
  
        <h3 class="up">Settings</h3>
        <div class="menu">
          <router-link to="/notifications" class="button">
            <span class="material-icons">notifications</span>
            <span class="text">Notification</span>
          </router-link>
          <div class="dropdown">
            <div class="button" @click="toggleDropdownLogout">
              <span class="material-icons">settings</span>
              <span class="text">Settings</span>
              <span class="material-icons arrow">{{ showDropdownLogout ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            </div>
            <div class="dropdown-content" v-if="showDropdownLogout">
              <div class="button" @click="confirmLogout">
                <span class="text">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import Swal from 'sweetalert2'
  
  const is_expanded = ref(localStorage.getItem("is_expanded") === "true")
  
  const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
    localStorage.setItem("is_expanded", is_expanded.value)
    document.documentElement.style.setProperty('--map-width', is_expanded.value ? 'calc(100% - 250px)' : 'calc(100% - 80px)');
  }
  
  const showDropdownTree = ref(false)
  const toggleDropdownTree = () => {
    showDropdownTree.value = !showDropdownTree.value
  }
  
  const showDropdownLogout = ref(false)
  const toggleDropdownLogout = () => {
    showDropdownLogout.value = !showDropdownLogout.value
  }
  
  const confirmLogout = () => {
    Swal.fire({
      title: 'Do you want to log out?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/login'
      }
    })
  }
  
  // Watch for changes in `is_expanded` and update the `MapView`
  watch(is_expanded, (newValue) => {
    document.documentElement.style.setProperty('--map-width', newValue ? 'calc(100% - 250px)' : 'calc(100% - 80px)');
  });
  </script>
  
  <style lang="scss" scoped>
  aside {
    display: flex;
    flex-direction: column;
    background-color: var(--light);
    color: var(--light);
    width: calc(2rem + 32px);
    overflow: hidden;
    min-height: 100vh;
    padding: 1rem;
    transition: 0.2s ease-in-out;
    border-right: none; /* Default no border */
    margin-top: 1px;
  
    &.is-expanded {
      width: var(--sidebar-width);
      border-right: 1px solid grey; /* Add grey border when expanded */
    }
  
    .up {
      margin-top: 90px;
    }
  
    .menu-toggle-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      position: relative;
      top: 0;
      transition: 0.2s ease-in-out;
  
      .menu-toggle {
        transition: 0.2s ease-in-out;
        margin-top: 10px;
        .material-icons {
          font-size: 2rem;
          color: var(--dark);
          transition: 0.2s ease-out;
        }
  
        &:hover {
          .material-icons {
            color: var(--primary);
            transform: translateX(0.5rem);
          }
        }
      }
    }
  
    h3, .button .text {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
  
    h3 {
      color: var(--grey);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
  
    .menu {
      margin: 0 -1rem;
  
      .button {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: 0.2s ease-in-out;
        padding: 0.5rem 1rem;
  
        .material-icons {
          font-size: 1.5rem;
          color: var(--dark);
          transition: 0.2s ease-in-out;
        }
        .text {
          color: var(--dark-alt);
          transition: 0.2s ease-in-out;
        }
  
        &:hover {
          background-color: var(--light);
          .material-icons, .text {
            color: #325F62;
          }
        }
  
        &.router-link-exact-active {
          background-color: var(--light);
          border-right: 5px solid #325F62;
          .material-icons, .text {
            color: #325F62;
          }
        }
      }
    }
  
    .footer {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
  
      p {
        font-size: 0.875rem;
        color: var(--grey);
      }
    }
  
    &.is-expanded {
      width: var(--sidebar-width);
  
      .menu-toggle-wrap {
        top: -3rem;
        .menu-toggle {
          transform: rotate(-180deg);
        }
      }
  
      h3, .button .text {
        opacity: 1;
      }
  
      .button {
        .material-icons {
          margin-right: 1rem;
        }
      }
  
      .footer {
        opacity: 0;
      }
    }
  
    @media (max-width: 1024px) {
      position: absolute;
      z-index: 99;
    }
  }
  
  .dropdown {
    position: relative;
    display: block;
  }
  
  .dropdown .button {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .arrow {
    margin-left: auto;
  }
  
  .dropdown-content {
    display: block;
    background-color: var(--light);
    position: absolute;
  }
  
  .dropdown-item {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-item:hover {
    background-color: #f1f1f1;
  }
  
  .dropdown-content {
    margin-top: 0.5rem;
  }
  </style>
  