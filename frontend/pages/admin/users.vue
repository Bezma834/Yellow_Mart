<script setup lang="ts">


definePageMeta({

layout:"admin",
middleware:"admin"

})


import {ref,onMounted} from "vue"


import {

GET_ALL_USERS,

UPDATE_USER_ROLE,

DELETE_USER

} from "~/graphql/queries"



const { $apollo } = useNuxtApp() as any



const users = ref<any[]>([])



const loadUsers = async()=>{


try{


const {data}=await $apollo.query({

query:GET_ALL_USERS,

fetchPolicy:"network-only"

})


users.value=data.users || []



}

catch(error){

console.error(error)

}


}





const changeRole = async(
id:string,
role:string
)=>{


try{


await $apollo.mutate({

mutation:UPDATE_USER_ROLE,

variables:{

id,

role

}

})


await loadUsers()


}

catch(error){

console.error(error)

}


}





const deleteUser = async(id:string)=>{


const ok = confirm(
"Delete this user?"
)


if(!ok)
return



try{


await $apollo.mutate({

mutation:DELETE_USER,

variables:{
id
}

})


await loadUsers()


}

catch(error){

console.error(error)

}


}





onMounted(()=>{

loadUsers()

})



</script>



<template>

<div class="users-page">


<h1>
👥 User Management
</h1>



<div class="users-grid">


<div
v-for="user in users"
:key="user.id"
class="user-card"
>


<img
v-if="user.avatar"
:src="user.avatar"
/>



<h3>
{{user.fullname || user.username}}
</h3>



<p>
{{user.email}}
</p>



<p>
Role:
<strong>
{{user.role}}
</strong>
</p>



<select
:value="user.role"
@change="
changeRole(
user.id,
($event.target as HTMLSelectElement).value
)
"
>


<option value="user">
User
</option>


<option value="owner">
Owner
</option>


<option value="admin">
Admin
</option>


</select>



<button
@click="deleteUser(user.id)"
>

🗑 Delete

</button>



</div>


</div>


</div>

</template>
<style scoped>

.users-page{

padding:30px;

}


h1{

font-size:35px;

font-weight:900;

margin-bottom:30px;

}



.users-grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(280px,1fr));

gap:25px;

}



.user-card{

background:white;

padding:25px;

border-radius:20px;

box-shadow:
0 10px 25px rgba(0,0,0,.08);

}



.user-card img{

width:70px;

height:70px;

border-radius:50%;

object-fit:cover;

}



select{

margin-top:15px;

padding:10px;

border-radius:10px;

}



button{

margin-top:15px;

background:#ef4444;

color:white;

border:none;

padding:10px 20px;

border-radius:10px;

cursor:pointer;

}

</style>