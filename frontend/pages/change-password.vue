<script setup lang="ts">

import { ref } from "vue"
import { useRouter } from "vue-router"


const router = useRouter()


const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")


const message = ref("")
const error = ref("")

const loading = ref(false)



const changePassword = async()=>{


message.value=""
error.value=""


if(newPassword.value !== confirmPassword.value){

error.value="New passwords do not match"

return

}



if(newPassword.value.length < 6){

error.value="Password must be at least 6 characters"

return

}



loading.value=true



try{

const token = localStorage.getItem("token")

const result = await $fetch(
  "https://yellow-mart-backend.onrender.com/api/auth/change-password",
  {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body:{
      oldPassword:oldPassword.value,
      newPassword:newPassword.value
    }
  }
)
message.value =
result.message



setTimeout(()=>{

router.push("/profile")

},1500)



}

catch(err:any){


console.error(err)


error.value =
err.data?.message ||
"Something went wrong"



}

finally{

loading.value=false

}


}


</script>



<template>

<div class="page">


<div class="card">


<h1>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
Change Password
</h1>



<label>
Current Password
</label>


<input
v-model="oldPassword"
type="password"
placeholder="Enter current password"
/>




<label>
New Password
</label>


<input
v-model="newPassword"
type="password"
placeholder="Enter new password"
/>




<label>
Confirm New Password
</label>


<input
v-model="confirmPassword"
type="password"
placeholder="Confirm password"
/>




<button
@click="changePassword"
:disabled="loading"
>


{{loading ? "Updating..." : "Update Password"}}


</button>




<p
v-if="message"
class="success"
>

{{message}}

</p>



<p
v-if="error"
class="error"
>

{{error}}

</p>



</div>


</div>


</template>



<style scoped>


.page{

min-height:100vh;

background:var(--color-bg-secondary);

padding:100px 20px;

}



.card{

max-width:450px;

margin:auto;

background:var(--color-surface);

padding:40px;

border-radius:25px;

box-shadow:
0 15px 35px rgba(0,0,0,.1);

}
h1{

text-align:center;

margin-bottom:30px;

display:flex;

align-items:center;

justify-content:center;

gap:10px;

}

h1 svg{

color:var(--color-primary);

}

label{

display:block;

font-weight:700;

margin-top:20px;

color:var(--color-text-secondary);

}

input{

width:100%;

padding:14px;

margin-top:8px;

border-radius:12px;

border:1px solid var(--color-border);

font-size:16px;

font-family:inherit;

background:var(--color-surface);

color:var(--color-text-primary);

outline:none;

transition:.3s;

box-sizing:border-box;

}

input:focus{

border-color:var(--color-primary);

box-shadow:0 0 0 4px var(--color-primary-glow);

}

button{

width:100%;

margin-top:30px;

padding:15px;

border:none;

border-radius:12px;

background:var(--color-primary);

color:var(--color-text-primary);

font-size:16px;

font-weight:700;

font-family:inherit;

cursor:pointer;

transition:.3s;

}

button:hover{

background:var(--color-primary-hover);

transform:translateY(-2px);

}


button:disabled{

opacity:.6;

}



.success{

margin-top:20px;

padding:15px;

background:#dcfce7;

color:#166534;

border-radius:12px;

text-align:center;

}



.error{

margin-top:20px;

padding:15px;

background:#fee2e2;

color:#991b1b;

border-radius:12px;

text-align:center;

}


</style>

<style>
:root.dark .page { background: var(--color-dark-bg); }
:root.dark .card { background: var(--color-dark-surface); }
:root.dark h1 { color: var(--color-text-primary); }
:root.dark label { color: var(--color-text-secondary); }
:root.dark input { background: var(--color-dark-bg-secondary); border-color: var(--color-dark-border); color: var(--color-text-primary); }
:root.dark button { background: var(--color-primary); color: var(--color-text-primary); }
:root.dark button:hover { background: var(--color-primary-hover); }
:root.dark .success { background: var(--color-dark-surface); color: var(--color-text-primary); border: 1px solid var(--color-dark-border); }
:root.dark .error { background: var(--color-dark-surface); color: var(--color-text-primary); border: 1px solid var(--color-dark-border); }
</style>