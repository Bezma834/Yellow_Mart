<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { gql } from "@apollo/client"

import { useAuth } from "~/composables/useAuth"


const router = useRouter()

const { user } = useAuth()

const { $apollo } = useNuxtApp() as any



const businesses = ref<any[]>([])

const loading = ref(true)

const showDeleteModal = ref(false)

const selectedBusiness = ref<any>(null)

const showSuccess = ref(false)



// Open delete modal

const openDeleteModal = (business:any)=>{


console.log(
"SELECTED BUSINESS:",
business
)



selectedBusiness.value = business


showDeleteModal.value = true


}




// Get businesses owned by user

const GET_MY_BUSINESSES = gql`

query GetMyBusinesses(
  $owner_id: uuid!
){

businesses(
where:{
owner_id:{
_eq:$owner_id
}
}

){

id
name
description
phone
address
city
image
lat
lng
views
likes


category{

id
name

}


}

}

`




// Delete mutation

const DELETE_BUSINESS = gql`

mutation DeleteBusiness(
$id:uuid!
){

delete_businesses_by_pk(
id:$id
){

id

}

}

`




// Load businesses

const loadBusinesses = async()=>{


if(!user.value){

router.push("/login")

return

}



try{


const result = await $apollo.query({

query:GET_MY_BUSINESSES,

variables:{

owner_id:user.value.id

},

fetchPolicy:"network-only"

})


console.log(
"MY BUSINESSES:",
result.data.businesses
)


businesses.value =
result.data.businesses



}
catch(error){

console.error(
"LOAD ERROR:",
error
)

}
finally{

loading.value=false

}


}




// Delete business

const deleteBusiness = async(id:string)=>{


console.log(
"DELETING:",
id
)


try{


const result = await $apollo.mutate({

mutation:DELETE_BUSINESS,

variables:{
id
}

})


console.log(
"DELETE RESULT:",
result
)



// remove from UI immediately

businesses.value =
businesses.value.filter(
(item)=>item.id !== id
)



showDeleteModal.value=false


selectedBusiness.value=null


showSuccess.value=true



setTimeout(()=>{

showSuccess.value=false

},2500)



}
catch(error){

console.error(
"DELETE ERROR:",
error
)

}


}




// Edit page navigation

const editBusiness = (id:string)=>{


router.push(
`/edit-business/${id}`
)


}





onMounted(()=>{


loadBusinesses()


})


</script>

<template>

<div class="page">

  <!-- Header -->
  <div class="header">

    <div>
      <h1>
        <svg class="title-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
        My Businesses
      </h1>
      <p>Manage your listed businesses</p>
    </div>

    <button
      @click="router.push('/add-business')"
      class="add-business-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Your First Business
    </button>

  </div>


  <!-- Loading -->
  <div
    v-if="loading"
    class="loading"
  >
    Loading businesses...
  </div>


  <!-- Business List -->
  <div
    v-else-if="businesses.length"
    class="grid"
  >

    <div
      v-for="business in businesses"
      :key="business.id"
      class="business-wrapper"
    >

      <img
        :src="business.image"
        class="business-image"
      />

      <h2>{{ business.name }}</h2>

      <p>{{ business.description }}</p>

      <div class="info">

        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ business.city }}
        </span>

        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {{ business.likes }}
        </span>

        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {{ business.views }}
        </span>

      </div>

      <div class="actions">

        <button
          @click="editBusiness(business.id)"
          class="edit-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          Edit
        </button>

        <button
          @click="openDeleteModal(business)"
          class="delete-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>

      </div>

    </div>

  </div>


  <!-- Empty State -->
  <div
    v-else
    class="empty-state"
  >

    <div class="empty-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
    </div>

    <h2>No businesses yet</h2>

    <p>
      Start growing your business today.
      Create your first listing and reach thousands of customers.
    </p>

    <button
      @click="router.push('/add-business')"
      class="add-business-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
      Add Your First Business
    </button>

  </div>


  <!-- Delete Modal -->
  <div
    v-if="showDeleteModal"
    class="overlay"
  >

    <div class="modal">

      <h2>Delete Business?</h2>

      <p>
        Are you sure you want to delete
        <strong>{{ selectedBusiness?.name }}</strong>?
      </p>

      <div class="modal-actions">

        <button
          @click="showDeleteModal = false"
          class="cancel"
        >
          Cancel
        </button>

        <button
          @click="deleteBusiness(selectedBusiness.id)"
          class="confirm"
        >
          Delete
        </button>

      </div>

    </div>

  </div>

</div>

</template>
<style scoped>

.info{
  display:flex;
  justify-content:center;
  gap:18px;
  margin:18px 0;
  color:var(--color-text-tertiary);
  font-size:14px;
  font-weight:600;
}

.info span{
  display:inline-flex;
  align-items:center;
  gap:5px;
}

.info svg{
  color:var(--color-primary-hover);
  flex-shrink:0;
}

.page{
  min-height:100vh;
  background:var(--color-bg-secondary);
  padding:90px 30px 50px;
}

/* ================= HEADER ================= */

.header{
  max-width:1200px;
  margin:0 auto 40px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:20px;
}

.header h1{
  font-size:38px;
  font-weight:800;
  color:var(--color-text-primary);
  margin:0;
  display:flex;
  align-items:center;
  gap:12px;
}

.title-icon{
  color:var(--color-primary);
}

.header p{
  margin-top:8px;
  color:var(--color-text-tertiary);
  font-size:16px;
}

/* ================= ADD BUTTON ================= */

.add-business-btn{
  background:var(--color-primary);
  color:var(--color-text-primary);
  border:none;
  padding:14px 26px;
  border-radius:14px;
  font-weight:700;
  font-family:inherit;
  cursor:pointer;
  transition:.3s;
  display:inline-flex;
  align-items:center;
  gap:8px;
  box-shadow:0 4px 16px -4px var(--color-primary-glow);
}

.add-business-btn:hover{
  background:var(--color-primary-hover);
  transform:translateY(-3px);
  box-shadow:0 8px 24px -4px var(--color-primary-glow);
}

/* ================= GRID ================= */

.grid{
  max-width:1200px;
  margin:auto;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(330px,1fr));
  gap:28px;
}

/* ================= CARD ================= */

.business-wrapper{
  background:var(--color-surface);
  border-radius:24px;
  padding:24px;
  text-align:center;
  box-shadow:0 12px 30px rgba(15,23,42,.08);
  transition:.3s;
}

.business-wrapper:hover{
  transform:translateY(-8px);
  box-shadow:0 20px 45px rgba(15,23,42,.15);
}

/* ================= IMAGE ================= */

.business-image{
  display:block;
  width:220px;
  height:220px;
  margin:0 auto 20px;
  object-fit:cover;
  border-radius:18px;
  border:4px solid white;
  box-shadow:0 8px 25px rgba(0,0,0,.15);
}

.business-wrapper h2{
  font-size:22px;
  font-weight:700;
  color:var(--color-text-primary);
  margin-bottom:8px;
}

.business-wrapper p{
  color:#6b7280;
  line-height:1.6;
  margin-bottom:20px;
}

/* ================= BUTTONS ================= */

.actions{
  display:flex;
  gap:12px;
  margin-top:20px;
}

.actions button{
  flex:1;
  padding:14px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:700;
  font-size:15px;
  transition:.25s;
}

.edit-btn{
  background:#2563eb;
  color:white;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
}

.edit-btn:hover{
  background:#1d4ed8;
  transform:translateY(-2px);
}

.delete-btn{
  background:#ef4444;
  color:white;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
}

.delete-btn:hover{
  background:#dc2626;
  transform:translateY(-2px);
}

/* ================= LOADING ================= */

.loading{
  text-align:center;
  font-size:22px;
  color:var(--color-text-tertiary);
}

/* ================= EMPTY STATE ================= */

.empty-state{
  max-width:700px;
  margin:80px auto;
  background:var(--color-surface);
  border-radius:28px;
  padding:60px;
  text-align:center;
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

.empty-icon{
  width:110px;
  height:110px;
  margin:0 auto 20px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:50%;
  background:var(--color-primary-light);
  color:var(--color-primary);
}

.empty-state h2{
  font-size:32px;
  margin-bottom:15px;
  color:var(--color-text-primary);
}

.empty-state p{
  font-size:18px;
  color:#6b7280;
  margin-bottom:30px;
}

/* ================= DELETE MODAL ================= */

.overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.55);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
}

.modal{
  background:var(--color-surface);
  width:380px;
  border-radius:24px;
  padding:30px;
  text-align:center;
  box-shadow:0 20px 50px rgba(0,0,0,.25);
}

.modal h2{
  margin-bottom:15px;
}

.modal p{
  color:var(--color-text-tertiary);
}

.modal-actions{
  display:flex;
  gap:15px;
  margin-top:25px;
}

.cancel,
.confirm{
  flex:1;
  padding:14px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:700;
}

.cancel{
  background:#e5e7eb;
}

.confirm{
  background:#ef4444;
  color:white;
}

.confirm:hover{
  background:#dc2626;
}

/* ================= RESPONSIVE ================= */

@media (max-width:768px){

  .header{
    flex-direction:column;
    text-align:center;
  }

  .business-image{
    width:180px;
    height:180px;
  }

  .actions{
    flex-direction:column;
  }

}

</style>

<style>
:root.dark .page {
  background: var(--color-dark-bg);
}
:root.dark .business-wrapper {
  background: var(--color-dark-bg-secondary);
  box-shadow: none;
}
:root.dark .business-wrapper:hover {
  box-shadow: none;
}
:root.dark .header h1,
:root.dark .business-wrapper h2,
:root.dark .empty-state h2 {
  color: var(--color-text-primary);
}
:root.dark .header p,
:root.dark .info,
:root.dark .loading,
:root.dark .modal p {
  color: var(--color-text-secondary);
}
:root.dark .business-wrapper p,
:root.dark .empty-state p {
  color: var(--color-text-tertiary);
}
:root.dark .empty-state {
  background: var(--color-dark-bg-secondary);
}
:root.dark .modal {
  background: var(--color-dark-bg-secondary);
}
:root.dark .cancel {
  background: var(--color-dark-bg);
  color: var(--color-text-primary);
}
</style>

