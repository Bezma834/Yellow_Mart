<script setup lang="ts">
definePageMeta({
  layout:"admin"
})

import { ref, onMounted } from "vue"

import BusinessCard from "~/components/BusinessCard.vue"

import {
  GET_PENDING_BUSINESSES,
  APPROVE_BUSINESS,
  REJECT_BUSINESS
} from "~/graphql/queries"


const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])

const loading = ref(true)



// LOAD PENDING BUSINESSES

const loadBusinesses = async()=>{


try{


const {data} = await $apollo.query({

query:GET_PENDING_BUSINESSES,

fetchPolicy:"network-only"

})


businesses.value =
data.businesses || []



}

catch(error){

console.error(
"ADMIN BUSINESS ERROR:",
error
)

}


finally{

loading.value=false

}


}




// APPROVE

const approveBusiness = async(id:string)=>{


try{


await $apollo.mutate({

mutation:APPROVE_BUSINESS,

variables:{
id
}

})


loadBusinesses()


}

catch(error){

console.error(error)

}


}



// REJECT

const rejectBusiness = async(id:string)=>{


try{


await $apollo.mutate({

mutation:REJECT_BUSINESS,

variables:{
id
}

})


loadBusinesses()


}

catch(error){

console.error(error)

}


}



onMounted(()=>{

loadBusinesses()

})


</script>


<template>


<section class="admin-business-page">


<div class="container">


<h1>
⏳ Pending Businesses
</h1>



<div
v-if="loading"
class="loading"
>

Loading...

</div>



<div
v-else-if="businesses.length"
class="business-grid"
>


<div
v-for="business in businesses"
:key="business.id"
class="business-item"
>


<BusinessCard
:business="business"
/>


<div class="actions">


<button
class="approve"
@click="approveBusiness(business.id)"
>
✅ Approve
</button>


<button
class="reject"
@click="rejectBusiness(business.id)"
>
❌ Reject
</button>


</div>


</div>



</div>



<div
v-else
class="empty"
>

No pending businesses 🎉

</div>



</div>


</section>


</template>


<style scoped>


.admin-business-page{

min-height:100vh;

background:#f8fafc;

padding:50px 20px;

}


.container{

max-width:1200px;

margin:auto;

}


h1{

font-size:36px;

font-weight:900;

margin-bottom:40px;

}



.business-grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(300px,1fr));

gap:30px;

}



.business-item{

background:white;

padding:20px;

border-radius:25px;

box-shadow:
0 10px 25px rgba(0,0,0,.08);

}



.actions{

display:flex;

gap:15px;

margin-top:20px;

}



.actions button{

padding:12px 20px;

border:none;

border-radius:12px;

cursor:pointer;

font-weight:700;

}



.approve{

background:#22c55e;

color:white;

}



.reject{

background:#ef4444;

color:white;

}



.empty{

background:white;

padding:50px;

border-radius:25px;

text-align:center;

}



</style>