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



const calculateDistance = (
  lat1:number,
  lng1:number,
  lat2:number,
  lng2:number
)=>{

  const R = 6371


  const dLat =
    (lat2-lat1) *
    Math.PI / 180


  const dLng =
    (lng2-lng1) *
    Math.PI / 180



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




const loadBusinesses = async()=>{


const businesses =
await fetchBusinesses(false)



console.log(
"ALL BUSINESSES",
businesses
)


featuredBusinesses.value = businesses.slice(0,6)

popularBusinesses.value =

[...businesses]

.sort(

(a,b)=>

Number(b.views || 0)

-

Number(a.views || 0)

)

.slice(0,6)


}




const loadNearby = async()=>{


if(!navigator.geolocation)
return



navigator.geolocation.getCurrentPosition(

(position)=>{


const lat =
position.coords.latitude


const lng =
position.coords.longitude



nearbyBusinesses.value =

featuredBusinesses.value

.map(business=>({

...business,

distance:
calculateDistance(

lat,

lng,

Number(business.lat),

Number(business.lng)

)

}))


.filter(

business =>
business.distance <= radius.value

)



},


(error)=>{

console.log(
"LOCATION ERROR",
error
)

}


)



}




const loadRecent = ()=>{


const {

recentBusinesses: saved,

loadRecentBusinesses

}=useRecentlyViewed()



loadRecentBusinesses()


recentBusinesses.value =
saved.value


}





onMounted(async()=>{


try{


await loadBusinesses()

await loadNearby()

loadRecent()



}

catch(error){

console.log(
error
)

}

finally{

loading.value=false

}



})



</script>
<template>

<section class="discover-section">


  <div class="container">


    <h2 class="title">
      Discover Businesses
    </h2>



    <!-- BUTTONS -->

    <div class="tabs">


      <button
        :class="{ active: activeTab === 'featured' }"
        @click="activeTab='featured'"
      >
        ⭐ Featured
      </button>



      <button
        :class="{ active: activeTab === 'nearby' }"
        @click="activeTab='nearby'"
      >
        📍 Nearby
      </button>



      <button
        :class="{ active: activeTab === 'popular' }"
        @click="activeTab='popular'"
      >
        🔥 Popular
      </button>



      <button
        :class="{ active: activeTab === 'recent' }"
        @click="activeTab='recent'"
      >
        🕘 Recent
      </button>


    </div>




    <!-- SECTION TITLE -->

    <div class="section-header">


      <h3>

        {{
          activeTab === 'featured'
          ? '⭐ Featured Businesses'

          :

          activeTab === 'nearby'
          ? '📍 Businesses Near You'

          :

          activeTab === 'popular'
          ? '🔥 Popular Businesses'

          :

          '🕘 Recently Viewed'
        }}

      </h3>



      <button class="see-all">

        See All →

      </button>


    </div>





    <!-- BUSINESS CARDS -->

    <TransitionGroup

      name="business"

      tag="div"

      class="business-grid"

    >



      <!-- FEATURED -->

      <template
        v-if="activeTab === 'featured'"
      >

        <BusinessCard

          v-for="business in featuredBusinesses"

          :key="business.id"

          :business="business"

        />

      </template>





      <!-- NEARBY -->

      <template
        v-else-if="activeTab === 'nearby'"
      >

        <BusinessCard

          v-for="business in nearbyBusinesses"

          :key="business.id"

          :business="business"

        />

      </template>





      <!-- POPULAR -->

      <template
        v-else-if="activeTab === 'popular'"
      >

        <BusinessCard

          v-for="business in popularBusinesses"

          :key="business.id"

          :business="business"

        />

      </template>





      <!-- RECENT -->

      <template
        v-else-if="activeTab === 'recent'"
      >

        <BusinessCard

          v-for="business in recentBusinesses"

          :key="business.id"

          :business="business"

        />

      </template>



    </TransitionGroup>



  </div>


</section>


</template>


<style scoped>

.discover-section {

  padding: 60px 20px;

  width: 100%;

}



.container {

  max-width: 1200px;

  margin: 0 auto;

}



/* TITLE */

.title {

  font-size: 34px;

  font-weight: 800;

  margin-bottom: 30px;

  color: #111827;

}



/* TABS */

.tabs {

  display: flex;

  gap: 12px;

  flex-wrap: wrap;

  margin-bottom: 35px;

}



.tabs button {

  padding: 12px 24px;

  border-radius: 30px;

  border: 1px solid #e5e7eb;

  background: #ffffff;

  color: #374151;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  transition: all .3s ease;

}



.tabs button:hover {

  transform: translateY(-2px);

  background: #facc15;

  color: #111;

}



.tabs button.active {

  background: #facc15;

  color: #111;

  border-color: #facc15;

  box-shadow: 0 5px 15px rgba(250,204,21,.35);

}





/* SECTION HEADER */

.section-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 25px;

}



.section-header h3 {

  font-size: 24px;

  font-weight: 700;

  color: #1f2937;

}



.see-all {

  border: none;

  background: transparent;

  color: #ca8a04;

  font-weight: 700;

  cursor: pointer;

}



.see-all:hover {

  text-decoration: underline;

}





/* BUSINESS GRID */

.business-grid {

  display: grid;

  grid-template-columns: repeat(4,1fr);

  gap: 25px;

}





/* CARD ANIMATION */

.business-enter-active,

.business-leave-active {

  transition: all .35s ease;

}



.business-enter-from {

  opacity: 0;

  transform: translateY(25px);

}



.business-leave-to {

  opacity: 0;

  transform: scale(.95);

}





/* DARK MODE */

.dark .discover-section {

  background: #111827;

}



.dark .title {

  color: white;

}



.dark .section-header h3 {

  color: white;

}



.dark .tabs button {

  background: #1f2937;

  border-color: #374151;

  color: white;

}



.dark .tabs button:hover {

  background: #facc15;

  color: black;

}



.dark .tabs button.active {

  background: #facc15;

  color:black;

}



.dark .see-all {

  color:#facc15;

}





/* RESPONSIVE */

@media(max-width:1100px){


.business-grid{

grid-template-columns:repeat(3,1fr);

}


}



@media(max-width:800px){


.business-grid{

grid-template-columns:repeat(2,1fr);

}


.tabs{

overflow-x:auto;

flex-wrap:nowrap;

}


.tabs button{

white-space:nowrap;

}



}



@media(max-width:500px){


.discover-section{

padding:40px 15px;

}


.title{

font-size:26px;

}



.business-grid{

grid-template-columns:1fr;

}



.section-header{

flex-direction:column;

align-items:flex-start;

gap:10px;

}



}

</style>