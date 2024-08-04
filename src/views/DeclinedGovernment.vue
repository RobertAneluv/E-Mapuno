<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Agency</th>
              <th>Location</th>
              <th>Declined by</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in declinedGovernment.data" :key="item.id">
              <td>{{ (declinedGovernment.current_page - 1) * declinedGovernment.per_page + index + 1 }}</td>
              <td>{{ item.user.firstname }}</td>
              <td>{{ item.app_Agency }}</td>
              <td>{{ item.app_Loc }}</td>
              <td>{{ item.admin.firstname }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <nav class="pagination-controls" aria-label="Page navigation">
          <button 
            class="btn btn-primary" 
            @click="fetchDeclinedGovernment(declinedGovernment.current_page - 1)" 
            :disabled="declinedGovernment.current_page === 1">
            Previous
          </button>
          <span>Page {{ declinedGovernment.current_page }} of {{ declinedGovernment.last_page }}</span>
          <button 
            class="btn btn-primary" 
            @click="fetchDeclinedGovernment(declinedGovernment.current_page + 1)" 
            :disabled="declinedGovernment.current_page === declinedGovernment.last_page">
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

export default {
  setup() {
    const declinedGovernment = ref({
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 10
    });

    const fetchDeclinedGovernment = async (page = 1) => {
      try {
        const response = await axios.get(`${API_URL}/declinedGovernment?page=${page}`);
        // Ensure response.data.DeclinedGovernment has the correct structure
        declinedGovernment.value = response.data.DeclinedGovernment;
      } catch (error) {
        console.error('Error fetching declined government tree cuttings:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while fetching the data!',
        });
      }
    };

    onMounted(() => {
      fetchDeclinedGovernment();
    });

    return {
      declinedGovernment,
      fetchDeclinedGovernment,
    };
  },
};
</script>

<style scoped>
.table {
  border-collapse: collapse; /* Ensure borders are collapsed to avoid double lines */
  width: 76%; /* Ensure the table takes full width */
  position: fixed; /* Fix the table's position relative to the viewport */
  top: 8rem;
}

.table thead th {
  font-size: 0.875rem; /* Smaller font size for table headers */
  background-color: #325F62; /* Light green background color */
  border: none; /* Remove all borders */
  padding: 0.5rem; /* Add some padding for better spacing */
  color: white;
}

.table tbody td {
  font-size: 0.875rem; /* Smaller font size for table cells */
  border: none; /* Remove all borders */
  padding: 0.5rem; /* Add some padding for better spacing */
}

.table tbody tr {
  border-bottom: 1px solid #e0e0e0; /* Light grey bottom border for rows */
}

.pagination-controls {
  position: fixed; /* Fix to the bottom of the viewport */
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.pagination-controls button {
  margin: 0 0.5rem;
}

.pagination-controls span {
  margin: 0 0.5rem;
}

.page-item {
  display: inline-block;
  margin: 0 0.25rem; /* Adjust spacing between pagination items */
}

.page-link {
  color: #007bff;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
}

.page-link:hover {
  background-color: #e9ecef; /* Add background on hover */
  border-radius: 0.25rem;
}

.page-item.disabled .page-link {
  color: #6c757d; /* Gray out disabled pagination links */
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-radius: 0.25rem;
}
</style>
