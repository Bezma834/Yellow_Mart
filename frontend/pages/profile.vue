<script setup lang="ts">

import { ref, onMounted } from "vue"
import gql from "graphql-tag"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"


const router = useRouter()


const { user, logout } = useAuth()


const { $apollo } = useNuxtApp() as any



const profile = ref<any>(null)



const totalBusinesses = ref(0)

const totalFavorites = ref(0)

const totalViews = ref(0)



const loading = ref(true)

const showLogoutModal = ref(false)

const requestLogout = ()=>{

  showLogoutModal.value = true

}

const confirmLogout = ()=>{

  showLogoutModal.value = false

  logout()

  router.push("/login")

}

const cancelLogout = ()=>{

  showLogoutModal.value = false

}



const GET_PROFILE = gql`

query GetProfile($id:uuid!){


users_by_pk(id:$id){

id

username

fullname

email

avatar

role

phone

bio

}



businesses(
where:{
owner_id:{
_eq:$id
}
}
){


id

views


favorites_aggregate{

aggregate{

count

}

}


}



}

`




const loadProfile = async()=>{


if(!user.value){

router.push("/login")

return

}



try{


const result =
await $apollo.query({

query:GET_PROFILE,


variables:{


id:user.value.id


},


fetchPolicy:"network-only"


})




profile.value =
result.data.users_by_pk



const businesses =
result.data.businesses



totalBusinesses.value =
businesses.length



let favorites = 0

let views = 0



businesses.forEach((b:any)=>{


favorites +=
b.favorites_aggregate.aggregate.count || 0



views +=
b.views || 0



})



totalFavorites.value =
favorites



totalViews.value =
views



console.log(
"PROFILE:",
profile.value
)



}

catch(error){


console.error(
"PROFILE ERROR:",
error
)


}

finally{


loading.value=false


}


}




onMounted(()=>{


loadProfile()


})



</script>

<template>

<div class="profile-page">


<!-- Hero -->

<section class="hero">

  <span class="eyebrow">My Account</span>

  <!-- Avatar -->

  <div class="avatar-wrapper">

    <img
      v-if="profile?.avatar"
      :src="profile.avatar"
      class="avatar"
    />

    <div
      v-else
      class="avatar-placeholder"
    >
      {{ user?.fullname?.charAt(0).toUpperCase() || "U" }}
    </div>

  </div>


  <h1>
    {{ user?.fullname }}
  </h1>


  <p>
    @{{ user?.username }}
  </p>


  <span class="email">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    {{ user?.email }}
  </span>


  <div class="role">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
    Business Owner
  </div>


</section>



<!-- Statistics -->

<section class="stats">


<div class="stat-card">

<div class="stat-icon">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
</div>

<h2>
{{ totalBusinesses }}
</h2>

<p>
Businesses
</p>

</div>



<div class="stat-card">

<div class="stat-icon">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
</div>

<h2>
{{ totalFavorites }}
</h2>

<p>
Favorites
</p>

</div>



<div class="stat-card">

<div class="stat-icon">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
</div>

<h2>
{{ totalViews }}
</h2>

<p>
Views
</p>

</div>


</section>





<!-- Quick Actions -->

<section class="actions">


<button
class="action"
@click="router.push('/edit-profile')"
>

<span class="action-label">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
Edit Profile
</span>

<span class="action-arrow">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
</span>

</button>



<button
class="action"
@click="router.push('/favorites')"
>

<span class="action-label">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
My Favorites
</span>

<span class="action-arrow">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
</span>

</button>




<button
class="action"
@click="router.push('/my-businesses')"
>

<span class="action-label">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
My Businesses
</span>

<span class="action-arrow">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
</span>

</button>




<button
class="action"
@click="router.push('/change-password')"
>

<span class="action-label">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
Change Password
</span>

<span class="action-arrow">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
</span>

</button>




<button
class="action"
@click="router.push('/settings')"
>

<span class="action-label">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
Settings
</span>

<span class="action-arrow">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
</span>

</button>




<button
class="action logout"
@click="requestLogout"
>

<span class="action-label">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
Logout
</span>

<span class="action-arrow">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
</span>

</button>



</section>



<!-- Logout Confirm Modal -->

<div
  v-if="showLogoutModal"
  class="modal-overlay"
  @click.self="cancelLogout"
>

  <div class="modal-box">

    <div class="modal-icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </div>

    <h3>Log out?</h3>

    <p>Are you sure you want to log out of your account?</p>

    <div class="modal-actions">

      <button class="modal-cancel" @click="cancelLogout">
        Cancel
      </button>

      <button class="modal-confirm" @click="confirmLogout">
        Log Out
      </button>

    </div>

  </div>

</div>



</div>


</template>
<style scoped>

.profile-page{
  max-width:1100px;
  margin:auto;
  padding:100px 20px 60px;
}

/* HERO */

.hero{
  background:var(--color-surface);
  border-radius:30px;
  padding:45px;
  text-align:center;
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

.avatar{

  width:120px;
  height:120px;

  margin:auto;

  border-radius:50%;

  background:linear-gradient(135deg,#fb923c,#ea580c);

  display:flex;

  justify-content:center;

  align-items:center;

  color:white;

  font-size:48px;

  font-weight:800;

  margin-bottom:20px;

}

.hero h1{

  margin:0;

  font-size:34px;

  color:var(--color-text-primary);

}

.hero p{

  color:var(--color-text-tertiary);

  margin:10px 0;

}

.email{

  color:#2563eb;

  display:inline-flex;

  align-items:center;

  gap:6px;

  margin-bottom:15px;

}

.role{

  display:inline-flex;

  align-items:center;

  gap:6px;

  background:var(--color-primary-light);

  color:#ea580c;

  padding:10px 20px;

  border-radius:999px;

  font-weight:700;

}

/* STATS */

.stats{

  display:grid;

  grid-template-columns:repeat(3,1fr);

  gap:25px;

  margin-top:35px;

}

.stat-card{

  background:var(--color-surface);

  border-radius:24px;

  padding:30px;

  text-align:center;

  box-shadow:0 10px 25px rgba(0,0,0,.08);

  transition:.3s;

}

.stat-card:hover{

  transform:translateY(-8px);

}

.stat-icon{

  color:var(--color-primary);

  display:flex;

  justify-content:center;

  align-items:center;

  width:60px;

  height:60px;

  margin:0 auto;

  border-radius:18px;

  background:var(--color-primary-light);

}

.stat-card h2{

  font-size:34px;

  margin:15px 0 5px;

}

.stat-card p{

  color:var(--color-text-tertiary);

}

/* ACTIONS */

.actions{

  margin-top:40px;

  background:var(--color-surface);

  border-radius:25px;

  overflow:hidden;

  box-shadow:0 10px 25px rgba(0,0,0,.08);

}

.action{

  width:100%;

  border:none;

  background:var(--color-surface);

  display:flex;

  justify-content:space-between;

  align-items:center;

  padding:22px 28px;

  font-size:17px;

  cursor:pointer;

  transition:.3s;

  border-bottom:1px solid #f1f5f9;

  font-family:inherit;

}

.action-label{

  display:inline-flex;

  align-items:center;

  gap:12px;

  color:inherit;

}

.action-arrow{

  color:var(--color-text-tertiary);

  display:inline-flex;

  align-items:center;

  transition:transform .2s ease;

}

.action:hover{

  background:var(--color-bg-secondary);

  padding-left:38px;

}

.action:hover .action-arrow{

  transform:translateX(4px);

}

.logout{

  color:#dc2626;

}

.logout:hover{

  background:#fee2e2;

}

/* Logout confirm modal */

.modal-overlay{

  position:fixed;

  inset:0;

  background:rgba(0,0,0,.5);

  backdrop-filter:blur(4px);

  display:flex;

  align-items:center;

  justify-content:center;

  z-index:9999;

  padding:20px;

  animation:fadeIn .2s ease;

}

.modal-box{

  background:var(--color-surface);

  border-radius:var(--radius-2xl);

  padding:36px 32px;

  width:400px;

  max-width:100%;

  text-align:center;

  box-shadow:var(--shadow-2xl);

  animation:popIn .25s ease;

}

.modal-icon{

  width:60px;

  height:60px;

  margin:0 auto 18px;

  border-radius:50%;

  background:var(--color-primary-light);

  color:var(--color-primary-hover);

  display:flex;

  align-items:center;

  justify-content:center;

}

.modal-box h3{

  font-size:22px;

  font-weight:900;

  margin-bottom:8px;

  color:var(--color-text-primary);

}

.modal-box p{

  color:var(--color-text-secondary);

  font-size:15px;

  margin-bottom:26px;

}

.modal-actions{

  display:flex;

  gap:12px;

}

.modal-cancel{

  flex:1;

  padding:12px;

  border:none;

  border-radius:var(--radius-lg);

  background:var(--color-bg-tertiary);

  color:var(--color-text-secondary);

  font-weight:700;

  font-size:15px;

  cursor:pointer;

  transition:.2s;

}

.modal-cancel:hover{

  background:var(--color-border);

}

.modal-confirm{

  flex:1;

  padding:12px;

  border:none;

  border-radius:var(--radius-lg);

  background:#111827;

  color:white;

  font-weight:700;

  font-size:15px;

  cursor:pointer;

  transition:.2s;

}

.modal-confirm:hover{

  background:#dc2626;

}

@keyframes fadeIn{

  from{opacity:0}

  to{opacity:1}

}

@keyframes popIn{

  from{opacity:0;transform:scale(.92) translateY(8px)}

  to{opacity:1;transform:scale(1) translateY(0)}

}

/* MOBILE */

@media(max-width:768px){

.stats{

grid-template-columns:1fr;

}

.hero{

padding:30px;

}

}

</style>

<style>
:root.dark .profile-page {
  background: var(--color-dark-bg-secondary);
  min-height: 100vh;
}

:root.dark .hero {
  background: var(--color-dark-surface);
}

:root.dark .hero h1 {
  color: var(--color-text-primary);
}

:root.dark .hero p {
  color: var(--color-text-secondary);
}

:root.dark .role {
  background: var(--color-dark-bg-secondary);
  color: var(--color-text-primary);
}

:root.dark .stat-card {
  background: var(--color-dark-surface);
}

:root.dark .stat-card p {
  color: var(--color-text-secondary);
}

:root.dark .actions {
  background: var(--color-dark-surface);
}

:root.dark .action {
  background: var(--color-dark-surface);
  color: var(--color-text-primary);
  border-color: var(--color-text-tertiary);
}

:root.dark .action:not(.logout):hover {
  background: var(--color-dark-bg-secondary);
}

:root.dark .logout:hover {
  background: var(--color-dark-bg-secondary);
}

:root.dark .modal-box {
  background: var(--color-dark-surface);
}

:root.dark .modal-box p {
  color: var(--color-text-secondary);
}

:root.dark .modal-cancel {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .modal-cancel:hover {
  background: var(--color-dark-border);
}

:root.dark .modal-confirm {
  background: var(--color-dark-surface-hover);
  color: var(--color-text-primary);
}

:root.dark .modal-confirm:hover {
  background: #dc2626;
  color: white;
}

:root.dark .email {
  color: var(--color-text-primary);
}
</style>