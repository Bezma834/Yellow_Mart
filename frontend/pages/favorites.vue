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
<svg class="title-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
Favorite Businesses
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

background:var(--color-bg-secondary);

min-height:100vh;

}


h1{

text-align:center;

font-size:36px;

font-weight:900;

display:flex;

align-items:center;

justify-content:center;

gap:12px;

}

.title-icon{

color:var(--color-primary);

}



.subtitle{

text-align:center;

color:var(--color-text-tertiary);

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

padding:60px 30px;

font-size:20px;

color:var(--color-text-tertiary);

background:var(--color-surface);

border:1px dashed var(--color-border);

border-radius:var(--radius-3xl);

max-width:600px;

margin-left:auto;

margin-right:auto;

}

.empty-icon{

display:flex;

justify-content:center;

margin-bottom:15px;

color:var(--color-primary);

}

.empty h2{

margin-bottom:10px;

color:var(--color-text-primary);

}

.empty p{

margin-bottom:20px;

}


</style>

<style>
:root.dark .page {
  background: var(--color-dark-bg-secondary);
}

:root.dark .page h1 {
  color: var(--color-text-primary);
}

:root.dark .subtitle {
  color: var(--color-text-secondary);
}

:root.dark .empty {
  color: var(--color-text-secondary);
}
</style>