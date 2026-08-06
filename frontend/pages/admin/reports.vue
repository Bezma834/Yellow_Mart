<script setup lang="ts">

definePageMeta({

layout:"admin"

})


import { ref,onMounted } from "vue"
import { gql } from "@apollo/client/core"

const { $apollo } = useNuxtApp() as any



const users = ref(0)

const businesses = ref(0)

const categories = ref(0)

const approvedBusinesses = ref(0)



const GET_REPORTS = gql`

query {

 users_aggregate {

  aggregate {

   count

  }

 }


 businesses_aggregate {

  aggregate {

   count

  }

 }


 categories_aggregate {

  aggregate {

   count

  }

 }


 approved:businesses_aggregate(
 
 where:{
  status:{
   _eq:"approved"
  }
 }

 ){

  aggregate{

   count

  }

 }


}

`



const loadReports = async()=>{


const {data}=await $apollo.query({

query:GET_REPORTS

})


users.value =
data.users_aggregate.aggregate.count


businesses.value =
data.businesses_aggregate.aggregate.count


categories.value =
data.categories_aggregate.aggregate.count


approvedBusinesses.value =
data.approved.aggregate.count


}



onMounted(()=>{

loadReports()

})

</script>



<template>

<div class="reports">


<h1>
<svg class="title-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
Admin Reports
</h1>



<div class="cards">


<div class="card">

<div class="stat-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
</div>

<h2>
Users
</h2>

<p>
{{users}}
</p>

</div>




<div class="card">

<div class="stat-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
</div>

<h2>
Businesses
</h2>

<p>
{{businesses}}
</p>

</div>




<div class="card">

<div class="stat-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
</div>

<h2>
Categories
</h2>

<p>
{{categories}}
</p>

</div>




<div class="card">

<div class="stat-icon approved-icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
</div>

<h2>
Approved Businesses
</h2>

<p>
{{approvedBusinesses}}
</p>

</div>



</div>


</div>

</template>



<style scoped>


.reports{

padding:30px;

}

.reports h1{

font-size:35px;

font-weight:900;

margin-bottom:35px;

display:flex;

align-items:center;

gap:12px;

color:var(--color-text-primary);

}

.title-icon{

color:var(--color-primary);

flex-shrink:0;

}

.cards{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:20px;

}

.card{

background:var(--color-surface);

padding:28px 20px;

border-radius:20px;

box-shadow:0 10px 30px #0002;

text-align:center;

transition:.2s;

}

.card:hover{

transform:translateY(-4px);

box-shadow:var(--shadow-md);

}

.stat-icon{

width:52px;

height:52px;

margin:0 auto 14px;

border-radius:14px;

background:var(--color-primary-light);

color:var(--color-primary-hover);

display:flex;

align-items:center;

justify-content:center;

}

.approved-icon{

background:rgba(34,197,94,.12);

color:#16a34a;

}

.card h2{

font-size:17px;

font-weight:800;

color:var(--color-text-primary);

}

.card p{

font-size:40px;

font-weight:900;

color:var(--color-primary-hover);

margin-top:8px;

}

@media(max-width:900px){

.cards{

grid-template-columns:repeat(2,1fr);

}

}

@media(max-width:520px){

.cards{

grid-template-columns:1fr;

}

}

</style>

<style>
:root.dark .reports {
  background: var(--color-dark-bg);
  min-height: 100vh;
}
:root.dark .card {
  background: var(--color-dark-surface);
}
:root.dark .card h2 {
  color: var(--color-text-primary);
}
:root.dark .card p {
  color: var(--color-primary);
}
</style>