<script setup lang="ts">

const logout = () => {


  localStorage.removeItem("token")

  localStorage.removeItem("user")


  navigateTo("/login")


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
  @click="logout"
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

</style>