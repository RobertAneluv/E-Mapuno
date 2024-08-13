<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Date Schedule</th>
                            <th>Location</th>
                            <th>Approved by</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in approvedPrivate" :key="item.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.user.firstname }}</td>
                            <td>{{ item.app_Date }}</td>
                            <td>{{ item.app_Loc }}</td>
                            <td>{{ item.admin.firstname }}</td>
                        </tr>
                    </tbody>
                </table>
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
        const approvedPrivate = ref([]);
        const fetchApprovedPrivate = async () => {
          try {
            const response = await axios.get(`${API_URL}/approvedPrivate`);
            approvedPrivate.value = response.data.ApprovedPrivate;
          } catch (error) {
            console.error('Error fetching pending government tree cuttings:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong while fetching the data!',
            });
          }
        };
        onMounted(() => {
            fetchApprovedPrivate();
        });
        return {
            approvedPrivate,
        };
      },
    };
    </script>