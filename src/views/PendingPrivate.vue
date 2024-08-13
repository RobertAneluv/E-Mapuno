<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Location</th>
                <th>Accomplish Requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in pendingPrivate" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.user.name }}</td>
                <td>{{ item.app_Loc }}</td>
                <td><button type="button" class="btn btn-primary" @click="openModal(item)">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Main Modal for Accomplish Requirements -->
      <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content" v-if="approvalPrivate">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Accomplish Requirements</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- Headers for columns -->
              <div class="row mb-3">
                <div class="col-4">
                  <h5 style="margin-left: 1rem">REQUIREMENTS</h5>
                </div>
                <div class="col-2">
                  <h5 style="margin-left: 1rem">IMAGE</h5>
                </div>
                <div class="col-3">
                  <h5 style="margin-left: 0.5rem">COMPLIANT</h5>
                </div>
                <div class="col-3">
                  <h5 style="margin-left: 0.5rem">REMARKS</h5>
                </div>
              </div>

              <!-- Row for each requirement -->
              <div v-for="(requirement, key) in requirements" :key="key" class="row mb-3">
                <div class="col-4">
                  <p style="margin-left: 1rem"><strong>{{ requirement.name }}</strong></p>
                </div>
                <div class="col-2">
                  <button class="btn btn-primary" @click="showImage(requirement.key)">View Image</button>
                </div>
                <div class="col-3">
                  <input type="radio" :id="requirement.key + '_yes'" value="Yes" v-model="approvalPrivate[requirement.compliant]">
                  <label :for="requirement.key + '_yes'">Yes</label>
                  <input type="radio" :id="requirement.key + '_no'" value="No" v-model="approvalPrivate[requirement.compliant]">
                  <label :for="requirement.key + '_no'">No</label>
                </div>
                <div class="col-3">
                  <input type="text" class="form-control" v-model="approvalPrivate[requirement.remarks]">
                </div>
              </div>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="confirmDeclined(approvalPrivate)">Decline</button>
              <button type="button" class="btn btn-primary" @click="calendarModal()" :disabled="!allCompliant">Schedule</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <img :src="imageUrl" alt="Image Preview" style="max-width: 100%;">
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Modal for Approval Date -->
      <div class="modal fade" id="calendarModal" tabindex="-1" role="dialog" aria-labelledby="calendarModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Appointment Date</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="calendarModalClose">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input type="date" class="form-control" v-if="approvalPrivate" v-model="approvalPrivate.app_Date">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="Approved()">Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { API_URL } from '../config';
  
  export default {
    setup() {
      const pendingPrivate = ref([]);
      const approvalPrivate = ref(null);
      const showImageKey = ref('');
      const imageUrl = ref('');
  
      const requirements = ref([
        { name: "Application letter (1 original)", key: 'app_letter', compliant: 'app_letter_compliant', remarks: 'app_letter_remarks' },
        { name: "Authenticated Copy of Land Title", key: 'land_Title', compliant: 'land_Title_compliant', remarks: 'land_Title_remarks' },
        { name: "LGU Endorsement/Certification of No objection (1 original) *City/Municipal/Brgy/LGU", key: 'endorsement_Certification', compliant: 'endorsement_Certification_compliant', remarks: 'endorsement_Certification_remarks' },
        { name: "Homeowner's resolution (1 original)", key: 'homeowner_Reso', compliant: 'homeowner_Reso_compliant', remarks: 'homeowner_Reso_remarks' },
        { name: "PTA Resolution or Resolution from any organize group of No Objection and Reason for Cutting (1 original)", key: 'resolution', compliant: 'resolution_compliant', remarks: 'resolution_remarks' },
      ]);
  
      const fetchPendingPrivate = async () => {
        try {
          const response = await axios.get(`${API_URL}/pendingPrivate`);
          pendingPrivate.value = response.data.PendingPrivate;
        } catch (error) {
          console.error('Error fetching pending private tree cuttings:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while fetching the data!',
          });
        }
      };
  
      onMounted(() => {
        fetchPendingPrivate();
      });
  
      const allCompliant = computed(() => {
        return requirements.value.every(req => approvalPrivate.value[req.compliant] === 'Yes');
      });
  
      const openModal = (item) => {
        approvalPrivate.value = { ...item };
        $('#editModal').modal('show');
      };
  
      const closeModal = () => {
        $('#editModal').modal('hide');
      };
  
      const calendarModal = () => {
        $('#editModal').modal('hide');
        $('#calendarModal').modal('show');
      };
  
      const calendarModalClose = () => {
        $('#calendarModal').modal('hide');
        $('#editModal').modal('show');
      };
  
      const showImage = (key) => {
        imageUrl.value = approvalPrivate.value[`${key}_file`]; // assuming the image URL is stored with `_file` suffix
        $('#imageModal').modal('show');
      };
  
      const Approved = async () => {
        try {
          await axios.put(`${API_URL}/approvedPrivate/${approvalPrivate.value.id}`, approvalPrivate.value);
          fetchPendingPrivate();
          $('#calendarModal').modal('hide');
          Swal.fire({
            title: 'Tree cutting appointment approved!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error approving tree cutting appointment:', error);
        }
      };
  
      const Declined = async (item) => {
        try {
          const requestData = {
            app_letter_compliant: item.app_letter_compliant,
            app_letter_remarks: item.app_letter_remarks,
            land_Title_compliant: item.land_Title_compliant,
            land_Title_remarks: item.land_Title_remarks,
            endorsement_Certification_compliant: item.endorsement_Certification_compliant,
            endorsement_Certification_remarks: item.endorsement_Certification_remarks,
            homeowner_Reso_compliant: item.homeowner_Reso_compliant,
            homeowner_Reso_remarks: item.homeowner_Reso_remarks,
            resolution_compliant: item.resolution_compliant,
            resolution_remarks: item.resolution_remarks,
          };
  
          await axios.put(`${API_URL}/declinedPrivate/${item.id}`, requestData);
          fetchPendingPrivate();
        } catch (error) {
          console.error('Error declining tree:', error);
        }
      };
  
      const confirmDeclined = (item) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, decline it!'
        }).then((result) => {
          if (result.isConfirmed) {
            Declined(item);
            Swal.fire({
              title: 'Tree cutting appointment declined!',
              icon: 'success',
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false
            });
          }
        });
      };
  
      return {
        pendingPrivate,
        approvalPrivate,
        requirements,
        imageUrl,
        allCompliant,
        fetchPendingPrivate,
        openModal,
        closeModal,
        calendarModal,
        calendarModalClose,
        showImage,
        Approved,
        Declined,
        confirmDeclined,
      };
    }
  };
  </script>