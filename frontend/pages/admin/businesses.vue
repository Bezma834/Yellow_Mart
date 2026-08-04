<script setup lang="ts">
definePageMeta({
  layout:"admin"
})

import { ref, onMounted } from "vue"

import BusinessCard from "~/components/BusinessCard.vue"

import {
  GET_PENDING_BUSINESSES,
  GET_BUSINESS_OWNER,
  DELETE_USER
} from "~/graphql/queries"

import {
  APPROVE_BUSINESS,
  DELETE_BUSINESS
} from "~/graphql/mutations"


const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])

const loading = ref(true)

const statusMsg = ref("")
const statusType = ref<"success" | "error">("success")



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


const showStatus = (msg: string, type: "success" | "error") => {
  statusMsg.value = msg
  statusType.value = type
  setTimeout(() => { statusMsg.value = "" }, 4000)
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

showStatus("Business approved successfully", "success")
loadBusinesses()


}

catch(error){

console.error(error)
showStatus("Failed to approve business", "error")

}


}


// Fetch owner_id + hard-delete business AND owner account
const hardDeleteBusiness = async (id: string) => {
  try {

    const { data } = await $apollo.query({
      query: GET_BUSINESS_OWNER,
      variables: { id },
      fetchPolicy: "network-only"
    })

    const ownerId = data?.businesses_by_pk?.owner_id

    // Delete the owner account first
    if (ownerId) {
      await $apollo.mutate({
        mutation: DELETE_USER,
        variables: { id: ownerId }
      })
    }

    // Then delete the business
    await $apollo.mutate({
      mutation: DELETE_BUSINESS,
      variables: { id }
    })

    showStatus("Business deleted and owner account removed permanently", "success")
    loadBusinesses()
  } catch (error) {
    console.error("DELETE ERROR:", error)
    showStatus("Failed to delete business", "error")
  }
}


// REJECT — hard delete + remove owner account
const rejectBusiness = async (id: string) => {
  if (!window.confirm("Rejecting will permanently delete this business AND the owner's account. Continue?")) return
  await hardDeleteBusiness(id)
}


// DELETE — hard delete + remove owner account
const deleteBusiness = async (id: string) => {
  if (!window.confirm("Are you sure? This will permanently delete this business AND the owner's account.")) return
  await hardDeleteBusiness(id)
}


onMounted(()=>{

loadBusinesses()

})


</script>


<template>


<section class="admin-business-page">


<div class="container">


<h1>
<svg class="title-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
Pending Businesses
</h1>


<div
v-if="statusMsg"
:class="['status-msg', statusType]"
>
{{ statusMsg }}
</div>



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
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
Approve
</button>


<button
class="reject"
@click="rejectBusiness(business.id)"
>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
Reject
</button>


<button
class="delete"
@click="deleteBusiness(business.id)"
>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
Delete
</button>


</div>


</div>



</div>



<div
v-else
class="empty"
>

<svg class="empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
<p>No pending businesses</p>

</div>



</div>


</section>


</template>


<style scoped>


.admin-business-page{

min-height:100vh;

background:var(--color-bg-secondary);

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

display:flex;

align-items:center;

gap:12px;

}

.title-icon{

color:var(--color-primary);

flex-shrink:0;

}


.status-msg {
  padding: 14px 24px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  animation: fadeSlideIn 0.3s ease;
}

.status-msg.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-msg.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
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

border-radius:var(--radius-lg);

cursor:pointer;

font-weight:700;

transition: all 0.2s ease;

display:flex;

align-items:center;

gap:8px;

justify-content:center;

}



.actions button:hover{

transform: translateY(-2px);

box-shadow: var(--shadow-md);

}



.approve{

background:#22c55e;

color:white;

}



.reject{

background:#ef4444;

color:white;

}



.delete{

background:#991b1b;

color:white;

}

.delete:hover{

background:#7f1d1d;

}



.empty{

background:white;

padding:50px;

border-radius:25px;

text-align:center;

display:flex;

flex-direction:column;

align-items:center;

gap:12px;

}

.empty-icon{

color:var(--color-primary);

}

.empty p{

font-size:17px;

font-weight:600;

color:var(--color-text-secondary);

}

</style>

<style>
:root.dark .status-msg.success {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.25);
}
:root.dark .status-msg.error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.25);
}
:root.dark .business-item {
  background: var(--color-dark-surface);
}
:root.dark .business-item h3 {
  color: var(--color-text-primary);
}
:root.dark .business-item p {
  color: var(--color-text-secondary);
}
:root.dark .empty {
  background: var(--color-dark-surface);
  color: var(--color-text-secondary);
}
</style>
