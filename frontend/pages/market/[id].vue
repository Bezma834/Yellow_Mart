<script setup lang="ts">
import {
  REMOVE_FAVORITE
} from "~/graphql/queries"
import { gql } from "@apollo/client"
import { ADD_FAVORITE } from "~/graphql/queries"
import { useRoute } from "vue-router"
import { ref, onMounted, nextTick } from "vue"
import { useAuth } from "~/composables/useAuth"
import { useRecentlyViewed } from "~/composables/useRecentlyViewed"

const route = useRoute()

const { $apollo } = useNuxtApp() as any


const business = ref<any>(null)

const isFavorite = ref(false)

const { user } = useAuth()
const toggleFavorite = async () => {

  console.log("USER:", user.value)

  console.log("BUSINESS:", business.value)


  if (!user.value) {

    alert("Please login first")

    return

  }


  if (!business.value) {

    console.log("Business not loaded")

    return

  }


  try {


    if (!isFavorite.value) {


      await $apollo.mutate({

        mutation: ADD_FAVORITE,

        variables: {

          user_id: user.value.id,

          business_id: business.value.id

        }

      })


      isFavorite.value = true


      console.log("Added to favorites")


    } else {


      await $apollo.mutate({

        mutation: REMOVE_FAVORITE,

        variables: {

          user_id: user.value.id,

          business_id: business.value.id

        }

      })


      isFavorite.value = false


      console.log("Removed from favorites")


    }


  } catch(error) {


    console.error(
      "Favorite error:",
      error
    )


  }


}


const GET_BUSINESS = gql`

query GetBusiness($id: uuid!) {

  businesses_by_pk(id:$id){

    id
    name
    description

    category {

      id
      name

    }

    phone
    address
    city
    image

    lat
    lng

    views
    likes

  }

}

`



const loadBusiness = async()=>{


try {


const result = await $apollo.query({

query: GET_BUSINESS,

variables:{

id: route.params.id

}

})


business.value =
result.data.businesses_by_pk

const {
  addRecentlyViewed
} = useRecentlyViewed()


addRecentlyViewed(
  business.value
)
console.log(
"BUSINESS:",
business.value
)


}

catch(error){

console.error(
"LOAD BUSINESS ERROR:",
error
)

}


}







let map:any



const loadMap = async()=>{


if(
!business.value ||
!business.value.lat ||
!business.value.lng
){

console.log("No location data")

return

}



await nextTick()


const L =
(await import("leaflet")).default


await import(
"leaflet/dist/leaflet.css"
)



map = L.map(
"business-map"
)
.setView(

[
business.value.lat,
business.value.lng
],

15

)



L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:
"© OpenStreetMap"

}

)
.addTo(map)



L.marker(

[
business.value.lat,
business.value.lng
]

)
.addTo(map)



setTimeout(()=>{

map.invalidateSize()

},300)


}






onMounted(async()=>{


  console.log("USER:", user.value)
await loadBusiness()


await loadMap()



})


</script>
<template>

  <div class="page">


    <!-- LOADING -->

    <div
      v-if="!business"
      class="loading"
    >

      Loading business...

    </div>



    <!-- BUSINESS DETAILS -->

    <div
      v-else
      class="details-container"
    >



      <!-- IMAGE -->

      <div class="hero-image">


        <img
          :src="business.image || '/default-business.jpg'"
          :alt="business.name"
        >


        <button
          class="favorite"
          @click="toggleFavorite"
        >

          {{ isFavorite ? "❤️" : "🤍" }}

        </button>


      </div>





      <!-- INFO -->

      <div class="info-card">


        <span class="category">

          {{ business.category?.name || "Business" }}

        </span>



        <h1>

          {{ business.name }}

        </h1>



        <p class="location">

          📍

          {{ business.address || "No address" }},

          {{ business.city || "Ethiopia" }}

        </p>



        <a
          v-if="business.phone"
          :href="`tel:${business.phone}`"
          class="call-button"
        >

          📞 Call Business

        </a>



      </div>







      <!-- DESCRIPTION -->


      <div class="card">


        <h2>

          About

        </h2>



        <p>

          {{ business.description || "No description available." }}

        </p>


      </div>







      <!-- MAP -->


      <div
        v-if="business.lat && business.lng"
        class="card"
      >


        <h2>

          Location

        </h2>



        <div id="business-map"></div>



      </div>




    </div>



  </div>


</template>
<style scoped>


.page{

padding:40px 20px;

background:#f8fafc;

min-height:100vh;

}


.card{

max-width:900px;

margin:auto;

background:white;

padding:30px;

border-radius:20px;

box-shadow:
0 10px 30px rgba(0,0,0,.1);

}


.image{

width:100%;

height:350px;

object-fit:cover;

border-radius:20px;

}


h1{

font-size:36px;

margin-top:25px;

}


.location{

color:#64748b;

}



.stats{

display:flex;

gap:30px;

margin:20px 0;

}



#business-map{

height:400px;

width:100%;

border-radius:20px;

margin-top:20px;

}
.page {

background:#f8fafc;

padding:100px 20px;

}


.details-container{

max-width:900px;

margin:auto;

}



.hero-image{

position:relative;

}


.hero-image img{

width:100%;

height:420px;

object-fit:cover;

border-radius:20px;

}



.favorite{

position:absolute;

top:20px;

right:20px;

border:none;

background:white;

font-size:28px;

border-radius:50%;

padding:10px;

cursor:pointer;

}



.info-card,
.card{

background:white;

padding:30px;

margin-top:20px;

border-radius:20px;

box-shadow:0 10px 25px rgba(0,0,0,.08);

}



.category{

background:#facc15;

padding:6px 15px;

border-radius:20px;

font-weight:700;

}



h1{

font-size:40px;

margin:20px 0;

}



.location{

color:#64748b;

font-size:18px;

}



.call-button{

display:inline-block;

margin-top:20px;

background:#22c55e;

color:white;

padding:15px 30px;

border-radius:12px;

font-weight:700;

text-decoration:none;

}



#business-map{

height:350px;

border-radius:15px;

}



@media(max-width:700px){

h1{

font-size:30px;

}


.hero-image img{

height:250px;

}

}


</style>