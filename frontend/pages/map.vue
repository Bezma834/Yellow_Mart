<template>
  <div class="map-page">

    <h1>
      🗺️ Find Businesses Near You
    </h1>

    <div id="business-map"></div>

  </div>
</template>


<script setup lang="ts">

import { onMounted, ref } from "vue"
import { GET_ALL_BUSINESSES } from "~/graphql/queries"


const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])


let L:any = null
let map:any = null



onMounted(async () => {


  try {

    const result = await $apollo.query({

      query: GET_ALL_BUSINESSES

    })


    businesses.value =
      result.data.businesses || []


  } catch(error){

    console.error(
      "Failed loading businesses:",
      error
    )

  }



  if(import.meta.client){


    await import(
      "leaflet/dist/leaflet.css"
    )


    const leaflet =
      await import("leaflet")


    L = leaflet.default



    map =
      L.map(
        "business-map"
      )
      .setView(
        [
          9.03,
          38.74
        ],
        6
      )



    L.tileLayer(

      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

      {

        attribution:
        "© OpenStreetMap"

      }

    )
    .addTo(map)



    businesses.value.forEach(
      (business)=>{


        if(
          business.lat &&
          business.lng
        ){


          const marker =
            L.marker(
              [
                business.lat,
                business.lng
              ]

            )
            .addTo(map)



          marker.bindPopup(`

            <h3>
              ${business.name}
            </h3>

            <p>
              📍 ${business.city}
            </p>

            <p>
              ${business.address}
            </p>

            <a href="/business/${business.id}">
              View Details
            </a>

          `)


        }


      }
    )


  }


})


</script>



<style scoped>

.map-page{

  padding:100px 20px;

}



h1{

  text-align:center;

  font-size:32px;

  font-weight:900;

  margin-bottom:30px;

}



#business-map{

  height:600px;

  width:100%;

  border-radius:20px;

}


</style>
