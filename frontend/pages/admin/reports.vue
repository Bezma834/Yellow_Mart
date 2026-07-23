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
📈 Admin Reports
</h1>



<div class="cards">


<div class="card">

<h2>
👥 Users
</h2>

<p>
{{users}}
</p>

</div>




<div class="card">

<h2>
🏪 Businesses
</h2>

<p>
{{businesses}}
</p>

</div>




<div class="card">

<h2>
📂 Categories
</h2>

<p>
{{categories}}
</p>

</div>




<div class="card">

<h2>
✅ Approved Businesses
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



.cards{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:20px;

}



.card{

background:white;

padding:25px;

border-radius:15px;

box-shadow:0 10px 30px #0002;

text-align:center;

}



.card p{

font-size:40px;

font-weight:900;

color:#eab308;

}


</style>