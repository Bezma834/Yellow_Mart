<template>

<nav :class="['navbar', { scrolled }]">


  <!-- LOGO -->
  <NuxtLink to="/" class="logo">
    🟡 Yellow Mart
  </NuxtLink>



  <!-- SEARCH -->
  <div class="search-box">

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search businesses..."
      @keyup.enter="handleSearch"
    />

    <button @click="handleSearch">
      🔍
    </button>

  </div>




  <!-- NAVIGATION -->

  <div class="nav-links">





    <NuxtLink
      to="/add-business"
      class="add-btn"
    >
      + Add Business
    </NuxtLink>




    <NuxtLink to="/map">
      Map
    </NuxtLink>



<!-- LOGGED USER -->

<div
v-if="user"
class="user-dropdown"

@mouseenter="open=true"

@mouseleave="open=false"

>


<UButton

color="warning"

variant="soft"

trailing-icon="i-lucide-chevron-down"

@click="open=!open"

>

👤 {{ user?.displayName || user?.email }}


</UButton>







<Transition name="fade">


<div

v-if="open"

class="dropdown-card"

>



<div class="profile-header">


<div class="avatar">


<img

v-if="user?.avatar"

:src="user.avatar"

class="avatar-image"

/>


<span v-else>

{{ user?.fullname?.charAt(0).toUpperCase() || "U" }}

</span>


</div>





<div>


<h4>

{{ user?.displayName || "Yellow Mart User" }}

</h4>


<p>

{{ user?.email }}

</p>


</div>


</div>








<NuxtLink

to="/profile"

class="menu-item"

>

👤 My Profile

</NuxtLink>






<NuxtLink

to="/favorites"

class="menu-item"

>

❤️ Favorites

</NuxtLink>






<NuxtLink

to="/my-businesses"

class="menu-item"

>

🏪 My Businesses

</NuxtLink>






<NuxtLink

to="/settings"

class="menu-item"

>

⚙️ Settings

</NuxtLink>






<hr>






<button

class="logout"

@click="logoutUser"

>

🚪 Logout

</button>






</div>


</Transition>



</div>









<!-- NOT LOGGED USER -->

<NuxtLink

v-else

to="/login"

class="login-btn"

>

Login

</NuxtLink>





</div>


</nav>


</template>
<script setup lang="ts">


import { ref,onMounted,onUnmounted } from "vue"

import { useRouter } from "vue-router"

import type { DropdownMenuItem } from "@nuxt/ui"

import { useAuth } from "~/composables/useAuth"



const router = useRouter()
const goMyBusinesses = () => {

  router.push("/my-businesses")

}



const goFavorites = () => {

  router.push("/favorites")

}


const {
 user,
 logout,
 checkAuth

} = useAuth()





const searchQuery = ref("")
const open = ref(false)

const logoutUser = () => {

  logout()

  router.push("/")

}


const scrolled = ref(false)





const items: DropdownMenuItem[][] = [

[

{

label:"Profile",

icon:"i-lucide-user",

to:"/profile"

},


{

label:"Settings",

icon:"i-lucide-settings",

to:"/settings"

},


{

label:"Favorites",

icon:"i-lucide-heart",

to:"/favorites"

},


{

label:"My Businesses",

icon:"i-lucide-store",

to:"/my-businesses"

}


],


[

{

label:"Add Business",

icon:"i-lucide-plus-circle",

to:"/add-business"

}

],


[

{

label:"Logout",

color:"error",

icon:"i-lucide-log-out",


onSelect:()=>{

logout()

router.push("/")

}


}

]

]







const handleScroll =()=>{

scrolled.value =
window.scrollY > 80

}






const handleSearch =()=>{


if(!searchQuery.value.trim())

return



router.push(

`/search?q=${encodeURIComponent(searchQuery.value)}`

)


}






onMounted(()=>{


checkAuth()


window.addEventListener(

"scroll",

handleScroll

)


})





onUnmounted(()=>{


window.removeEventListener(

"scroll",

handleScroll

)


})



</script>





<style scoped>


.navbar{

position:fixed;

top:0;

left:0;

right:0;


height:75px;


display:flex;

align-items:center;

justify-content:space-between;


padding:0 40px;


background:rgba(15,23,42,.75);


backdrop-filter:blur(15px);


z-index:9999;


transition:.3s;


}



.navbar.scrolled{

background:#0f172a;

box-shadow:

0 10px 30px rgba(0,0,0,.25);

}




.logo{

font-size:25px;

font-weight:900;

color:#facc15;

text-decoration:none;

}




.search-box{


display:flex;


background:white;


border-radius:30px;


overflow:hidden;


}



.search-box input{


border:none;

outline:none;


padding:12px 18px;


width:280px;


}



.search-box button{


border:none;


background:#facc15;


padding:12px 18px;


cursor:pointer;


}





.nav-links{


display:flex;


align-items:center;


gap:18px;


}



.nav-links a{


color:white;


text-decoration:none;


font-weight:600;


}



.nav-links a:hover{


color:#facc15;


}





.add-btn{


background:#facc15;


color:#111827 !important;


padding:10px 16px;


border-radius:12px;


}




.login-btn{


border:1px solid white;


padding:10px 16px;


border-radius:12px;


}
.account-menu{

position:relative;

}

.user-dropdown {

position: relative;

z-index: 9999;

}


/* Dropdown container */
.dropdown-card {

  position: absolute;

  right: 0;

  top: 50px;

  width: 280px;

  background: white;

  border-radius: 18px;

  padding: 20px;

  box-shadow:
    0 20px 40px rgba(0,0,0,.18);

  z-index: 99999;

  color: #0f172a;

}






/* Profile text */

.profile-header h4 {

  color:#0f172a;

  font-weight:800;

}


.profile-header p {

  color:#64748b;

}







/* Dropdown links */

.menu-item {


display:flex;

align-items:center;


padding:12px 14px;


border-radius:12px;


color:#0f172a !important;


font-weight:600;


text-decoration:none;


transition:.25s;


}





/* Mouse hover */

.menu-item:hover {


background:#facc15;


color:#0f172a !important;


transform:translateX(5px);


}







/* Divider */

.dropdown-card hr {


border:none;

border-top:1px solid #e2e8f0;

margin:12px 0;


}







/* Logout */

.logout {


width:100%;


padding:12px;


border:none;


border-radius:12px;


background:#fee2e2;


color:#b91c1c;


font-weight:800;


cursor:pointer;


transition:.25s;


}




.logout:hover {


background:#ef4444;


color:white;


}
.profile-header {


display:flex;

align-items:center;

gap:15px;

margin-bottom:20px;


}



.avatar {


width:55px;

height:55px;


border-radius:50%;


background:#facc15;


display:flex;

align-items:center;

justify-content:center;


font-weight:900;

font-size:22px;


overflow:hidden;


}




.avatar-image {


width:100%;

height:100%;

object-fit:cover;


}



.profile-header h4 {


font-weight:800;

margin:0;


}



.profile-header p {


font-size:14px;

color:#64748b;

margin:0;


}



.menu-item {


display:block;


padding:12px;


border-radius:10px;


text-decoration:none;


color:#0f172a;


font-weight:600;


transition:.2s;


}



.menu-item:hover {


background:#fef3c7;

color:#92400e;


}




.logout {


width:100%;


border:none;


background:#fee2e2;


color:#b91c1c;


padding:12px;


border-radius:10px;


font-weight:800;


cursor:pointer;


}



.logout:hover {


background:#fecaca;


}







/* animation */


.fade-enter-active,
.fade-leave-active {


transition:.2s ease;


}



.fade-enter-from,
.fade-leave-to {


opacity:0;

transform:translateY(-10px);


}
</style>