<template>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-3 g-3">
      <div class="col" v-for="tree in paginatedTrees" :key="tree.id">
        <div class="card h-100 d-flex flex-row align-items-stretch fixed-size-card">
          <img :src="'http://127.0.0.1:8000/'+tree.tree_pic" class="card-img-left" alt="Tree Image">
          <div class="card-body d-flex flex-column">
            <div class="dropdown ml-auto">
              <button type="button" id="dropdownMenuButton" @click="toggleDropdown(tree.id)">
                <span class="material-icons">more_vert</span>
              </button>
              <div class="dropdown-menu" :class="{ show: tree.showDropdown }" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#" @click="openEditModal(tree)">Edit</a>
                <a class="dropdown-item" href="#" @click="confirmDelete(tree)">Delete</a>
              </div>
            </div>
            <div class="card-content">
              <center><h5 class="card-title">{{ tree.id }}</h5></center>
              <p class="card-text"><strong>Common Name:</strong> {{ tree.com_Name }}</p>
              <p class="card-text"><strong>Scientific Name:</strong> {{ tree.sci_Name }}</p>
              <p class="card-text"><strong>Family Name:</strong> {{ tree.fam_Name }}</p>
              <p class="card-text"><strong>Origin:</strong> {{ tree.origin }}</p>
              <p class="card-text"><strong>Conservation Status:</strong> {{ tree.conserve_Status }}</p>
              <p class="card-text"><strong>Uses:</strong> {{ tree.uses }}</p>
              <p class="card-text"><strong>Tagger:</strong> {{ tree.tagger.firstname }}</p>
              <p class="card-text"><strong>Status:</strong> {{ tree.tagging_Stat }}</p>
              <p class="card-text"><strong>Location:</strong> {{ tree.address }}</p>
            </div>
            <div class="mt-auto">
              <button type="button" class="btn btn-primary mr-2" @click="viewLocation(tree.Lat, tree.Lng)">View Location</button>
              <button type="button" class="btn btn-secondary" @click="printQRCode(tree)">Print QR Code</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

    <!-- Edit Modal -->
    <div class="modal" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Tree Information</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeEditModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="editComName">Common Name</label>
                <input type="text" class="form-control" id="editComName" v-model="editTree.com_Name">
              </div>
              <div class="form-group">
                <label for="editSciName">Scientific Name</label>
                <input type="text" class="form-control" id="editSciName" v-model="editTree.sci_Name">
              </div>
              <div class="form-group">
                <label for="editFamName">Family Name</label>
                <input type="text" class="form-control" id="editFamName" v-model="editTree.fam_Name">
              </div>
              <div class="form-group">
                <label for="editOrigin">Origin</label>
                <input type="text" class="form-control" id="editOrigin" v-model="editTree.origin">
              </div>
              <div class="form-group">
                <label for="editConserveStat">Conservation Status</label>
                <input type="text" class="form-control" id="editConserveStat" v-model="editTree.conserve_Status">
              </div>
              <div class="form-group">
                <label for="editUses">Uses</label>
                <input type="text" class="form-control" id="editUses" v-model="editTree.uses">
              </div>
              <select class="form-select form-select-lg mb-3" v-model="editTree.tagging_Stat" aria-label=".form-select-lg example">
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
              </select>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeEditModal">Close</button>
            <button type="button" class="btn btn-primary" @click="saveChanges">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

export default {
  name: 'CardComponent',
  setup() {
    const router = useRouter();
    const combinedTrees = ref([]);
    const editTree = ref({});
    const currentPage = ref(1);
    const itemsPerPage = 6;

    const fetchTrees = async () => {
      try {
        const response = await axios.get(`${API_URL}/trees`);
        combinedTrees.value = response.data.trees;
        combinedTrees.value.forEach(tree => tree.showDropdown = false);
      } catch (error) {
        console.error('Error fetching trees:', error);
      }
    };

    const deleteTree = async (tree) => {
      try {
        await axios.put(`${API_URL}/deleteTree/${tree.id}`);
        fetchTrees();
      } catch (error) {
        console.error('Error deleting tree:', error);
      }
    };

    const confirmDelete = (tree) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTree(tree);
          Swal.fire('Deleted!', 'Tagged tree has been deleted.', 'success');
        }
      });
    };

    const viewLocation = (lat, lng) => {
      router.push({ path: '/GIS', query: { lat, lng } });
    };

    const printQRCode = async (tree) => {
      try {
        const doc = new jsPDF();
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = `http://127.0.0.1:8000/${tree.tree_pic}`;

        img.onload = () => {
          const treeId = `${tree.id}`;
          const comName = `${tree.com_Name}`;
          const sciName = `${tree.sci_Name}`;
          const famName = `${tree.fam_Name}`;
          const origin = `${tree.origin}`;
          const conserveStatus = `${tree.conserve_Status}`;
          const taggerName = `${tree.tagger.name}`;
          const taggingStat = `${tree.tagging_Stat}`;
          const location = `${tree.barangay}, ${tree.municipality}, ${tree.province}`;

          doc.text(treeId, 10, 10);
          doc.text(`Common Name: ${comName}`, 10, 20);
          doc.text(`Scientific Name: ${sciName}`, 10, 30);
          doc.text(`Family Name: ${famName}`, 10, 40);
          doc.text(`Origin: ${origin}`, 10, 50);
          doc.text(`Conservation Status: ${conserveStatus}`, 10, 60);
          doc.text(`Tagger Name: ${taggerName}`, 10, 70);
          doc.text(`Tagging Status: ${taggingStat}`, 10, 80);
          doc.text(`Location: ${location}`, 10, 90);
          doc.addImage(img, "JPEG", 10, 100, 100, 100);

          const qrCodeUrl = `http://127.0.0.1:8000/${tree.QR_code}`;
          img.src = qrCodeUrl;
          img.onload = () => {
            doc.addImage(img, "JPEG", 120, 100, 100, 100);
            doc.save("tree_info.pdf");
          };
        };
      } catch (error) {
        console.error("Error printing QR code:", error);
      }
    };

    const toggleDropdown = (id) => {
      combinedTrees.value.forEach((tree) => {
        if (tree.id === id) {
          tree.showDropdown = !tree.showDropdown;
        } else {
          tree.showDropdown = false;
        }
      });
    };

    const openEditModal = (tree) => {
      editTree.value = { ...tree };
      console.log('Opening edit modal with tree:', editTree.value);
      const editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();
    };

    const closeEditModal = () => {
      editTree.value = {};
      console.log('Closing edit modal');
      const editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.hide();
    };

    const saveChanges = async () => {
      try {
        const response = await axios.put(`${API_URL}/editTree/${editTree.value.id}`, editTree.value);
        console.log('Save changes response:', response);

        const updatedTree = combinedTrees.value.find(tree => tree.id === editTree.value.id);
        if (updatedTree) {
          Object.assign(updatedTree, editTree.value);
        }

        // Don't close the modal to allow the user to see the changes
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    };

    const paginatedTrees = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return combinedTrees.value.slice(start, start + itemsPerPage);
    });

    const totalPages = computed(() => {
      return Math.ceil(combinedTrees.value.length / itemsPerPage);
    });

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    };

    fetchTrees();

    return {
      combinedTrees,
      editTree,
      currentPage,
      totalPages,
      paginatedTrees,
      fetchTrees,
      deleteTree,
      confirmDelete,
      viewLocation,
      printQRCode,
      toggleDropdown,
      openEditModal,
      closeEditModal,
      saveChanges,
      previousPage,
      nextPage
    };
  },
};
</script>

<style scoped>
.container-fluid {
  display: flex;
  flex-direction: column;

  overflow: hidden; /* Prevent vertical scroll */
}

.card-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent both vertical and horizontal scroll */
}



.row-cols-1 {
  gap: 20px;
}

.row-cols-md-3 {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.col {
  flex: 1 1 calc(33.333% - 20px);
  margin-bottom: 20px;
  padding: 0;
}

.fixed-size-card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  height: 200px;
}

.card-img-left {
  width: 30%;
  height: 50%;
  object-fit: cover;
  margin-top: 50px;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;

}

.dropdown {
  position: absolute;
  top: 2px;
  right: 5px;
}

.material-icons {
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
}

.dropdown-menu.show {
  display: block;
}

.card-content {
  flex-grow: 1;
  font-size: 15px;
}

.card-content p {
  margin: 0;
  padding: 0;
  line-height: 1;
}

.mt-auto {
  margin-top: auto;
}

.btn {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-primary {
  margin-right: 2px;
}

.btn-secondary {
  margin-left: 2px;
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


