<script setup lang="ts">

import { ref, onMounted } from "vue"
import BusinessCard from "~/components/BusinessCard.vue"

import { GET_USER_FAVORITES } from "~/graphql/queries"

import { useAuth } from "~/composables/useAuth"


const { user } = useAuth()

const { $apollo } = useNuxtApp() as any


const favorites = ref<any[]>([])

const loading = ref(true)



const loadFavorites = async()=>{


  if(!user.value){

    console.log("No user logged in")

    loading.value = false

    return

  }


  try{


    const result = await $apollo.query({

      query: GET_USER_FAVORITES,

      variables:{

        user_id:user.value.id

      },

      fetchPolicy:"network-only"

    })


    console.log(
      "FAVORITES:",
      result.data.favorites
    )


    favorites.value =
      result.data.favorites.map(
        (item:any)=>item.business
      )


  }
  catch(error){

    console.error(
      "Favorite loading error:",
      error
    )

  }
  finally{

    loading.value=false

  }


}



onMounted(()=>{

  loadFavorites()

})


</script>


<template>

<div class="page">


<h1>
❤️ Favorite Businesses
</h1>


<p class="subtitle">
Your saved businesses
</p>



<div v-if="loading">

Loading favorites...

</div>



<div
v-else-if="favorites.length === 0"
class="empty"
>

No favorite businesses yet.

</div>



<div
v-else
class="grid"
>


<BusinessCard
v-for="business in favorites"
:key="business.id"
:business="business"
/>


</div>


</div>

</template>



<style scoped>

.page{

padding:100px 30px;

background:#f8fafc;

min-height:100vh;

}


h1{

text-align:center;

font-size:36px;

font-weight:900;

}



.subtitle{

text-align:center;

color:#64748b;

margin-bottom:40px;

}



.grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(280px,1fr));

gap:25px;

max-width:1200px;

margin:auto;

}



.empty{

text-align:center;

margin-top:50px;

font-size:20px;

color:#64748b;

}


</style>