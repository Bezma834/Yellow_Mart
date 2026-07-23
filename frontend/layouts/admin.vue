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
        🟡 Yellow-Mart
      </div>


      <nav>

        <NuxtLink to="/admin">
          📊 Dashboard
        </NuxtLink>


        <NuxtLink to="/admin/businesses">
          🏪 Businesses
        </NuxtLink>


        <NuxtLink to="/admin/categories">
          📂 Categories
        </NuxtLink>


        <NuxtLink to="/admin/users">
          👥 Users
        </NuxtLink>


        <NuxtLink to="/admin/reports">
          📈 Reports
        </NuxtLink>


      </nav>
<button
  class="logout-btn"
  @click="logout"
>
  🚪 Logout
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

}



nav a.router-link-active {

  background:#facc15;

  color:#111827;

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