<template>
  <div class="container-fluid">
    <div class="table-wrapper">
      <table class="table table-striped table-bordered">
        <thead class="thead-light">
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Agency</th>
            <th>Location</th>
            <th>Accomplish Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pendingGovernment.data" :key="item.id">
            <td>{{ index + 1 + (pendingGovernment.current_page - 1) * pendingGovernment.per_page }}</td>
            <td>{{ item.user.firstname }}</td>
            <td>{{ item.app_Agency }}</td>
            <td>{{ item.app_Loc }}</td>
            <td><a href="#" @click.prevent="openModal(item)">View Requirements</a></td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <nav class="pagination-controls" aria-label="Page navigation">
        <button class="btn btn-primary" @click="fetchPendingGovernment(pendingGovernment.current_page - 1)" :disabled="pendingGovernment.current_page === 1">Previous</button>
        <span>Page {{ pendingGovernment.current_page }} of {{ totalPages }}</span>
        <button class="btn btn-primary" @click="fetchPendingGovernment(pendingGovernment.current_page + 1)" :disabled="pendingGovernment.current_page === pendingGovernment.last_page">Next</button>
      </nav>
    </div>

    <!-- Main Modal for Accomplish Requirements -->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content" v-if="approvalGovernment">
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
                <h5>REQUIREMENTS</h5>
              </div>
              <div class="col-2">
                <h5>IMAGE</h5>
              </div>
              <div class="col-3">
                <h5>COMPLIANT</h5>
              </div>
              <div class="col-3">
                <h5>REMARKS</h5>
              </div>
            </div>

            <!-- Row for each requirement -->
            <div v-for="(requirement, key) in requirements" :key="key" class="row mb-3">
              <div class="col-4">
                <p><strong>{{ requirement.name }}</strong></p>
              </div>
              <div class="col-2">
                <a href="#" @click.prevent="showImage(requirement.key)">View</a>
              </div>
              <div class="col-3">
                <input type="radio" :id="requirement.key + '_yes'" value="Yes" v-model="approvalGovernment[requirement.compliant]">
                <label :for="requirement.key + '_yes'">Yes</label>
                <input type="radio" :id="requirement.key + '_no'" value="No" v-model="approvalGovernment[requirement.compliant]">
                <label :for="requirement.key + '_no'">No</label>
              </div>
              <div class="col-3">
                <input type="text" class="form-control form-control-sm" v-model="approvalGovernment[requirement.remarks]">
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="confirmDeclined(approvalGovernment)">Decline</button>
            <button type="button" class="btn btn-primary" @click="calendarModal()" :disabled="!allCompliant">Schedule</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Separate Modal for Image -->
    <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <img :src="imageUrl" alt="Image Preview" class="img-fluid">
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Modal for Approval Date -->
    <div class="modal fade" id="calendarModal" tabindex="-1" role="dialog" aria-labelledby="calendarModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Appointment Date</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="calendarModalClose">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="date" class="form-control form-control-sm" v-if="approvalGovernment" v-model="approvalGovernment.app_Date">
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
    const pendingGovernment = ref({});
    const approvalGovernment = ref(null);
    const showImageKey = ref('');
    const imageUrl = ref('');

    const requirements = ref([
      { name: "Application letter (1 original)", key: 'app_letter', compliant: 'app_letter_compliant', remarks: 'app_letter_remarks' },
      { name: "LGU Endorsement/Certification of No objection (1 original) *Brgy or Municipal LGU", key: 'endorsement_Certification', compliant: 'endorsement_Certification_compliant', remarks: 'endorsement_Certification_remarks' },
      { name: "Approved Site Dev't Plan/Infrastructure Plan w/ tree charting (1 original)", key: 'siteDevtPlan', compliant: 'siteDevtPlan_compliant', remarks: 'siteDevtPlan_remarks' },
      { name: "ECC/CNC, if applicable. The DENR RO/EMB shall determine if the tree cutting activities will require ECC/CNC based on the extent of tree cutting operations, location (e.g. Environmentally Critical Area), among others, if necessary (1 certified copy)", key: 'ECC_CNC', compliant: 'ECC_CNC_compliant', remarks: 'ECC_CNC_remarks' },
      { name: "Free, Prior & Informed Consent (FPIC), if applicable", key: 'FPIC', compliant: 'FPIC_compliant', remarks: 'FPIC_remarks' },
      { name: "Waiver/Consent of owner/s, if titled property (1 original)", key: 'consent', compliant: 'consent_compliant', remarks: 'consent_remarks' },
      { name: "PAMB Clearance/Resolution, if w/in Protected Area (1 original)", key: 'clearance', compliant: 'clearance_compliant', remarks: 'clearance_remarks' }
    ]);

    const fetchPendingGovernment = async (page = 1) => {
      try {
        const response = await axios.get(`${API_URL}/pendingGovernment?page=${page}`);
        pendingGovernment.value = response.data.PendingGovernment;
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
      fetchPendingGovernment();
    });

    const totalPages = computed(() => {
      return pendingGovernment.value.last_page || 1;
    });

    const allCompliant = computed(() => {
      return requirements.value.every(req => approvalGovernment.value[req.compliant] === 'Yes');
    });

    const openModal = (tree) => {
      approvalGovernment.value = tree;
      $('#editModal').modal('show');
    };

    const closeModal = () => {
      approvalGovernment.value = null;
      $('#editModal').modal('hide');
    };

    const showImage = (key) => {
      showImageKey.value = key;
      imageUrl.value = `${API_URL}/images/${approvalGovernment.value[key]}`;
      $('#imageModal').modal('show');
    };

    const calendarModal = () => {
      $('#calendarModal').modal('show');
    };

    const calendarModalClose = () => {
      $('#calendarModal').modal('hide');
    };

    const confirmDeclined = (approvalGovernment) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, decline it!'
      }).then((result) => {
        if (result.isConfirmed) {
          approvalGovernment.status = 'declined';
          axios.post(`${API_URL}/updateStatus`, approvalGovernment)
            .then(response => {
              fetchPendingGovernment();
              closeModal();
              Swal.fire(
                'Declined!',
                'The tree cutting request has been declined.',
                'success'
              );
            })
            .catch(error => {
              console.error('Error updating status:', error);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while declining the request!',
              });
            });
        }
      });
    };

    const Approved = () => {
      approvalGovernment.value.status = 'approved';
      axios.post(`${API_URL}/updateStatus`, approvalGovernment.value)
        .then(response => {
          fetchPendingGovernment();
          calendarModalClose();
          closeModal();
          Swal.fire(
            'Approved!',
            'The tree cutting request has been approved.',
            'success'
          );
        })
        .catch(error => {
          console.error('Error updating status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while approving the request!',
          });
        });
    };

    return {
      pendingGovernment,
      approvalGovernment,
      requirements,
      showImageKey,
      imageUrl,
      fetchPendingGovernment,
      openModal,
      closeModal,
      showImage,
      calendarModal,
      calendarModalClose,
      confirmDeclined,
      Approved,
      allCompliant,
      totalPages
    };
  }
};
</script>


<style scoped>

.table {
  border-collapse: collapse; /* Ensure borders are collapsed to avoid double lines */
  width: 75%; /* Ensure the table takes full width */
  position: fixed; /* Fix the table's position relative to the viewport */
  top: 8rem; /* Adjust this value to move the table up or down from the top edge of the viewport */
}


.table thead th {
  font-size: 0.875rem; /* Smaller font size for table headers */
  background-color: #325F62; /* Light green background color */
  border: none; /* Remove all borders */
  padding: 0.5rem; 
  color: white; /* Add some padding for better spacing */
}

.table tbody td {
  font-size: 0.875rem; /* Smaller font size for table cells */
  border: none; /* Remove all borders */
  padding: 0.5rem; /* Add some padding for better spacing */
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

.modal-header {
  background-color: #4ade80; /* Light grey background for modal header */
  border-bottom: 1px solid #dee2e6; /* Border at the bottom of the modal header */
  display: flex;
  justify-content: center; /* Center the title horizontally */
  align-items: center; /* Center the title vertically */
  position: relative; /* Position relative to position the close button correctly */
}

.modal-title {
  font-size: 1.25rem; /* Slightly larger modal title */
  margin: 0 auto; /* Auto margins for centering */
}

.modal-header .close {
  position: absolute;
  right: 1rem; /* Adjust the position of the close button */
  top: 50%; /* Align vertically with the title */
  transform: translateY(-50%); /* Center the close button vertically */
}

.modal-body p {
  font-size: 0.875rem; /* Smaller font size for modal content */
  font-family: Arial, sans-serif; /* Change to a different font style */
  font-weight: normal; /* Ensure the text is not bold */
}

.modal-body h5 {
  font-size: 1rem; /* Smaller font size for modal section titles */
}

.modal-footer .btn {
  font-size: 0.875rem; /* Smaller font size for buttons in modal footer */
}

.btn-primary, .btn-secondary {
  padding: 0.375rem 0.75rem; /* Smaller padding for buttons */
}

.form-control-sm {
  font-size: 0.875rem; /* Smaller font size for form controls */
  padding: 0.25rem 0.5rem; /* Smaller padding for form controls */
}

a {
  color: #007bff; /* Link color */
  text-decoration: none; /* Remove underline from links */
}

a:hover {
  text-decoration: none; /* Underline on hover */
}

.img-fluid {
  max-width: 100%;
  height: auto; /* Ensure images are responsive */
}
</style>



