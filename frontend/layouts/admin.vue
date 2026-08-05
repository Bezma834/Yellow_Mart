<script setup lang="ts">

const showLogoutModal = ref(false)

const logout = () => {


  localStorage.removeItem("token")

  localStorage.removeItem("user")


  navigateTo("/login")


}

const requestLogout = ()=>{

  showLogoutModal.value = true

}

const confirmLogout = ()=>{

  showLogoutModal.value = false

  logout()

}

const cancelLogout = ()=>{

  showLogoutModal.value = false

}

definePageMeta({
  middleware: "admin"
})

</script>
<template>

  <div class="admin-layout">


    <!-- SIDEBAR -->

    <aside class="sidebar">

      <div class="logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
        Yellow-Mart
      </div>


      <nav>

        <NuxtLink to="/admin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          Dashboard
        </NuxtLink>


        <NuxtLink to="/admin/businesses">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
          Businesses
        </NuxtLink>


        <NuxtLink to="/admin/categories">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Categories
        </NuxtLink>


        <NuxtLink to="/admin/users">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Users
        </NuxtLink>


        <NuxtLink to="/admin/reports">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          Reports
        </NuxtLink>


      </nav>
<button
  class="logout-btn"
  @click="requestLogout"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  Logout
</button>

    </aside>



    <!-- CONTENT -->

    <main class="admin-content">

      <slot />

    </main>



  </div>

  <AppToast />



  <!-- Logout Confirm Modal -->

  <div
    v-if="showLogoutModal"
    class="admin-modal-overlay"
    @click.self="cancelLogout"
  >

    <div class="admin-modal-box">

      <div class="admin-modal-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>

      <h3>Log out?</h3>

      <p>Are you sure you want to log out of your account?</p>

      <div class="admin-modal-actions">

        <button class="admin-modal-cancel" @click="cancelLogout">
          Cancel
        </button>

        <button class="admin-modal-confirm" @click="confirmLogout">
          Log Out
        </button>

      </div>

    </div>

  </div>

</template>



<style scoped>

.admin-layout {

  display:flex;

  min-height:100vh;

}



.sidebar {

  width:260px;

  position:fixed;

  left:0;

  top:0;

  bottom:0;

  background:#111827;

  color:white;

  padding:25px;

}



.logo {

  font-size:22px;

  font-weight:800;

  margin-bottom:40px;

  display:flex;

  align-items:center;

  gap:10px;

  color:#facc15;

}

.logo svg {

  color:#facc15;

  flex-shrink:0;

}

nav {

  display:flex;

  flex-direction:column;

  gap:15px;

}

nav a {

  color:white;

  text-decoration:none;

  padding:12px;

  border-radius:10px;

  display:flex;

  align-items:center;

  gap:10px;

}

nav a svg {

  flex-shrink:0;

  opacity:.8;

}

nav a.router-link-active {

  background:#facc15;

  color:#111827;

}

nav a.router-link-active svg {

  opacity:1;

}



.admin-content {

  margin-left:260px;

  width:100%;

  padding:30px;

}

.logout-btn {

  width: 90%;

  margin: 30px auto 20px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding: 12px;

  background: #ef4444;

  color: white;

  border: none;

  border-radius: 10px;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  transition: all .25s ease;

}


.logout-btn:hover {

  background: #dc2626;

  transform: translateX(4px);

  box-shadow: 0 6px 15px rgba(239,68,68,.35);

}


.logout-btn:active {

  transform: scale(.98);

}

.admin-modal-overlay{

  position:fixed;

  inset:0;

  background:rgba(0,0,0,.55);

  backdrop-filter:blur(4px);

  display:flex;

  align-items:center;

  justify-content:center;

  z-index:99999;

  padding:20px;

}

.admin-modal-box{

  background:#ffffff;

  border-radius:var(--radius-2xl);

  padding:36px 32px;

  width:400px;

  max-width:100%;

  text-align:center;

  box-shadow:0 20px 50px rgba(0,0,0,.3);

}

.admin-modal-icon{

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

.admin-modal-box h3{

  font-size:22px;

  font-weight:900;

  margin-bottom:8px;

  color:var(--color-text-primary);

}

.admin-modal-box p{

  color:var(--color-text-secondary);

  font-size:15px;

  margin-bottom:26px;

}

.admin-modal-actions{

  display:flex;

  gap:12px;

}

.admin-modal-cancel{

  flex:1;

  padding:12px;

  border:none;

  border-radius:var(--radius-lg);

  background:#e5e7eb;

  color:var(--color-text-primary);

  font-weight:700;

  font-size:15px;

  cursor:pointer;

  transition:.2s;

}

.admin-modal-cancel:hover{

  background:#d1d5db;

}

.admin-modal-confirm{

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

.admin-modal-confirm:hover{

  background:#dc2626;

}

</style>