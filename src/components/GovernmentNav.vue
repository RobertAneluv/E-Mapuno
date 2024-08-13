<template>
  <nav>
    <ul>
      <li><router-link to="/treecuttingappointment/pendingGovernment">Pending</router-link></li>
      <li><router-link to="/treecuttingappointment/approvedGovernment">Approved</router-link></li>
      <li><router-link to="/treecuttingappointment/declinedGovernment">Declined</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'GovernmentNav'
}
</script>

<style scoped>
nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}

nav ul li a {
  text-decoration: none;
  color: #000;
  padding: 5px 10px;
  transition: color 0.3s, background-color 0.3s, border-bottom 0.3s;
}

nav ul li a:hover,
nav ul li a:focus,
nav ul li a.router-link-active {
  background-color: #f0f0f0;
  border-bottom: 2px solid green;
}
</style>
