<script setup lang="ts">
definePageMeta({
  layout:"admin"
})
import { ref, onMounted } from "vue"
import { GET_ADMIN_STATS } from "~/graphql/queries"

const stats = ref({
  businesses: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  users: 0,
  categories: 0
})

const { $apollo } = useNuxtApp() as any
const loadStats = async()=>{


try{


const {data} = await $apollo.query({

query:GET_ADMIN_STATS,

fetchPolicy:"network-only"

})


stats.value.businesses =
data.businesses_aggregate.aggregate.count


stats.value.pending =
data.pending_businesses.aggregate.count


stats.value.approved =
data.approved_businesses.aggregate.count


stats.value.rejected =
data.rejected_businesses.aggregate.count


stats.value.categories =
data.categories_aggregate.aggregate.count


stats.value.users =
data.users_aggregate.aggregate.count



}

catch(error){

console.error(
"ADMIN STATS ERROR:",
error
)

}


}
onMounted(()=>{

loadStats()

})
</script>


<template>

<section class="admin-page">

  <div class="admin-container">


    <!-- HEADER -->

    <div class="admin-header">

      <div>

        <h1>
          Admin Dashboard 👋
        </h1>

        <p>
          Manage Yellow-Mart marketplace
        </p>

      </div>


    </div>



    <!-- STAT CARDS -->


    <div class="stats-grid">


      <div class="stat-card">

        <h3>
          🏪 Businesses
        </h3>

        <p>
          {{ stats.businesses }}
        </p>

      </div>



      <div class="stat-card pending">

        <h3>
          ⏳ Pending
        </h3>

        <p>
          {{ stats.pending }}
        </p>

      </div>



      <div class="stat-card approved">

        <h3>
          ✅ Approved
        </h3>

        <p>
          {{ stats.approved }}
        </p>

      </div>



      <div class="stat-card rejected">

        <h3>
          ❌ Rejected
        </h3>

        <p>
          {{ stats.rejected }}
        </p>

      </div>



      <div class="stat-card">

        <h3>
          👥 Users
        </h3>

        <p>
          {{ stats.users }}
        </p>

      </div>



      <div class="stat-card">

        <h3>
          📂 Categories
        </h3>

        <p>
          {{ stats.categories }}
        </p>

      </div>



    </div>



    <!-- QUICK ACTIONS -->


    <div class="actions">


      <h2>
        Quick Actions
      </h2>


      <div class="action-buttons">


        <button>
          🏪 Manage Businesses
        </button>


        <button>
          📂 Manage Categories
        </button>


        <button>
          👥 Manage Users
        </button>


      </div>


    </div>


  </div>


</section>


</template>



<style scoped>


.admin-page{

min-height:100vh;

background:#f8fafc;

padding:50px 20px;

}



.admin-container{

max-width:1200px;

margin:auto;

}



.admin-header{

background:#facc15;

padding:40px;

border-radius:25px;

margin-bottom:40px;

}



.admin-header h1{

font-size:38px;

font-weight:900;

color:#111827;

}



.admin-header p{

color:#374151;

font-size:18px;

}



.stats-grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(220px,1fr));

gap:25px;

}



.stat-card{

background:white;

padding:30px;

border-radius:25px;

box-shadow:

0 10px 25px rgba(0,0,0,.08);

transition:.3s;

}



.stat-card:hover{

transform:translateY(-8px);

}



.stat-card h3{

font-size:18px;

}



.stat-card p{

font-size:40px;

font-weight:900;

margin-top:15px;

}



.pending{

border-left:6px solid #facc15;

}



.approved{

border-left:6px solid #22c55e;

}



.rejected{

border-left:6px solid #ef4444;

}



.actions{

margin-top:50px;

}



.actions h2{

font-size:28px;

font-weight:800;

}



.action-buttons{

display:flex;

gap:20px;

margin-top:20px;

flex-wrap:wrap;

}



.action-buttons button{

background:#111827;

color:white;

padding:15px 25px;

border-radius:15px;

border:none;

cursor:pointer;

font-weight:700;

transition:.3s;

}



.action-buttons button:hover{

background:#facc15;

color:#111827;

}



@media(max-width:700px){

.admin-header h1{

font-size:28px;

}

}


</style>