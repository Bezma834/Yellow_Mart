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
<svg class="title-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
User Management
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

<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
Delete

</button>



</div>


</div>


</div>

</template>
<style scoped>

.users-page{

padding:30px;

min-height:100vh;

background:var(--color-bg-secondary);

}

.users-page h1{

font-size:35px;

font-weight:900;

margin-bottom:30px;

display:flex;

align-items:center;

gap:12px;

color:var(--color-text-primary);

}

.title-icon{

color:var(--color-primary);

flex-shrink:0;

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

display:flex;

flex-direction:column;

align-items:flex-start;

gap:8px;

transition:.2s;

border:1px solid var(--color-border-light);

}

.user-card:hover{

box-shadow:var(--shadow-md);

border-color:var(--color-border-hover);

}

.user-card img{

width:70px;

height:70px;

border-radius:50%;

object-fit:cover;

border:3px solid var(--color-primary-light);

}

.user-card h3{

font-size:17px;

font-weight:800;

color:var(--color-text-primary);

}

.user-card p{

color:var(--color-text-secondary);

font-size:14px;

}

.user-card p strong{

color:var(--color-primary-hover);

text-transform:capitalize;

}

select{

margin-top:12px;

padding:10px 14px;

border-radius:10px;

border:1px solid var(--color-border);

background:var(--color-surface);

color:var(--color-text-primary);

font-size:14px;

font-weight:600;

cursor:pointer;

transition:.2s;

width:100%;

}

select:focus{

outline:none;

border-color:var(--color-primary);

box-shadow:0 0 0 3px var(--color-primary-light);

}

button{

margin-top:12px;

background:#ef4444;

color:white;

border:none;

padding:10px 20px;

border-radius:10px;

cursor:pointer;

font-weight:700;

font-size:14px;

transition:.2s;

display:inline-flex;

align-items:center;

gap:7px;

width:100%;

justify-content:center;

}

button:hover{

background:#dc2626;

transform:translateY(-1px);

box-shadow:var(--shadow-md);

}


</style>

<style>
:root.dark .user-card {
  background: var(--color-dark-surface);
}
:root.dark .user-card h3 {
  color: var(--color-text-primary);
}
:root.dark .user-card p {
  color: var(--color-text-secondary);
}
:root.dark select {
  background: var(--color-dark-surface);
  color: var(--color-text-primary);
  border-color: var(--color-dark-border);
}
:root.dark button {
  background: #dc2626;
}
</style>