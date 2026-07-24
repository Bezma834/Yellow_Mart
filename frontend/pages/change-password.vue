<script setup lang="ts">

import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"


const router = useRouter()

const { user } = useAuth()


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

const result = await $fetch(
  "https://yellow-mart-backend.onrender.com/api/change-password",
  {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:{
      userId:user.value.id,
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
🔒 Change Password
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

background:#f8fafc;

padding:100px 20px;

}



.card{

max-width:450px;

margin:auto;

background:white;

padding:40px;

border-radius:25px;

box-shadow:
0 15px 35px rgba(0,0,0,.1);

}



h1{

text-align:center;

margin-bottom:30px;

}



label{

display:block;

font-weight:700;

margin-top:20px;

}



input{

width:100%;

padding:14px;

margin-top:8px;

border-radius:12px;

border:1px solid #ddd;

font-size:16px;

}



button{

width:100%;

margin-top:30px;

padding:15px;

border:none;

border-radius:12px;

background:#facc15;

color:white;

font-size:16px;

font-weight:700;

cursor:pointer;

}



button:hover{

background:#facc15;

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