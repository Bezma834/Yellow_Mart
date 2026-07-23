<script setup lang="ts">

import { ref, onMounted } from "vue"
import { gql } from "@apollo/client"
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
    {{ user?.email }}
  </span>


  <div class="role">
    🏪 Business Owner
  </div>


</section>



<!-- Statistics -->

<section class="stats">


<div class="stat-card">

<div class="stat-icon">
🏪
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
❤️
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
👁
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

<span>
✏️ Edit Profile
</span>

<span>
›
</span>

</button>



<button
class="action"
@click="router.push('/favorites')"
>

<span>
❤️ My Favorites
</span>

<span>
›
</span>

</button>




<button
class="action"
@click="router.push('/my-businesses')"
>

<span>
🏪 My Businesses
</span>

<span>
›
</span>

</button>




<button
class="action"
@click="router.push('/change-password')"
>

<span>
🔒 Change Password
</span>

<span>
›
</span>

</button>




<button
class="action"
@click="router.push('/settings')"
>

<span>
⚙️ Settings
</span>

<span>
›
</span>

</button>




<button
class="action logout"
@click="logout"
>

<span>
🚪 Logout
</span>

<span>
›
</span>

</button>



</section>



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
  background:white;
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

  color:#111827;

}

.hero p{

  color:#64748b;

  margin:10px 0;

}

.email{

  color:#2563eb;

  display:block;

  margin-bottom:15px;

}

.role{

  display:inline-block;

  background:#fff7ed;

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

  background:white;

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

  font-size:38px;

}

.stat-card h2{

  font-size:34px;

  margin:15px 0 5px;

}

.stat-card p{

  color:#64748b;

}

/* ACTIONS */

.actions{

  margin-top:40px;

  background:white;

  border-radius:25px;

  overflow:hidden;

  box-shadow:0 10px 25px rgba(0,0,0,.08);

}

.action{

  width:100%;

  border:none;

  background:white;

  display:flex;

  justify-content:space-between;

  align-items:center;

  padding:22px 28px;

  font-size:17px;

  cursor:pointer;

  transition:.3s;

  border-bottom:1px solid #f1f5f9;

}

.action:hover{

  background:#fff7ed;

  padding-left:38px;

}

.logout{

  color:#dc2626;

}

.logout:hover{

  background:#fee2e2;

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