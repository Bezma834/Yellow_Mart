
<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader"
import { fetchBusinesses } from "~/composables/useBusinesses"

const businesses = ref<any[]>([])

onMounted(async () => {

  businesses.value = await fetchBusinesses()


  const loader = new Loader({
    apiKey: "YOUR_GOOGLE_MAPS_KEY"
  })


  const google = await loader.load()


  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: {
        lat: 9.03,
        lng: 38.74
      },
      zoom: 11
    }
  )


  businesses.value.forEach((business)=>{

    if(
      !business.latitude ||
      !business.longitude
    ) return


    new google.maps.Marker({

      position:{
        lat: business.latitude,
        lng: business.longitude
      },

      map,

      title: business.name

    })

  })

})
</script>


<template>
  <div
    id="map"
    class="w-full h-[500px]"
  ></div>
</template>
<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>