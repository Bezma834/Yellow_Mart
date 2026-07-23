<template>
  <div class="page">

    <h1>
      🏪 Businesses
    </h1>


    <div class="search-area">

      <input
        v-model="search"
        placeholder="Search businesses..."
      />

    </div>



    <div class="grid">

      <div
        v-for="business in filteredBusinesses"
        :key="business.id"
        class="card"
        @click="openBusiness(business.id)"
      >


        <img
          :src="business.image || '/default-business.jpg'"
          alt="business image"
        />



        <div class="card-body">


          <h2>
            {{ business.name }}
          </h2>


          <p>
            📍 {{ business.city }}
          </p>


          <p>
            🏷️
            {{ business.category?.name || "Category" }}
          </p>


          <p class="desc">
            {{ business.description }}
          </p>


          <button>
            View Details →
          </button>


        </div>


      </div>


    </div>


  </div>
</template>



<script setup lang="ts">

import { ref, computed } from "vue"
import { useRouter } from "vue-router"


import {
  GET_ALL_BUSINESSES
} from "~/graphql/queries"



const router = useRouter()


const { $apollo } = useNuxtApp() as any



const businesses = ref<any[]>([])

const search = ref("")




// Load businesses

const loadBusinesses = async()=>{


  const {data} = await $apollo.query({

    query: GET_ALL_BUSINESSES,

    fetchPolicy:"network-only"

  })


  businesses.value =
    data.businesses || []


}



loadBusinesses()



// Search filter

const filteredBusinesses = computed(()=>{


 return businesses.value.filter((biz)=>{


  return (

    biz.name
    .toLowerCase()
    .includes(search.value.toLowerCase())

    ||

    biz.city
    ?.toLowerCase()
    .includes(search.value.toLowerCase())

  )


 })


})




// Open details

const openBusiness = (id:string)=>{

 router.push(`/businesses/${id}`)

}



</script>




<style scoped>


.page{

padding:100px 30px;

background:#f8fafc;

min-height:100vh;

}



h1{

text-align:center;

font-size:40px;

font-weight:900;

margin-bottom:30px;

}



.search-area{

display:flex;

justify-content:center;

margin-bottom:30px;

}



.search-area input{

width:400px;

padding:14px;

border-radius:30px;

border:1px solid #ddd;

}



.grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(280px,1fr));

gap:25px;

}



.card{

background:white;

border-radius:20px;

overflow:hidden;

cursor:pointer;

box-shadow:

0 10px 30px rgba(0,0,0,.1);

transition:.3s;

}



.card:hover{

transform:translateY(-8px);

}



.card img{

width:100%;

height:200px;

object-fit:cover;

}



.card-body{

padding:20px;

}



.card-body h2{

font-size:22px;

font-weight:800;

}



.desc{

color:#64748b;

height:45px;

overflow:hidden;

}



button{

margin-top:15px;

background:#facc15;

border:none;

padding:10px 20px;

border-radius:10px;

font-weight:700;

cursor:pointer;

}


</style>