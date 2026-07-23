<script setup lang="ts">

import { ref, onMounted } from "vue"

import BusinessCard from "./BusinessCard.vue"

import { fetchBusinesses } from "~/composables/useBusinesses"

import { useRecentlyViewed } from "~/composables/useRecentlyViewed"


const activeTab = ref("featured")


const featuredBusinesses = ref<any[]>([])

const nearbyBusinesses = ref<any[]>([])

const popularBusinesses = ref<any[]>([])

const recentBusinesses = ref<any[]>([])


const loading = ref(true)


const radius = ref(5)


const userLat = ref<number | null>(null)

const userLng = ref<number | null>(null)



// Distance calculator

const calculateDistance = (

  lat1:number,

  lng1:number,

  lat2:number,

  lng2:number

)=>{


  const R = 6371


  const dLat =
    (lat2-lat1) * Math.PI / 180


  const dLng =
    (lng2-lng1) * Math.PI / 180



  const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180) *

    Math.cos(lat2*Math.PI/180) *

    Math.sin(dLng/2) *

    Math.sin(dLng/2)



  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1-a)
    )


  return R*c

}




// Load featured + all businesses

const loadBusinesses = async()=>{


try{


const all =
await fetchBusinesses(false)



featuredBusinesses.value =

all.filter(
 business =>
 business.featured === true
).slice(0,6)




// Popular (temporary)
// later we can connect views/rating

popularBusinesses.value =

[...all]

.sort(
(a,b)=>
Number(b.views || 0)
-
Number(a.views || 0)
)

.slice(0,6)



}catch(error){

console.error(
"BUSINESS ERROR",
error
)

}


}




// Load nearby businesses

const loadNearby = ()=>{


if(
userLat.value === null ||
userLng.value === null
)
return



nearbyBusinesses.value =


featuredBusinesses.value

.map(business=>({

...business,

distance:
calculateDistance(

userLat.value!,

userLng.value!,

Number(business.lat),

Number(business.lng)

)

}))


.filter(

business =>
business.distance <= radius.value

)


.sort(

(a,b)=>
a.distance-b.distance

)


}




// Load recent viewed

const loadRecent = ()=>{


const {

recentBusinesses,

loadRecentBusinesses

} = useRecentlyViewed()



loadRecentBusinesses()


recentBusinesses.value =
recentBusinesses.value



}





// Location

const getLocation = ()=>{


if(!navigator.geolocation)
return



navigator.geolocation.getCurrentPosition(

(position)=>{


userLat.value =
position.coords.latitude


userLng.value =
position.coords.longitude



loadNearby()



},


(error)=>{

console.log(
"LOCATION ERROR",
error
)

}


)

}




onMounted(async()=>{


await loadBusinesses()


getLocation()


loadRecent()


loading.value=false



})



</script>
<template>

<section class="discover-section">

  <div class="container">


    <h2 class="title">

      Discover Businesses

    </h2>



    <!-- Tabs -->

    <div class="tabs">


      <button
        :class="{ active: activeTab === 'featured' }"
        @click="activeTab = 'featured'"
      >

        ⭐ Featured

      </button>



      <button
        :class="{ active: activeTab === 'nearby' }"
        @click="activeTab = 'nearby'"
      >

        📍 Nearby

      </button>



      <button
        :class="{ active: activeTab === 'popular' }"
        @click="activeTab = 'popular'"
      >

        🔥 Popular

      </button>



      <button
        :class="{ active: activeTab === 'recent' }"
        @click="activeTab = 'recent'"
      >

        🕘 Recent

      </button>
<p>
 Current tab: {{ activeTab }}
</p>

    </div>




    <!-- Loading -->

    <div
      v-if="loading"
      class="loading"
    >

      Loading businesses...

    </div>





    <!-- Business Cards -->

    <div
      v-else
      class="business-grid"
    >



      <!-- Featured -->

      <template
        v-if="activeTab === 'featured'"
      >


        <BusinessCard

          v-for="business in featuredBusinesses"

          :key="business.id"

          :business="business"

        />


      </template>





      <!-- Nearby -->

      <template
        v-else-if="activeTab === 'nearby'"
      >


        <div
          v-for="business in nearbyBusinesses"

          :key="business.id"
        >


          <BusinessCard

            :business="business"

          />


          <p class="distance">

            📍
            {{ business.distance.toFixed(1) }}
            km away

          </p>


        </div>


      </template>







      <!-- Popular -->

      <template
        v-else-if="activeTab === 'popular'"
      >


        <BusinessCard

          v-for="business in popularBusinesses"

          :key="business.id"

          :business="business"

        />


      </template>








      <!-- Recent -->

      <template
        v-else-if="activeTab === 'recent'"
      >


        <BusinessCard

          v-for="business in recentBusinesses"

          :key="business.id"

          :business="business"

        />


      </template>



    </div>



  </div>


</section>


</template>
<style scoped>

/* BACKGROUND */

.business-section {

  padding:80px 20px;

  min-height:100vh;

  background:
  linear-gradient(
    135deg,
    #f8fafc,
    #e2e8f0
  );

  color:#1f2937;

}



/* TITLE */

.title {

  text-align:center;

  font-size:32px;

  font-weight:900;

  margin-bottom:30px;

}



/* CATEGORY TAG */

.category-tag {

  display:inline-block;

  padding:8px 15px;

  margin-bottom:20px;

  background:white;

  border-radius:20px;

  font-size:14px;

  border:1px solid #e5e7eb;

}



/* GRID */

.grid {

  display:grid;

  grid-template-columns:
  repeat(
    auto-fit,
    minmax(250px,1fr)
  );

  gap:20px;

}



/* EMPTY */

.empty {

  text-align:center;

  margin-top:40px;

  color:#64748b;

}



/* BUSINESS CARD */

.business-card {

  background:white;

  border-radius:16px;

  overflow:hidden;

  transition:.3s ease;

  border:1px solid #e5e7eb;

  box-shadow:
  0 8px 20px rgba(0,0,0,.05);

}



.business-card:hover {

  transform:translateY(-10px);

  box-shadow:
  0 12px 30px rgba(0,0,0,.1);

}



/* IMAGE */

.business-card img {

  width:100%;

  height:160px;

  object-fit:cover;

}



/* TEXT */

.business-card h3 {

  margin:10px;

  color:#111827;

}



.business-card p {

  margin:0 10px 10px;

  font-size:13px;

  color:#6b7280;

}



@media(max-width:700px){

  .title{

    font-size:26px;

  }

}

</style>