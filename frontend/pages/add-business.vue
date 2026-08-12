<template>
  <div class="page">
<div class="hero">
  <span class="eyebrow">Grow Your Business</span>
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
  Business added successfully!
</div>

<!-- GENERAL ERROR -->
<div
  v-if="generalError"
  class="error-toast"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  {{ generalError }}
</div>


<div class="container">

  <div
    v-if="!user"
    class="auth-warning"
  >
    <h2>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Login Required
    </h2>
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
          Business Information
        </div>

        <div class="form-grid">

          <div class="form-group">

            <label>Business Name *</label>

            <input
              v-model="name"
              :class="['form-input', { 'input-error': nameError }]"
              placeholder="Example: Tomoca Coffee"
            >
            <div v-if="nameError" class="field-error">{{ nameError }}</div>

          </div>

          <div class="form-group">

            <label>Category *</label>

            <div class="hover-select" @mouseenter="openCategory = true; categorySearch = ''" @mouseleave="openCategory = false">
              <div class="hover-select-trigger">
                {{ selectedCategoryName || "Select Category" }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <div v-if="openCategory" class="hover-select-options" @click.stop>
                <div class="hover-select-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input v-model="categorySearch" placeholder="Search category..." @input.stop />
                </div>
                <div
                  v-for="cat in filteredCategories"
                  :key="cat.id"
                  :class="['hover-select-item', { active: form.category_id === cat.id }]"
                  @click="form.category_id = cat.id; openCategory = false"
                >
                  {{ cat.name }}
                </div>
                <div v-if="filteredCategories.length === 0" class="hover-select-empty">No categories found</div>
              </div>
            </div>

          </div>

          <div class="form-group">

            <label>Phone *</label>

            <input
              v-model="form.phone"
              :class="['form-input', { 'input-error': phoneError }]"
              placeholder="+251911223344"
            >
            <div v-if="phoneError" class="field-error">{{ phoneError }}</div>

          </div>

          <div class="form-group">

            <label>City *</label>

            <div class="hover-select" @mouseenter="openCity = true; citySearch = ''" @mouseleave="openCity = false">
              <div class="hover-select-trigger">
                {{ form.city || "Select City" }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <div v-if="openCity" class="hover-select-options" @click.stop>
                <div class="hover-select-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input v-model="citySearch" placeholder="Search city..." @input.stop />
                </div>
                <div
                  v-for="city in filteredCities"
                  :key="city"
                  :class="['hover-select-item', { active: form.city === city }]"
                  @click="form.city = city; openCity = false"
                >
                  {{ city }}
                </div>
                <div v-if="filteredCities.length === 0" class="hover-select-empty">No cities found</div>
              </div>
            </div>

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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Select Business Location
          </h3>

          <div class="map-actions">
            <button
              type="button"
              class="locate-btn"
              :disabled="locating"
              @click="useMyLocation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
              {{ locating ? "Getting location..." : "Use My Location" }}
            </button>
          </div>

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

          {{ submitting ? "Submitting..." : "Submit Business" }}

        </button>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useNuxtApp } from "#app"

import { useAuth } from "~/composables/useAuth"

import {
  GET_CATEGORIES,
  CREATE_BUSINESS,
  CHECK_BUSINESS_UNIQUENESS
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
// VALIDATION ERRORS
// ---------------------

const nameError = ref("")
const phoneError = ref("")
const generalError = ref("")

// ---------------------
// CATEGORY
// ---------------------

interface Category {

  id: string
  name: string
  icon?: string

}

const categories = ref<Category[]>([])

const openCategory = ref(false)
const openCity = ref(false)
const categorySearch = ref("")
const citySearch = ref("")

const filteredCategories = computed(() => {
  const q = categorySearch.value.toLowerCase().trim()
  if (!q) return categories.value
  return categories.value.filter(c => c.name.toLowerCase().includes(q))
})

const filteredCities = computed(() => {
  const q = citySearch.value.toLowerCase().trim()
  if (!q) return cities.value
  return cities.value.filter(c => c.toLowerCase().includes(q))
})

const selectedCategoryName = computed(() => {
  const cat = categories.value.find(c => c.id === form.value.category_id)
  return cat ? cat.name : ""
})

const cities = ref([
  "Addis Ababa",
  "Adama (Nazareth)",
  "Arba Minch",
  "Assosa",
  "Axum",
  "Bahir Dar",
  "Debre Berhan",
  "Debre Markos",
  "Dessie",
  "Dilla",
  "Dire Dawa",
  "Gambela",
  "Goba",
  "Gondar",
  "Harar",
  "Hawassa",
  "Jijiga",
  "Jimma",
  "Kombolcha",
  "Lalibela",
  "Mekelle",
  "Nekemte",
  "Semera",
  "Shashamane",
  "Sodo",
  "Woldia",
  "Wolaita Sodo",
  "Ziway"
])

// ---------------------
// MAP
// ---------------------

const lat = ref(9.03)
const lng = ref(38.74)
const locating = ref(false)

let L: any
let map: any
let marker: any

const useMyLocation = () => {
  if (!navigator.geolocation) {
    generalError.value = "Location is not supported by your browser"
    return
  }

  locating.value = true
  generalError.value = ""

  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat.value = position.coords.latitude
      lng.value = position.coords.longitude

      if (map && marker) {
        map.setView([lat.value, lng.value], 15)
        marker.setLatLng([lat.value, lng.value])
      }

      locating.value = false
    },
    (error) => {
      locating.value = false

      if (error.code === error.PERMISSION_DENIED) {
        generalError.value = "Location access was denied. Enable it in your browser settings, or drag the marker on the map instead."
      } else {
        generalError.value = "Could not get your location. Drag the marker on the map instead."
      }
    }
  )
}

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
// VALIDATE UNIQUENESS
// ---------------------

const validateUniqueness = async () => {
  nameError.value = ""
  phoneError.value = ""

  if (!name.value.trim() && !form.value.phone.trim()) return true

  try {
    const { data } = await $apollo.query({
      query: CHECK_BUSINESS_UNIQUENESS,
      variables: {
        name: name.value.trim(),
        phone: form.value.phone.trim()
      },
      fetchPolicy: "network-only"
    })

    let valid = true

    if (data.nameClash?.length > 0) {
      nameError.value = `"${name.value}" is already registered. Please use a different business name.`
      valid = false
    }

    if (data.phoneClash?.length > 0) {
      phoneError.value = `Phone number ${form.value.phone} is already in use by "${data.phoneClash[0].name}". Please use a different number.`
      valid = false
    }

    return valid
  } catch (err) {
    console.error("Uniqueness check error:", err)
    return true // let the mutation catch it
  }
}

// ---------------------
// SUBMIT
// ---------------------

const submitBusiness = async () => {

  if (!form.value.category_id) {

    generalError.value = "Please select a category."

    return

  }

  generalError.value = ""

  // Check name/phone uniqueness first
  const isUnique = await validateUniqueness()
  if (!isUnique) return

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

  // Try to extract a meaningful message from GraphQL errors
  const gqlMsg = error?.graphQLErrors?.[0]?.message
  if (gqlMsg?.toLowerCase().includes("unique") || gqlMsg?.toLowerCase().includes("duplicate")) {
    if (gqlMsg?.toLowerCase().includes("name")) {
      nameError.value = `"${name.value}" is already registered. Please use a different business name.`
    } else if (gqlMsg?.toLowerCase().includes("phone")) {
      phoneError.value = `Phone number ${form.value.phone} is already in use. Please use a different number.`
    } else {
      generalError.value = "This business name or phone number already exists."
    }
  } else {
    generalError.value = gqlMsg || "Failed to add business. Please try again."
  }
}

  finally {

    submitting.value = false

  }

}

</script>

<style scoped>

.page{
  min-height:100vh;
  background:var(--color-bg-secondary);
  padding:100px 20px;
}

.hero{
  text-align:center;
  margin-bottom:40px;
}

.hero .eyebrow{
  color:var(--color-primary-hover);
}

.hero h1{
  font-size:42px;
  font-weight:900;
  color:var(--color-text-primary);
  margin-bottom:10px;
}

.hero p{
  color:var(--color-text-tertiary);
  font-size:18px;
}

.container{
  max-width:1000px;
  margin:auto;
}

.auth-warning{
  background:var(--color-surface);
  border-radius:20px;
  padding:40px;
  text-align:center;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.auth-warning h2{
  margin-bottom:15px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
}

.auth-warning h2 svg{
  color:var(--color-primary-hover);
}

.auth-warning button{
  margin-top:20px;
  padding:14px 30px;
  border:none;
  border-radius:12px;
  background:var(--color-primary);
  font-weight:700;
  font-family:inherit;
  cursor:pointer;
}

.form-card{
  background:var(--color-surface);
  border-radius:20px;
  padding:35px;
  box-shadow:0 12px 30px rgba(0,0,0,.08);
}

.section-title{
  font-size:24px;
  font-weight:800;
  margin-bottom:30px;
  color:var(--color-text-primary);
  display:flex;
  align-items:center;
  gap:10px;
}

.section-title svg{
  color:var(--color-primary);
  flex-shrink:0;
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
  color:var(--color-text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea{
  padding:14px;
  border:1px solid var(--color-border);
  border-radius:var(--radius-lg);
  background:var(--color-bg-secondary);
  font-size:15px;
  transition:.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus{
  outline:none;
  border-color:var(--color-primary);
  background:var(--color-surface);
}

/* Input error state */
.form-input.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2;
}

:root.dark .form-input.input-error {
  border-color: #f87171 !important;
  background: rgba(239, 68, 68, 0.1);
}

.field-error {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  line-height: 1.4;
}

:root.dark .field-error {
  color: #f87171;
}

/* Hover-triggered dropdown */
.hover-select{
  position:relative;
  cursor:pointer;
}

.hover-select-trigger{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px;
  border:1px solid var(--color-border);
  border-radius:var(--radius-lg);
  background:var(--color-bg-secondary);
  font-size:15px;
  color:var(--color-text-primary);
  transition:.3s;
  gap:8px;
}

.hover-select-trigger svg{
  flex-shrink:0;
  color:var(--color-text-tertiary);
  transition:transform .2s ease;
}

.hover-select:hover .hover-select-trigger{
  border-color:var(--color-primary);
}

.hover-select-options{
  position:absolute;
  top:calc(100% + 4px);
  left:0;
  right:0;
  max-height:240px;
  overflow-y:auto;
  background:var(--color-surface);
  border:1px solid var(--color-border);
  border-radius:var(--radius-lg);
  box-shadow:var(--shadow-lg);
  z-index:50;
  padding:6px;
}

.hover-select-item{
  padding:10px 14px;
  border-radius:var(--radius-md);
  font-size:14px;
  color:var(--color-text-secondary);
  transition:all .15s ease;
  cursor:pointer;
}

.hover-select-item:hover{
  background:var(--color-primary-light);
  color:var(--color-text-primary);
}

.hover-select-item.active{
  background:var(--color-primary);
  color:var(--color-text-primary);
  font-weight:600;
}

.hover-select-search{
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  margin-bottom:4px;
  background:var(--color-bg-tertiary);
  border-radius:var(--radius-md);
  border:1px solid var(--color-border);
}

.hover-select-search svg{
  flex-shrink:0;
  color:var(--color-text-tertiary);
}

.hover-select-search input{
  flex:1;
  border:none;
  outline:none;
  background:transparent;
  font-size:13px;
  color:var(--color-text-primary);
}

.hover-select-search input::placeholder{
  color:var(--color-text-tertiary);
}

.hover-select-empty{
  padding:14px;
  text-align:center;
  color:var(--color-text-tertiary);
  font-size:14px;
}

.map-section{
  margin-top:35px;
}

.map-section h3{
  margin-bottom:15px;
  display:flex;
  align-items:center;
  gap:8px;
}

.map-section h3 svg{
  color:var(--color-primary-hover);
}

.map-actions{
  margin-bottom:15px;
}

.locate-btn{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:10px 18px;
  border:1px solid var(--color-border);
  border-radius:var(--radius-full);
  background:var(--color-surface);
  color:var(--color-text-secondary);
  font-size:14px;
  font-weight:600;
  font-family:inherit;
  cursor:pointer;
  transition:all .2s ease;
}

.locate-btn svg{
  color:var(--color-primary-hover);
}

.locate-btn:hover{
  border-color:var(--color-primary);
  color:var(--color-text-primary);
  background:var(--color-primary-light);
}

.locate-btn:disabled{
  opacity:.6;
  cursor:not-allowed;
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
  color:var(--color-text-tertiary);
  font-size:14px;
}
.submit-btn{

  width:100%;

  margin-top:30px;

  padding:16px;

  background:var(--color-primary);

  color:var(--color-text-primary);

  border:none;

  border-radius:14px;

  font-size:18px;

  font-weight:800;

  font-family:inherit;

  cursor:pointer;

  transition:.3s;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:8px;

}


.submit-btn:hover{

  background:var(--color-primary-hover);

  transform:translateY(-3px);

}



.submit-btn:disabled{

  opacity:.6;

  cursor:not-allowed;

}




/* INPUT FILE */

input[type="file"]{

  background:var(--color-surface);

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

    grid-template-columns:minmax(0,1fr);

  }

  .form-group{

    min-width:0;

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
  border-radius: var(--radius-lg);
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  animation: slideIn .4s ease;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-toast {
  position: fixed;
  top: 100px;
  right: 30px;
  background: #ef4444;
  color: white;
  padding: 15px 25px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  animation: slideIn .4s ease;
  z-index: 9999;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 10px;
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

<style>
:root.dark .page { background: var(--color-dark-bg); }
:root.dark .hero h1 { color: var(--color-text-primary); }
:root.dark .hero p { color: var(--color-text-secondary); }
:root.dark .auth-warning { background: var(--color-dark-surface); }
:root.dark .auth-warning button { background: var(--color-primary); color: var(--color-text-primary); }
:root.dark .form-card { background: var(--color-dark-surface); }
:root.dark .section-title { color: var(--color-text-primary); }
:root.dark .form-group label { color: var(--color-text-secondary); }
:root.dark .form-group input,
:root.dark .form-group select,
:root.dark .form-group textarea { background: var(--color-dark-bg-secondary); border-color: var(--color-dark-border); color: var(--color-text-primary); }
:root.dark .form-group input:focus,
:root.dark .form-group select:focus,
:root.dark .form-group textarea:focus { background: var(--color-dark-bg-tertiary); border-color: var(--color-primary); }
:root.dark .hover-select-trigger { background: var(--color-dark-bg-secondary); border-color: var(--color-dark-border); color: var(--color-text-primary); }
:root.dark .hover-select-options { background: var(--color-dark-surface); border-color: var(--color-dark-border); }
:root.dark .hover-select-item { color: var(--color-text-secondary); }
:root.dark .hover-select-item:hover { background: var(--color-primary-light); color: var(--color-text-primary); }
:root.dark .hover-select-item.active { background: var(--color-primary); color: var(--color-text-primary); }
:root.dark .hover-select-search { background: var(--color-dark-bg-tertiary); border-color: var(--color-dark-border); }
:root.dark .hover-select-search input { color: var(--color-text-primary); }
:root.dark .hover-select-search input::placeholder { color: var(--color-text-tertiary); }
:root.dark .coordinates { color: var(--color-text-tertiary); }
:root.dark .locate-btn { background: var(--color-dark-surface); border-color: var(--color-dark-border); color: var(--color-text-secondary); }
:root.dark .locate-btn svg { color: var(--color-primary); }
:root.dark .locate-btn:hover { border-color: var(--color-primary); color: var(--color-text-primary); background: var(--color-primary-light); }
:root.dark .submit-btn { background: var(--color-primary); color: var(--color-text-primary); }
:root.dark .submit-btn:hover { background: var(--color-primary-hover); }
:root.dark input[type="file"] { background: var(--color-dark-surface); color: var(--color-text-primary); }
:root.dark .error-toast { background: #dc2626; color: white; }
:root.dark .field-error { color: #f87171; }
:root.dark .form-input.input-error { border-color: #f87171 !important; background: rgba(239, 68, 68, 0.1); }
</style>