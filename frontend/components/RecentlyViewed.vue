<script setup lang="ts">

import { onMounted } from "vue"
import BusinessCard from "./BusinessCard.vue"
import { useRecentlyViewed } from "~/composables/useRecentlyViewed"

const {
  recentBusinesses,
  loadRecentBusinesses
} = useRecentlyViewed()


onMounted(()=>{

  loadRecentBusinesses()

})

</script>


<template>

<section
  v-if="recentBusinesses.length"
  class="recent-section"
>

  <div class="container">


    <h2>

      🕘 Recently Viewed

    </h2>



    <div class="business-grid">


      <div
        v-for="business in recentBusinesses"
        :key="business.id"
        class="business-item"
      >


        <BusinessCard
          :business="business"
        >


        </BusinessCard>


      </div>


    </div>


  </div>


</section>


</template>



<style scoped>


.recent-section{

  padding:60px 20px;

}



.container{

  max-width:1200px;

  margin:auto;

}



h2{

  font-size:32px;

  font-weight:800;

  margin-bottom:30px;

}



.business-grid{

  display:grid;

  grid-template-columns:
  repeat(auto-fit,minmax(280px,1fr));

  gap:25px;

}



.business-item{

  transition:0.3s;

}



.business-item:hover{

  transform:translateY(-5px);

}



@media(max-width:768px){

  h2{

    font-size:26px;

  }

}


</style>