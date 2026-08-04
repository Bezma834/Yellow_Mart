<script setup lang="ts">
definePageMeta({
  layout:"admin",
middleware:"admin"
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
          <svg class="title-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          Admin Dashboard
        </h1>

        <p>
          Manage Yellow-Mart marketplace
        </p>

      </div>


    </div>



    <!-- STAT CARDS -->


    <div class="stats-grid">


      <div class="stat-card">

        <div class="stat-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
        </div>

        <h3>
          Businesses
        </h3>

        <p>
          {{ stats.businesses }}
        </p>

      </div>



      <div class="stat-card pending">

        <div class="stat-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>

        <h3>
          Pending
        </h3>

        <p>
          {{ stats.pending }}
        </p>

      </div>



      <div class="stat-card approved">

        <div class="stat-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>

        <h3>
          Approved
        </h3>

        <p>
          {{ stats.approved }}
        </p>

      </div>



      <div class="stat-card rejected">

        <div class="stat-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>

        <h3>
          Rejected
        </h3>

        <p>
          {{ stats.rejected }}
        </p>

      </div>



      <div class="stat-card">

        <div class="stat-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>

        <h3>
          Users
        </h3>

        <p>
          {{ stats.users }}
        </p>

      </div>



      <div class="stat-card">

        <div class="stat-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>

        <h3>
          Categories
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


        <button @click="navigateTo('/admin/businesses')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
          Manage Businesses
        </button>


        <button @click="navigateTo('/admin/categories')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Manage Categories
        </button>


        <button @click="navigateTo('/admin/users')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Manage Users
        </button>


      </div>


    </div>


  </div>


</section>


</template>



<style scoped>


.admin-page{

min-height:100vh;

background:var(--color-bg-secondary);

padding:50px 20px;

}



.admin-container{

max-width:1200px;

margin:auto;

}



.admin-header{

background:var(--color-primary);

padding:40px;

border-radius:25px;

margin-bottom:40px;

}



.admin-header h1{

font-size:38px;

font-weight:900;

color:var(--color-text-primary);

display:flex;

align-items:center;

gap:12px;

}

.title-icon{

color:var(--color-text-primary);

flex-shrink:0;

}



.admin-header p{

color:var(--color-text-secondary);

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

display:flex;

align-items:center;

gap:8px;

}

.stat-icon{

width:42px;

height:42px;

border-radius:12px;

background:rgba(245,158,11,.12);

color:var(--color-primary);

display:flex;

align-items:center;

justify-content:center;

margin-bottom:15px;

}

.stat-card.pending .stat-icon{

background:rgba(250,204,21,.15);

color:#d97706;

}

.stat-card.approved .stat-icon{

background:rgba(34,197,94,.12);

color:#16a34a;

}

.stat-card.rejected .stat-icon{

background:rgba(239,68,68,.12);

color:#dc2626;

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

display:flex;

align-items:center;

gap:10px;

}



.action-buttons button:hover{

background:var(--color-primary);

color:var(--color-text-primary);

}



@media(max-width:700px){

.admin-header h1{

font-size:28px;

}

}

</style>

<style>
:root.dark .admin-page {
  background: var(--color-dark-bg);
}
:root.dark .stat-card {
  background: var(--color-dark-surface);
}
:root.dark .stat-card h3 {
  color: var(--color-text-primary);
}
:root.dark .stat-card p {
  color: var(--color-text-secondary);
}
:root.dark .section-title {
  color: var(--color-text-primary);
}
:root.dark .action-buttons button {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}
:root.dark .action-buttons button:hover {
  background: var(--color-primary);
}
</style>