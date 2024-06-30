<template>
    <GoogleMap
      api-key="AIzaSyBrqSrJKShAkR7iDx8NzxBE99_27mGbcBc"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
      :options="{ mapTypeId: 'satellite' }"
    >
      <Marker :options="{ position: center, icon: whiteCircleIcon }" />
      <Marker :options="{ position: SanIsidro, icon: greenCircleIcon }" />
    </GoogleMap>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { GoogleMap, Marker } from 'vue3-google-map';
  
  const center = ref({ lat: 16.7474, lng: 121.6169 });
  const SanIsidro = ref({ lat: 16.7480, lng: 121.6175 });
  
  const whiteCircleIcon = ref(null);
  const greenCircleIcon = ref(null);
  
  onMounted(() => {
    whiteCircleIcon.value = {
      url: require('@/assets/WhiteCircle.png'),
      scaledSize: {width: 50, height: 50},
    };
  
    greenCircleIcon.value = {
      url: require('@/assets/GreenCircle.png'),
      scaledSize: {width: 50, height: 50},
    };
  });
  </script>
  
  <style>
  /* Add any additional custom styles here */
  </style>
  