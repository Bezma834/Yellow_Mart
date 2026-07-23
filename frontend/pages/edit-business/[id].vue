<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { gql } from "@apollo/client"


const route = useRoute()
const router = useRouter()

const { $apollo } = useNuxtApp() as any


const loading = ref(true)
const saving = ref(false)
const showSuccess = ref(false)


const business = ref<any>(null)



const GET_BUSINESS = gql`

query GetBusiness($id:uuid!){

  businesses_by_pk(id:$id){

    id
    name
    description
    phone
    address
    city
    image

    category{
      name
    }

  }

}

`



const UPDATE_BUSINESS = gql`

mutation UpdateBusiness(
$id:uuid!,
$name:String!,
$description:String,
$phone:String!,
$address:String!,
$city:String!
){

update_businesses_by_pk(
pk_columns:{
id:$id
},

_set:{
name:$name,
description:$description,
phone:$phone,
address:$address,
city:$city
}

){

id
name
description
phone
address
city

}

}

`




const loadBusiness = async()=>{


try{


const result = await $apollo.query({

query:GET_BUSINESS,

variables:{
id:route.params.id
},

fetchPolicy:"network-only"

})


console.log(
"LOADED BUSINESS:",
result.data.businesses_by_pk
)

business.value = {
  ...result.data.businesses_by_pk
}



}
catch(error){

console.error(
"LOAD ERROR:",
error
)

}
finally{

loading.value=false

}


}





const updateBusiness = async()=>{
console.log("SAVE CLICKED")

if(!business.value)
return


saving.value=true


try{


const result = await $apollo.mutate({

mutation:UPDATE_BUSINESS,

variables:{


id:business.value.id,


name:business.value.name,


description:business.value.description,


phone:business.value.phone,


address:business.value.address,


city:business.value.city


}

})



console.log(
"UPDATE RESULT:",
result.data.update_businesses_by_pk
)



if(result.data.update_businesses_by_pk){


showSuccess.value=true



setTimeout(()=>{

router.push("/my-businesses")

},1500)


}



}
catch(error){


console.error(
"UPDATE ERROR:",
error
)


}
finally{

saving.value=false

}


}





onMounted(()=>{

loadBusiness()

})


</script>


<template>


<div class="page">


<div
v-if="loading"
class="loading"
>

Loading business...

</div>



<div
v-else
class="edit-card"
>


<h1>
✏️ Edit Business
</h1>



<div class="image-box">

<img
:src="business.image || '/default-business.jpg'"
/>

</div>




<label>
Business Name
</label>


<input
v-model="business.name"
/>




<label>
Description
</label>


<textarea
v-model="business.description"
></textarea>




<label>
Phone
</label>


<input
v-model="business.phone"
/>




<label>
Address
</label>


<input
v-model="business.address"
/>




<label>
City
</label>


<input
v-model="business.city"
/>




<button
@click="updateBusiness"
:disabled="saving"
>

{{saving ? "Saving..." : "💾 Save Changes"}}

</button>


<div
v-if="showSuccess"
class="toast success"
>

✅ Business updated successfully

</div>
</div>


</div>


</template>



<style scoped>


.page{

min-height:100vh;

background:#f8fafc;

padding:120px 20px;

}



.edit-card{

max-width:650px;

margin:auto;

background:white;

padding:35px;

border-radius:25px;

box-shadow:
0 20px 40px rgba(0,0,0,.1);

}



h1{

text-align:center;

margin-bottom:30px;

}



.image-box img{

width:100%;

height:250px;

object-fit:cover;

border-radius:20px;

margin-bottom:25px;

}



label{

font-weight:700;

display:block;

margin-top:15px;

}



input,
textarea{

width:100%;

padding:14px;

border-radius:12px;

border:1px solid #ddd;

margin-top:8px;

}



textarea{

height:130px;

}



button{

margin-top:25px;

width:100%;

padding:15px;

border:none;

border-radius:15px;

background:#2563eb;

color:white;

font-size:17px;

font-weight:bold;

cursor:pointer;

}



button:hover{

transform:translateY(-2px);

}

.toast{

position:fixed;

top:100px;

right:30px;

padding:16px 25px;

border-radius:15px;

font-weight:bold;

color:white;

animation:slide .3s ease;

z-index:9999;

}


.success{

background:#16a34a;

}



@keyframes slide{

from{

transform:translateX(100px);

opacity:0;

}

to{

transform:translateX(0);

opacity:1;

}

}
</style>