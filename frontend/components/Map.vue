<template>
  <div id="map" style="height: 300px"></div>
</template>

<script setup>
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const props = defineProps({
  lat: Number,
  lng: Number
})

onMounted(() => {
  const map = L.map("map").setView([props.lat, props.lng], 13)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map)

  L.marker([props.lat, props.lng]).addTo(map)
})
</script>