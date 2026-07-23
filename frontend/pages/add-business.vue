<template>
  <div class="page">
<div class="hero">
  <h1>Add Your Business</h1>
  <p>
    Reach thousands of customers by listing your business on Yellow Mart.
  </p>
</div>


<!-- SUCCESS MESSAGE -->
<div
  v-if="successMessage"
  class="success-toast"
>
  ✅ Business added successfully!
</div>


<div class="container">

  <div
    v-if="!user"
    class="auth-warning"
  >
    <h2>🔒 Login Required</h2>
        <p>
          You must be logged in before adding a business.
        </p>

        <button @click="goLogin">
          Login
        </button>
      </div>

      <div
        v-else
        class="form-card"
      >

        <div class="section-title">
          🏪 Business Information
        </div>

        <div class="form-grid">

          <div class="form-group">

            <label>Business Name *</label>

            <input
              v-model="name"
              placeholder="Example: Tomoca Coffee"
            >

          </div>

          <div class="form-group">

            <label>Category *</label>

            <select v-model="form.category_id">

              <option
                disabled
                value=""
              >
                Select Category
              </option>

              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>

            </select>

          </div>

          <div class="form-group">

            <label>Phone *</label>

            <input
              v-model="form.phone"
              placeholder="+251911223344"
            >

          </div>

          <div class="form-group">

            <label>City *</label>

            <select v-model="form.city">

              <option>Addis Ababa</option>
              <option>Bahir Dar</option>
              <option>Gondar</option>
              <option>Hawassa</option>

            </select>

          </div>

          <div class="form-group full">
            <label>Address *</label>

            <input
              v-model="form.address"
              placeholder="Bole Road, Addis Ababa"
            >

          </div>

          <div class="form-group full">

            <label>Description</label>

            <textarea
              rows="5"
              v-model="form.description"
              placeholder="Tell customers about your business..."
            />

          </div>

          <div class="form-group full">

            <label>Business Image</label>

            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
            >

          </div>

        </div>

        <div class="map-section">

          <h3>
            📍 Select Business Location
          </h3>

          <div id="add-business-map"></div>

          <div class="coordinates">

            <span>
              Latitude:
              {{ lat.toFixed(6) }}
            </span>

            <span>
              Longitude:
              {{ lng.toFixed(6) }}
            </span>

          </div>

        </div>

        <button
          class="submit-btn"
          :disabled="submitting"
          @click="submitBusiness"
        >

          {{ submitting ? "Submitting..." : "🚀 Submit Business" }}

        </button>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useNuxtApp } from "#app"

import { useAuth } from "~/composables/useAuth"

import {
  GET_CATEGORIES,
  CREATE_BUSINESS
} from "~/graphql/queries"

const router = useRouter()

const { user } = useAuth()

const { $apollo } = useNuxtApp() as any

// ---------------------
// FORM
// ---------------------

const name = ref("")

const form = ref({
  category_id: "",
  phone: "",
  city: "Addis Ababa",
  address: "",
  description: ""
})

const file = ref<File | null>(null)
  const imageUrl = ref("")

const submitting = ref(false)
const successMessage = ref(false)

// ---------------------
// CATEGORY
// ---------------------

interface Category {

  id: string
  name: string
  icon?: string

}

const categories = ref<Category[]>([])

// ---------------------
// MAP
// ---------------------

const lat = ref(9.03)
const lng = ref(38.74)

let L: any
let map: any
let marker: any

// ---------------------
// LOAD PAGE
// ---------------------

onMounted(async () => {

  try {

    const { data } = await $apollo.query({

  query: GET_CATEGORIES,

  fetchPolicy: "network-only"

})

console.log("Apollo returned:", data)

console.log("Categories:", data.categories)

categories.value = data.categories || []
console.log("Loaded categories:", categories.value)

  }

  catch (error) {

    console.error("Category Error:", error)

  }

  if (import.meta.client && user.value) {

    await import("leaflet/dist/leaflet.css")

    const leaflet = await import("leaflet")

    L = leaflet.default

    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({

      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

    })

    map = L.map("add-business-map")

      .setView([lat.value, lng.value], 13)

    L.tileLayer(

      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

      {

        attribution: "© OpenStreetMap"

      }

    ).addTo(map)

    marker = L.marker(

      [lat.value, lng.value],

      {

        draggable: true

      }

    ).addTo(map)

    marker.on("dragend", () => {

      const pos = marker.getLatLng()

      lat.value = pos.lat

      lng.value = pos.lng

    })

    map.on("click", (e: any) => {

      lat.value = e.latlng.lat

      lng.value = e.latlng.lng

      marker.setLatLng(e.latlng)

    })

  }

})

// ---------------------
// IMAGE
// ---------------------

const onFileChange = (event: any) => {

  file.value = event.target.files[0]

}
const uploadImage = async () => {

  if (!file.value) return ""

  const formData = new FormData()

  formData.append("file", file.value)

  formData.append("upload_preset", "yellowmart")

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/vqj4fvh0/image/upload",
    {
      method: "POST",
      body: formData
    }
  )

  const data = await response.json()

  console.log("Cloudinary:", data)

  imageUrl.value = data.secure_url

  return data.secure_url

}
// ---------------------
// LOGIN
// ---------------------

const goLogin = () => {

  router.push("/login")

}

// ---------------------
// SUBMIT
// ---------------------

const submitBusiness = async () => {

  if (!form.value.category_id) {

    alert("Please select a category.")

    return

  }

  submitting.value = true

  try {

    const uploadedImage = await uploadImage()
console.log("UPLOADED IMAGE VALUE:", uploadedImage)
console.log("TYPE:", typeof uploadedImage)
console.log("MUTATION IMAGE:", uploadedImage)
    const { data } = await $apollo.mutate({

      mutation: CREATE_BUSINESS,

      variables:{

category_id: form.value.category_id,

name:name.value,

description:form.value.description,

phone:form.value.phone,

address:form.value.address,

city:form.value.city,

image:uploadedImage,

lat:lat.value,
owner_id:user.value.id,
lng:lng.value

}
    })

    console.log(data)
successMessage.value = true

setTimeout(() => {

  successMessage.value = false

  router.push("/businesses")

}, 2500)

  }

  catch (error: any) {
  console.error("FULL ERROR:", error)
  console.log(error?.graphQLErrors)
  console.log(error?.networkError)
  alert("Failed to add business.")
}

  finally {

    submitting.value = false

  }

}

</script>

<style scoped>

.page{
  min-height:100vh;
  background:#f8fafc;
  padding:100px 20px;
}

.hero{
  text-align:center;
  margin-bottom:40px;
}

.hero h1{
  font-size:42px;
  font-weight:900;
  color:#0f172a;
  margin-bottom:10px;
}

.hero p{
  color:#64748b;
  font-size:18px;
}

.container{
  max-width:1000px;
  margin:auto;
}

.auth-warning{
  background:white;
  border-radius:20px;
  padding:40px;
  text-align:center;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.auth-warning h2{
  margin-bottom:15px;
}

.auth-warning button{
  margin-top:20px;
  padding:14px 30px;
  border:none;
  border-radius:12px;
  background:#facc15;
  font-weight:700;
  cursor:pointer;
}

.form-card{
  background:white;
  border-radius:20px;
  padding:35px;
  box-shadow:0 12px 30px rgba(0,0,0,.08);
}

.section-title{
  font-size:24px;
  font-weight:800;
  margin-bottom:30px;
  color:#0f172a;
}

.form-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:25px;
}

.full{
  grid-column:1 / -1;
}

.form-group{
  display:flex;
  flex-direction:column;
}

.form-group label{
  font-weight:700;
  margin-bottom:8px;
  color:#334155;
}

.form-group input,
.form-group select,
.form-group textarea{
  padding:14px;
  border:1px solid #cbd5e1;
  border-radius:12px;
  background:#f8fafc;
  font-size:15px;
  transition:.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus{
  outline:none;
  border-color:#facc15;
  background:white;
}

.map-section{
  margin-top:35px;
}

.map-section h3{
  margin-bottom:15px;
}

#add-business-map{
  height:350px;
  border-radius:15px;
  overflow:hidden;
}

.coordinates{
  display:flex;
  justify-content:space-between;
  margin-top:15px;
  color:#64748b;
  font-size:14px;
}
.submit-btn{

  width:100%;

  margin-top:30px;

  padding:16px;

  background:#facc15;

  color:#111827;

  border:none;

  border-radius:14px;

  font-size:18px;

  font-weight:800;

  cursor:pointer;

  transition:.3s;

}


.submit-btn:hover{

  background:#eab308;

  transform:translateY(-3px);

}



.submit-btn:disabled{

  opacity:.6;

  cursor:not-allowed;

}




/* INPUT FILE */

input[type="file"]{

  background:white;

  cursor:pointer;

}



/* MOBILE */

@media(max-width:768px){


  .page{

    padding:80px 15px 30px;

  }


  .hero h1{

    font-size:32px;

  }


  .form-card{

    padding:20px;

  }


  .form-grid{

    grid-template-columns:1fr;

  }


  .coordinates{

    flex-direction:column;

    gap:8px;

  }


}



/* SMALL ANIMATION */

.form-card{

  animation:fadeIn .5s ease;

}


@keyframes fadeIn{

  from{

    opacity:0;

    transform:translateY(20px);

  }


  to{

    opacity:1;

    transform:translateY(0);

  }

}
.success-toast {
  position: fixed;
  top: 100px;
  right: 30px;
  background: #22c55e;
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  animation: slideIn .4s ease;
  z-index: 9999;
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

</style>