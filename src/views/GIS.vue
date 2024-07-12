<template>
  <div>
    <GoogleMap
      :api-key="apiKey"
      style="width: 100%; height: 500px"
      :center="MapCenter"
      :zoom="zoom"
      mapTypeId="satellite"
    >
      <Marker
        v-for="tree in combinedTrees"
        :key="tree.id"
        :options="{ position: { lat: parseFloat(tree.Lat), lng: parseFloat(tree.Lng) }, icon: getMarkerIcon(tree) }"
        @click="openInfoWindow(tree.id)"
      >
        <InfoWindow
          v-if="infoWindowOpen[tree.id]"
          :position="{ lat: parseFloat(tree.Lat), lng: parseFloat(tree.Lng) }"
          @closeclick="closeInfoWindow(tree.id)"
        >
          <div class="TreeInfo">
            <center><img :src="`${IMAGE_URL}`+tree.tree_pic" style="max-width: 50%; height: 50%;"></center>
            <h5>Common Name: {{ tree.com_Name }}</h5>
            <h5>Scientific Name: {{ tree.sci_Name }}</h5>
            <h5>Family Name: {{ tree.fam_Name }}</h5>
            <h5>Origin: {{ tree.origin }}</h5>
            <h5>Conservation Status: {{ tree.conserve_Status }}</h5>
            <h5>Tagger: {{ tree.tagger.name }}</h5>
            <h5>Location: {{ tree.address }}</h5>
          </div>
        </InfoWindow>
      </Marker>
    </GoogleMap>

    <div>
      <div class="input-group Search">
        <input
          type="search"
          class="form-control rounded"
          id="search_input"
          @keydown.enter="Search"
          v-model="searchInput"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
        />
        <button type="button" class="btn btn-outline-primary" @click="Search">Search</button>
      </div>

      <div class="container-fluid">
        <div class="row">
          <div class="col-1"></div>
          <div class="col-10 mt-5" style="text-align: left">
            <h4 v-if="searchData">LOCATION: {{ searchData.search }}</h4>
            <h4 v-if="searchData">TAGGED TREES: {{ searchData.aliveCount }}</h4>
            <h4 v-if="searchData">TARGET VOLUME: {{ searchData.target }}</h4>
            <h4 v-if="searchData">CUT TREES: {{ searchData.deadCount }}</h4>
            <h4 v-if="searchData">STATUS: {{ searchData.status }}</h4>
            <h4 v-if="searchData">RECOMMENDATION ACTION: {{ searchData.recommendation }}</h4>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { API_URL, IMAGE_URL } from '../config';

const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
const MapCenter = ref({ lat: 16.7474, lng: 121.6169 });
const zoom = ref(16);

const allTrees = ref([]);
const searchTrees = ref([]);
const combinedTrees = ref([]);
const searchData = ref(null);
const infoWindowOpen = ref({});

const whiteCircleIcon = ref(null);
const greenCircleIcon = ref(null);

const route = useRoute();

onMounted(() => {
  // Initialize marker icons
  whiteCircleIcon.value = {
    url: require('@/assets/WhiteCircle.png'),
    scaledSize: { width: 50, height: 45 },
  };

  greenCircleIcon.value = {
    url: require('@/assets/GreenCircle.png'),
    scaledSize: { width: 50, height: 45 },
  };
});

const getMarkerIcon = (tree) => {
  return tree.tagging_Stat === 'Alive' ? greenCircleIcon.value : whiteCircleIcon.value;
};

const openInfoWindow = (id) => {
  infoWindowOpen.value = { ...infoWindowOpen.value, [id]: true };
};

const closeInfoWindow = (id) => {
  infoWindowOpen.value = { ...infoWindowOpen.value, [id]: false };
};

const searchInput = ref('');

const Search = async () => {
  try {
    const response = await axios.get(`${API_URL}/searchquery`, {
      params: {
        query: searchInput.value
      }
    });
    searchData.value = response.data;
    searchTrees.value = response.data.trees;
    combinedTrees.value = [...allTrees.value, ...searchTrees.value];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

function initMap() {
  const searchInputElement = document.getElementById('search_input');
  const autocomplete = new google.maps.places.Autocomplete(searchInputElement, {
    types: ['geocode'],
    componentRestrictions: { country: 'ph' }
  });

  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      MapCenter.value = { lat: lat, lng: lng };
      searchInput.value = place.formatted_address; // Update searchInput with the formatted address
      Search();
    } else {
      console.log('No geometry information available for this place.');
    }
  });
}

onMounted(() => {
  if (typeof google === 'undefined') {
    console.error('Google Maps JavaScript API is not loaded.');
  } else {
    initMap();
  }
});

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/trees`);
    allTrees.value = response.data.trees;
    allTrees.value.forEach(tree => {
      tree.Lat = parseFloat(tree.Lat);
      tree.Lng = parseFloat(tree.Lng);
    });
    combinedTrees.value = [...allTrees.value];

    const lat = parseFloat(route.query.lat);
    const lng = parseFloat(route.query.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      MapCenter.value = { lat, lng };
      zoom.value = 20; // Set your desired zoom level here
      openInfoWindow(tree.id); // Open info window for the specified tree ID
    }
  } catch (error) {
    console.error('Error fetching marker data:', error);
  }
});
</script>

<style scoped>
.TreeInfo {
  text-align: left;
  max-width: 25rem;
}

.Search {
  margin-top: 1rem;
  width: 30rem;
  float: right;
}
</style>
