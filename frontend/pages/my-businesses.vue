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
      <h1>🏪 My Businesses</h1>
      <p>Manage your listed businesses</p>
    </div>

    <button
      @click="router.push('/add-business')"
      class="add-business-btn"
    >
      ➕ Add Your First Business
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

        <span>📍 {{ business.city }}</span>

        <span>❤️ {{ business.likes }}</span>

        <span>👁 {{ business.views }}</span>

      </div>

      <div class="actions">

        <button
          @click="editBusiness(business.id)"
          class="edit-btn"
        >
          ✏️ Edit
        </button>

        <button
          @click="openDeleteModal(business)"
          class="delete-btn"
        >
          🗑 Delete
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
      🏪
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
      🚀 Add Your First Business
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
  color:#64748b;
  font-size:14px;
  font-weight:600;
}
.page{
  min-height:100vh;
  background:#f5f7fb;
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
  color:#0f172a;
  margin:0;
}

.header p{
  margin-top:8px;
  color:#64748b;
  font-size:16px;
}

/* ================= ADD BUTTON ================= */

.add-business-btn{
  background:#f97316;
  color:white;
  border:none;
  padding:14px 26px;
  border-radius:14px;
  font-weight:700;
  cursor:pointer;
  transition:.3s;
}

.add-business-btn:hover{
  background:#ea580c;
  transform:translateY(-3px);
  box-shadow:0 12px 30px rgba(249,115,22,.35);
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
  background:white;
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
  color:#111827;
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
}

.edit-btn:hover{
  background:#1d4ed8;
  transform:translateY(-2px);
}

.delete-btn{
  background:#ef4444;
  color:white;
}

.delete-btn:hover{
  background:#dc2626;
  transform:translateY(-2px);
}

/* ================= LOADING ================= */

.loading{
  text-align:center;
  font-size:22px;
  color:#64748b;
}

/* ================= EMPTY STATE ================= */

.empty-state{
  max-width:700px;
  margin:80px auto;
  background:white;
  border-radius:28px;
  padding:60px;
  text-align:center;
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

.empty-icon{
  font-size:70px;
  margin-bottom:20px;
}

.empty-state h2{
  font-size:32px;
  margin-bottom:15px;
  color:#111827;
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
  background:white;
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
  color:#64748b;
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



