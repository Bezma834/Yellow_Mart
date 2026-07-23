<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader"
import { collection, getDocs } from "firebase/firestore"
import { db } from "~/plugins/firebase.client"

onMounted(async () => {
  if (!db) return

  const snap = await getDocs(collection(db, "businesses"))

  const loader = new Loader({
    apiKey: "YOUR_KEY"
  })

  const google = await loader.load()

  const map = new google.maps.Map(
    document.getElementById("map"),
    {
      center: { lat: 9.03, lng: 38.74 },
      zoom: 11
    }
  )

  snap.docs.forEach(doc => {
    const b = doc.data()

    new google.maps.Marker({
      position: {
        lat: b.location.lat,
        lng: b.location.lng
      },
      map,
      title: b.name
    })
  })
})
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>