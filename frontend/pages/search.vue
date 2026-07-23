<script setup lang="ts">

import { ref, watch, onMounted, computed } from "vue"

import { SEARCH_BUSINESSES } from "~/graphql/queries"

import BusinessCard from "~/components/BusinessCard.vue"



const route = useRoute()

const { $apollo } = useNuxtApp() as any



const search = ref(
  (route.query.q as string) || ""
)



const businesses = ref<any[]>([])

const loading = ref(false)



const sortType = ref("latest")





const searchBusinesses = async()=>{


  if(!search.value){

    businesses.value=[]

    return

  }


  loading.value=true


  try{


    const result = await $apollo.query({


      query: SEARCH_BUSINESSES,


      variables:{


        search:`%${search.value}%`


      },


      fetchPolicy:"network-only"


    })


    businesses.value =

      result.data.businesses || []



  }


  catch(error){


    console.error(
      "SEARCH ERROR",
      error
    )


  }


  finally{


    loading.value=false


  }


}

const testClick = (value:string)=>{

  console.log("BUTTON CLICKED:", value)

}

const sortedBusinesses = computed(() => {

  const data = [...businesses.value]


  if (sortType.value === "popular") {

    return data.sort((a, b) => {

      return Number(b.views || 0) - Number(a.views || 0)

    })

  }



  if (sortType.value === "name") {

    return data.sort((a, b) => {

      return a.name.localeCompare(b.name)

    })

  }



  // Latest (default)

  return data


})



watch(search,()=>{


 searchBusinesses()


})



watch(sortType, (value) => {

  console.log("SORT CHANGED:", value)

})

onMounted(()=>{


 searchBusinesses()


})



</script>





<template>


<div class="search-page">


<section class="search-header">


<h1>

🔎 Search Businesses

</h1>



<p>

Find shops, restaurants and services near you

</p>



<div class="search-wrapper">


<input


v-model="search"


placeholder="Search business name or location..."


class="search-box"

/>



</div>



</section>






<section class="results">



<div class="toolbar">


<h2>


Results for "{{ search }}"


</h2>


<div class="filters">

<button
  :class="{ active: sortType === 'latest' }"
  @click="sortType='latest'"
>
  Latest
</button>


<button
  :class="{ active: sortType === 'popular' }"
  @click="sortType='popular'"
>
  🔥 Popular
</button>


<button
  :class="{ active: sortType === 'name' }"
  @click="sortType='name'"
>
  A-Z
</button>

</div>

</div>








<div

v-if="loading"

class="loading"

>

<div class="loader"></div>

Loading businesses...


</div>








<div

v-else-if="sortedBusinesses.length"

class="grid"

>


<BusinessCard

v-for="business in sortedBusinesses"

:key="business.id"

:business="business"

/>

</div>








<div

v-else

class="empty"

>


<h3>

😔 No businesses found

</h3>


<p>

Try another keyword

</p>


</div>



</section>



</div>


</template>

<style scoped>

.search-page {

  min-height: 100vh;

  background: #f8fafc;

}



/* ================= HEADER ================= */

.search-header {

  background: #facc15;

  padding: 70px 20px;

  text-align: center;

  position: relative;

  z-index: 1;

}



.search-header h1 {

  font-size: 42px;

  font-weight: 900;

  color: #111827;

}



.search-header p {

  margin-top: 10px;

  color: #374151;

  font-size: 18px;

}



.search-wrapper {

  margin-top: 30px;

}



.search-box {

  width: 100%;

  max-width: 650px;

  padding: 18px 25px;

  border-radius: 30px;

  border: none;

  font-size: 18px;

  outline: none;

  box-shadow: 0 10px 25px rgba(0,0,0,.12);

}



/* ================= RESULTS ================= */


.results {

  max-width: 1200px;

  margin: auto;

  padding: 50px 20px;

  position: relative;

  z-index: 5;

}



.toolbar {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;

  position: relative;

  z-index: 10;

}



.toolbar h2 {

  font-size: 25px;

  font-weight: 800;

  color: #111827;

}



/* ================= FILTER BUTTONS ================= */


.filters {

  display: flex;

  gap: 10px;

  position: relative;

  z-index: 20;

}



.filters button {

  position: relative;

  z-index: 30;

  padding: 10px 20px;

  border-radius: 25px;

  border: 1px solid #e5e7eb;

  background: white;

  color: #374151;

  cursor: pointer;

  font-weight: 600;

  transition: all .3s ease;

  pointer-events: auto;

}



.filters button:hover,

.filters button.active {

  background: #facc15;

  border-color: #facc15;

  color: #111827;

  transform: translateY(-2px);

}





/* ================= BUSINESS GRID ================= */


.grid {

  display: grid;

  grid-template-columns:

  repeat(auto-fit,minmax(280px,1fr));

  gap: 25px;

}





/* ================= LOADING ================= */


.loading {

  text-align: center;

  padding: 50px;

  font-size: 20px;

}



.loader {

  width: 35px;

  height: 35px;

  border: 4px solid #ddd;

  border-top-color: #facc15;

  border-radius: 50%;

  margin: 0 auto 15px;

  animation: spin 1s linear infinite;

}



@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}





/* ================= EMPTY ================= */


.empty {

  background: white;

  padding: 60px;

  border-radius: 25px;

  text-align: center;

}



.empty h3 {

  font-size: 25px;

  font-weight: 800;

}





/* ================= DARK MODE ================= */


.dark .search-page {

  background: #111827;

}



.dark .toolbar h2 {

  color: white;

}



.dark .filters button {

  background: #1f2937;

  color: white;

  border-color: #374151;

}



.dark .filters button:hover,

.dark .filters button.active {

  background: #facc15;

  color: black;

}



.dark .empty {

  background: #1f2937;

  color: white;

}





/* ================= MOBILE ================= */


@media(max-width:700px) {


  .search-header h1 {

    font-size: 30px;

  }



  .toolbar {

    flex-direction: column;

    align-items: flex-start;

    gap: 20px;

  }



  .filters {

    width: 100%;

    overflow-x: auto;

  }



  .filters button {

    white-space: nowrap;

  }


}
</style>



