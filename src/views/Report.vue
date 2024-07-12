<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-1"></div>
      <div class="col-10">
        <div class="row">
          <div class="col-md-3 mb-4" v-for="tree in combinedTrees" :key="tree.id">
            <div class="card position-relative">
              <button type="button" class="btn btn-primary" @click="openEditModal(tree)">Edit</button>
              <button type="button" class="btn btn-secondary"  @click="deleteTree(tree)">Delete</button>
              <img :src="'http://127.0.0.1:8000/'+tree.tree_pic" class="card-img-top" alt="Tree Image" style="max-width: 100%; height: 30%;">
              <div class="card-body" style="text-align: left">
                <center><h5 class="card-title">{{ tree.id }}</h5></center>
                <p>Common Name: {{ tree.com_Name }}</p>
                <p>Scientific Name: {{ tree.sci_Name }}</p>
                <p>Family Name: {{ tree.fam_Name }}</p>
                <p>Origin: {{ tree.origin }}</p>
                <p>Conservation Status: {{ tree.conserve_Status }}</p>
                <p>Uses: {{ tree.uses }}</p>
                <p>Tagger: {{ tree.tagger.name }}</p>
                <p>Status: {{ tree.tagging_Stat }}</p>
                <p>Location: {{ tree.barangay }}, {{ tree.municipality }}, {{ tree.province }}</p>
                <div class="row" style="float: end">
                  <button type="button" class="btn btn-primary mr-2" @click="viewLocation(tree.Lat, tree.Lng)">View Location</button>
                  <button type="button" class="btn btn-secondary" @click="printQRCode(tree)">Print QR Code</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1"></div>
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
import { ref } from 'vue';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'vue-router';
import { API_URL } from '../config';

export default {
  name: 'CardComponent',
  setup() {
    const router = useRouter();
    const combinedTrees = ref([]);
    const editTree = ref({}); // Ensure editTree is always an object

    const fetchTrees = async () => {
      try {
        const response = await axios.get(`${API_URL}/trees`);
        combinedTrees.value = response.data.trees;
      } catch (error) {
        console.error('Error fetching trees:', error);
      }
    };

    const deleteTree = async (tree) => {
      try {
        await axios.put(`${API_URL}/deleteTree/${tree.id}`);
        fetchTrees(); // Refresh the tree list after deletion
      } catch (error) {
        console.error('Error deleting tree:', error);
      }
    };

    const viewLocation = (lat, lng) => {
      router.push({ path: '/GIS', query: { lat, lng } });
    };

   const printQRCode = async (tree) => {
  try {
    const doc = new jsPDF();

    // Create an Image element
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Ensure cross-origin is handled properly if necessary
    img.src = `http://127.0.0.1:8000/${tree.tree_pic}`;

    // Event handler for when the image loads successfully
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

      // Ensure the image dimensions and quality are suitable for your use case
      doc.text(treeId, 10, 10);
      doc.text(`Common Name: ${comName}`, 10, 20);
      doc.text(`Scientific Name: ${sciName}`, 10, 30);
      doc.text(`Family Name: ${famName}`, 10, 40);
      doc.text(`Origin: ${origin}`, 10, 50);
      doc.text(`Conservation Status: ${conserveStatus}`, 10, 60);
      doc.text(`Tagger: ${taggerName}`, 10, 70);
      doc.text(`Status: ${taggingStat}`, 10, 80);
      doc.text(`Location: ${location}`, 10, 90);

      // Create a canvas element to convert the image to a data URL
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get the data URL representation of the image
      const dataURL = canvas.toDataURL('image/jpeg');

      // Add the image to the PDF document
      doc.addImage(dataURL, 'JPEG', 10, 100, 180, 60);

      // Save the PDF with a filename based on treeId
      doc.save(`${treeId}_QRCode.pdf`);
    };

    // Error handler for image loading errors
    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  } catch (error) {
    console.error('Error printing QR code:', error);
  }
};


    const openEditModal = (tree) => {
      editTree.value = { ...tree };
      $('#editModal').modal('show');
    };

    const closeEditModal = () => {
      editTree.value = {};
      $('#editModal').modal('hide');
    };

    const saveChanges = async () => {
      try {
        await axios.put(`${API_URL}/editTree/${editTree.value.id}`, editTree.value);
        console.log('Changes saved for tree:', editTree.value.id);

        const index = combinedTrees.value.findIndex(tree  => tree.id === editTree.value.id);
        if (index !== -1) {
          combinedTrees.value[index] = { ...editTree.value };
        }

        closeEditModal();
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    };

    fetchTrees(); // Fetch trees on component mount

    return {
      combinedTrees,
      printQRCode,
      viewLocation,
      openEditModal,
      closeEditModal,
      saveChanges,
      editTree,
      deleteTree,
    };
  },
};
</script>


<style scoped>
.card {
  margin: 5px;
}
</style>
