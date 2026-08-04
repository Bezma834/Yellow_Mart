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
const errorMessage = ref("")
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

errorMessage.value = "Category name is required"

return

}


try{


const result = await $apollo.mutate({

mutation:CREATE_CATEGORY,

variables:{

name:name.value,

icon:icon.value.trim() || ""

}

})


console.log(
"CREATE RESULT:",
result.data
)



name.value=""
icon.value=""


successMessage.value =
"Category added successfully!"


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

errorMessage.value = "Failed to add category"

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
"Category deleted successfully!"



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


<div class="page-head">

<h1>
<svg class="title-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
Category Management
</h1>

</div>


<p
v-if="successMessage"
class="success"
>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
{{ successMessage }}
</p>

<p
v-if="errorMessage"
class="error-msg"
>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
{{ errorMessage }}
</p>


<div class="search-wrap">

<svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

<input
class="search-input"
v-model="search"
placeholder="Search category..."
/>

</div>

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
class="add-btn"
@click="addCategory"
>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
Add Category
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



<div class="edit-actions">

<button
class="save-btn"
@click="updateCategory"
>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
Save
</button>


<button
class="cancel-btn"
@click="editingId=''"
>
Cancel
</button>

</div>


</div>





<!-- NORMAL MODE -->

<div
v-else
class="normal-area"
>

<div class="category-info">

<span
v-if="category.icon"
class="category-icon"
>
{{ category.icon }}
</span>

<span
v-else
class="category-icon category-icon-fallback"
>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
</span>


<div class="category-text">

<strong>
{{ category.name }}
</strong>


<p class="count">

{{ category.businesses_aggregate.aggregate.count }}

Businesses

</p>

</div>
</div>




<div class="buttons">


<button
  class="edit-btn"
  @click="startEdit(category)"
>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  Edit
</button>


<button
  class="delete-btn"
  @click="openDeleteModal(category)"
>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  Delete
</button>

</div>


</div>



</div>



</div>



</div>


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


</template>


<style scoped>

.category-admin{

padding:20px;

min-height:100vh;

background:var(--color-bg-secondary);

}

.page-head{

margin-bottom:30px;

}

.page-head h1{

font-size:35px;

font-weight:900;

color:var(--color-text-primary);

display:flex;

align-items:center;

gap:12px;

}

.title-icon{

color:var(--color-primary);

flex-shrink:0;

}

.success{

background:#dcfce7;

color:#166534;

padding:15px 20px;

border-radius:var(--radius-lg);

margin-bottom:20px;

font-weight:700;

display:flex;

align-items:center;

gap:10px;

}

.error-msg{

background:#fef2f2;

color:#991b1b;

padding:15px 20px;

border-radius:var(--radius-lg);

margin-bottom:20px;

font-weight:700;

display:flex;

align-items:center;

gap:10px;

}

.search-wrap{

position:relative;

max-width:400px;

margin-bottom:25px;

}

.search-icon{

position:absolute;

left:16px;

top:50%;

transform:translateY(-50%);

color:var(--color-text-tertiary);

pointer-events:none;

}

.search-input{

width:100%;

padding:14px 18px 14px 44px;

border-radius:15px;

border:1px solid var(--color-border);

background:var(--color-surface);

color:var(--color-text-primary);

font-size:16px;

transition:.2s;

}

.search-input:focus{

outline:none;

border-color:var(--color-primary);

box-shadow:0 0 0 3px var(--color-primary-light);

}

.add-box{

background:var(--color-surface);

padding:25px;

border-radius:20px;

display:flex;

gap:15px;

margin-bottom:30px;

border:1px solid var(--color-border-light);

}

.add-box input{

flex:1;

padding:12px 14px;

border-radius:10px;

border:1px solid var(--color-border);

background:var(--color-surface);

color:var(--color-text-primary);

font-size:15px;

transition:.2s;

}

.add-box input:focus{

outline:none;

border-color:var(--color-primary);

box-shadow:0 0 0 3px var(--color-primary-light);

}

.add-btn{

background:var(--color-primary);

border:none;

padding:12px 20px;

border-radius:var(--radius-lg);

font-weight:700;

color:var(--color-text-primary);

cursor:pointer;

transition:.2s;

display:inline-flex;

align-items:center;

gap:8px;

white-space:nowrap;

}

.add-btn:hover{

background:var(--color-primary-hover);

transform:translateY(-1px);

box-shadow:var(--shadow-md);

}

.category-list{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(300px,1fr));

gap:20px;

}

.category-card{

background:var(--color-surface);

padding:22px 25px;

border-radius:20px;

display:flex;

flex-direction:column;

gap:15px;

border:1px solid var(--color-border-light);

box-shadow:var(--shadow-sm);

transition:.2s;

}

.category-card:hover{

box-shadow:var(--shadow-md);

border-color:var(--color-border-hover);

}

.normal-area{

display:flex;

justify-content:space-between;

align-items:center;

gap:15px;

}

.category-info{

display:flex;

align-items:center;

gap:14px;

min-width:0;

}

.category-icon{

width:46px;

height:46px;

border-radius:12px;

background:var(--color-bg-tertiary);

display:flex;

align-items:center;

justify-content:center;

font-size:22px;

flex-shrink:0;

}

.category-icon-fallback{

color:var(--color-primary);

background:var(--color-primary-light);

}

.category-text{

min-width:0;

}

.category-text strong{

font-size:16px;

font-weight:800;

color:var(--color-text-primary);

display:block;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;

}

.count{

margin-top:6px;

color:var(--color-text-tertiary);

font-size:14px;

font-weight:600;

}

.buttons{

display:flex;

gap:10px;

}

.edit-btn{

background:var(--color-primary);

color:var(--color-text-primary);

padding:9px 16px;

border-radius:var(--radius-md);

border:none;

font-weight:700;

font-size:14px;

cursor:pointer;

transition:.2s;

display:inline-flex;

align-items:center;

gap:7px;

}

.edit-btn:hover{

background:var(--color-primary-hover);

}

.delete-btn{

background:#ef4444;

color:white;

padding:9px 16px;

border-radius:var(--radius-md);

border:none;

font-weight:700;

font-size:14px;

cursor:pointer;

transition:.2s;

display:inline-flex;

align-items:center;

gap:7px;

}

.delete-btn:hover{

background:#dc2626;

}

.edit-area{

display:flex;

flex-direction:column;

gap:15px;

}

.edit-area input{

padding:12px 14px;

border-radius:10px;

border:1px solid var(--color-border);

background:var(--color-surface);

color:var(--color-text-primary);

font-size:15px;

transition:.2s;

}

.edit-area input:focus{

outline:none;

border-color:var(--color-primary);

box-shadow:0 0 0 3px var(--color-primary-light);

}

.edit-actions{

display:flex;

gap:10px;

}

.save-btn{

background:var(--color-primary);

color:var(--color-text-primary);

padding:11px 18px;

border-radius:var(--radius-lg);

border:none;

font-weight:700;

cursor:pointer;

transition:.2s;

display:inline-flex;

align-items:center;

gap:8px;

flex:1;

justify-content:center;

}

.save-btn:hover{

background:var(--color-primary-hover);

}

.cancel-btn{

background:var(--color-bg-tertiary);

color:var(--color-text-secondary);

padding:11px 18px;

border-radius:var(--radius-lg);

border:none;

font-weight:700;

cursor:pointer;

transition:.2s;

flex:1;

}

.cancel-btn:hover{

background:var(--color-border);

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

padding:20px;

}

.modal-box{

background:var(--color-surface);

padding:35px;

border-radius:25px;

width:400px;

max-width:100%;

text-align:center;

box-shadow:0 20px 50px rgba(0,0,0,.2);

}

.modal-box h2{

font-size:25px;

font-weight:900;

margin-bottom:15px;

color:var(--color-text-primary);

}

.modal-box p{

color:var(--color-text-secondary);

}

.modal-actions{

display:flex;

justify-content:center;

gap:15px;

margin-top:25px;

}

.modal-actions button{

padding:12px 25px;

border-radius:var(--radius-lg);

border:none;

font-weight:700;

cursor:pointer;

transition:.2s;

}

.cancel{

background:#e5e7eb;

color:var(--color-text-primary);

}

.cancel:hover{

background:#d1d5db;

}

.delete{

background:#ef4444;

color:white;

}

.delete:hover{

background:#dc2626;

}

@media(max-width:640px){

.add-box{

flex-direction:column;

}

.add-btn{

justify-content:center;

}

.normal-area{

flex-direction:column;

align-items:flex-start;

}

.buttons{

width:100%;

}

.edit-btn,

.delete-btn{

flex:1;

justify-content:center;

}

}

</style>

<style>
:root.dark .category-admin {
  background: var(--color-dark-bg);
  min-height: 100vh;
}
:root.dark .category-card {
  background: var(--color-dark-surface);
}
:root.dark .category-card strong {
  color: var(--color-text-primary);
}
:root.dark .category-card .count {
  color: var(--color-text-tertiary);
}
:root.dark input {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
  color: var(--color-text-primary);
}
:root.dark .add-box {
  background: var(--color-dark-surface);
}
:root.dark h1 {
  color: var(--color-text-primary);
}
:root.dark .success {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}
:root.dark .modal-box {
  background: var(--color-dark-surface);
}
:root.dark .modal-box h2 {
  color: var(--color-text-primary);
}
:root.dark .cancel {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}
:root.dark .delete-btn {
  background: #dc2626;
}
:root.dark .delete {
  background: #dc2626;
}
</style>