<script setup lang="ts">


definePageMeta({
  layout:"admin",
middleware:"admin"
})


import { ref,onMounted,computed } from "vue"


import {

GET_ALL_CATEGORIES_ADMIN,
CREATE_CATEGORY,
DELETE_CATEGORY,
UPDATE_CATEGORY

} from "~/graphql/queries"



const { $apollo } = useNuxtApp() as any



const categories = ref<any[]>([])



const name = ref("")

const icon = ref("")

const search = ref("")

const editingId = ref("")

const editName = ref("")

const editIcon = ref("")
const successMessage = ref("")
const showDeleteModal = ref(false)

const categoryToDelete = ref<string | null>(null)

const categoryDeleteName = ref("")
const loading = ref(false)





const loadCategories = async()=>{


try{


const {data}=await $apollo.query({

query:GET_ALL_CATEGORIES_ADMIN,

fetchPolicy:"network-only"

})


categories.value =
data.categories || []


}

catch(error){

console.error(error)

}


}

const filteredCategories = computed(()=>{


return categories.value.filter((category)=>{


return category.name
.toLowerCase()
.includes(
search.value.toLowerCase()
)


})


})



const addCategory = async()=>{


if(!name.value.trim()){

alert("Category name is required")

return

}


try{


const result = await $apollo.mutate({

mutation:CREATE_CATEGORY,

variables:{

name:name.value,

icon:icon.value || "📂"

}

})


console.log(
"CREATE RESULT:",
result.data
)



name.value=""
icon.value=""


successMessage.value =
"✅ Category added successfully!"


await loadCategories()


setTimeout(()=>{

successMessage.value=""

},3000)


}

catch(error:any){

console.error(
"CREATE CATEGORY ERROR:",
error
)

alert("Failed to add category")

}


}
const startEdit = (category:any)=>{


editingId.value = category.id

editName.value = category.name

editIcon.value = category.icon


}

const updateCategory = async()=>{


try{


await $apollo.mutate({

mutation:UPDATE_CATEGORY,

variables:{

id:editingId.value,

name:editName.value,

icon:editIcon.value

}

})


editingId.value=""

editName.value=""

editIcon.value=""


await loadCategories()


}

catch(error){

console.error(
"UPDATE ERROR:",
error
)

}


}
const openDeleteModal = (category:any)=>{

showDeleteModal.value = true

categoryToDelete.value = category.id

categoryDeleteName.value = category.name


}



const confirmDelete = async()=>{


if(!categoryToDelete.value)
return



try{


await $apollo.mutate({

mutation:DELETE_CATEGORY,

variables:{

id:categoryToDelete.value

}

})


await loadCategories()



successMessage.value =
"🗑 Category deleted successfully!"



setTimeout(()=>{

successMessage.value=""

},3000)



}

catch(error){

console.error(
"DELETE ERROR:",
error
)


}


finally{


showDeleteModal.value=false

categoryToDelete.value=null

categoryDeleteName.value=""


}


}



const closeDeleteModal = ()=>{


showDeleteModal.value=false

categoryToDelete.value=null

}




onMounted(()=>{

loadCategories()

})



</script>


<template>

<div class="category-admin">


<h1>
📂 Category Management
</h1>



<p
v-if="successMessage"
class="success"
>
{{ successMessage }}
</p>


<input
class="search-input"
v-model="search"
placeholder="🔍 Search category..."
/>

<div class="add-box">


<input
v-model="name"
placeholder="Category name"
/>


<input
v-model="icon"
placeholder="Icon"
/>



<button
@click="addCategory"
>
➕ Add Category
</button>



</div>





<div class="category-list">


<div
v-for="category in categories"
:key="category.id"
class="category-card"
>



<!-- EDIT MODE -->

<div
v-if="editingId === category.id"
class="edit-area"
>


<input
v-model="editName"
/>


<input
v-model="editIcon"
/>



<button
@click="updateCategory"
>
💾 Save
</button>


<button
@click="editingId=''"
>
Cancel
</button>


</div>





<!-- NORMAL MODE -->

<div
v-else
class="normal-area"
>


<div>

<span>
{{ category.icon }}
</span>


<strong>
{{ category.name }}
</strong>


<p class="count">

{{ category.businesses_aggregate.aggregate.count }}

Businesses

</p>
</div>




<div class="buttons">


<button
  class="edit-btn"
  @click="startEdit(category)"
>
  ✏️ Edit
</button>


<button
  class="delete-btn"
  @click="deleteCategory(category.id)"
>
  🗑 Delete
</button>

<div
v-if="showDeleteModal"
class="modal-overlay"
>


<div class="modal-box">


<h2>
Delete Category?
</h2>


<p>

Are you sure you want to delete

<strong>
{{ categoryDeleteName }}
</strong>

?

</p>



<div class="modal-actions">


<button
class="cancel"
@click="closeDeleteModal"
>
Cancel
</button>


<button
class="delete"
@click="confirmDelete"
>
Delete
</button>


</div>



</div>


</div>

</div>


</div>



</div>



</div>


</div>


</template>


<style scoped>
.category-card{

background:white;

padding:25px;

border-radius:20px;

margin-bottom:20px;

display:flex;

flex-direction:column;

gap:15px;

}


.normal-area{

display:flex;

justify-content:space-between;

align-items:center;

}


.buttons{

display:flex;

gap:10px;

}


.edit-area{

display:flex;

flex-direction:column;

gap:15px;

}


input{

padding:12px;

border-radius:10px;

border:1px solid #ddd;

}


button{

padding:10px 15px;

border:none;

border-radius:10px;

cursor:pointer;

}

.category-admin{

padding:20px;

}



h1{

font-size:35px;

font-weight:900;

margin-bottom:30px;

}



.add-box{

background:white;

padding:25px;

border-radius:20px;

display:flex;

gap:15px;

margin-bottom:30px;

}



input{

padding:12px;

border-radius:10px;

border:1px solid #ddd;

}



button{

background:#facc15;

border:none;

padding:12px 20px;

border-radius:12px;

font-weight:700;

cursor:pointer;

}



.category-list{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(250px,1fr));

gap:20px;

}



.category-card{

background:white;

padding:25px;

border-radius:20px;

display:flex;

justify-content:space-between;

align-items:center;

box-shadow:
0 10px 20px rgba(0,0,0,.08);

}


.edit-btn {

  background: #facc15;

  color: #111827;

  padding: 8px 15px;

  border-radius: 8px;

  border: none;

  font-weight: 700;

  cursor: pointer;

}


.edit-btn:hover {

  background: #eab308;

}



.delete-btn {

  background: #ef4444;

  color: white;

  padding: 8px 15px;

  border-radius: 8px;

  border: none;

  font-weight: 700;

  cursor: pointer;

}


.delete-btn:hover {

  background: #dc2626;

}

.success{

background:#dcfce7;

color:#166534;

padding:15px;

border-radius:12px;

margin-bottom:20px;

font-weight:700;

}
.search-input{

width:100%;

max-width:400px;

padding:14px 18px;

border-radius:15px;

border:1px solid #ddd;

margin-bottom:25px;

font-size:16px;

}
.modal-overlay{

position:fixed;

top:0;

left:0;

width:100%;

height:100%;

background:rgba(0,0,0,.5);

display:flex;

align-items:center;

justify-content:center;

z-index:9999;

}



.modal-box{

background:white;

padding:35px;

border-radius:25px;

width:400px;

text-align:center;

box-shadow:
0 20px 50px rgba(0,0,0,.2);

}



.modal-box h2{

font-size:25px;

font-weight:900;

margin-bottom:15px;

}



.modal-actions{

display:flex;

justify-content:center;

gap:15px;

margin-top:25px;

}



.modal-actions button{

padding:12px 25px;

border-radius:12px;

border:none;

font-weight:700;

cursor:pointer;

}



.cancel{

background:#e5e7eb;

}



.delete{

background:#ef4444;

color:white;

}
.count{

margin-top:8px;

color:#64748b;

font-size:14px;

font-weight:600;

}
</style>