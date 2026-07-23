<template>
  <div class="page">
    <div class="container">
      <!-- HEADER -->
      <header class="header">
        <h1 class="title">Explore Businesses 🟡</h1>
        <p class="subtitle">Discover local marketplace directories across Ethiopia</p>
      </header>

      <!-- FILTERS -->
      <div class="filters-card">
        <div class="filter-group">
          <input
            v-model="search"
            placeholder="🔍 Search name, city, address..."
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <select v-model="category" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <select v-model="city" class="filter-select">
            <option value="">All Cities</option>
            <option>Addis Ababa</option>
            <option>Adama</option>
            <option>Hawassa</option>
            <option>Bahir Dar</option>
            <option>Dire Dawa</option>
            <option>Jimma</option>
            <option>Mekelle</option>
            <option>Gondar</option>
          </select>
        </div>
      </div>

      <!-- MAP BOX -->
      <div class="map-section">
        <h2 class="section-title">📍 Market Map</h2>
        <div class="map-container">
          <div id="explore-map"></div>
        </div>
      </div>

      <!-- LISTINGS -->
      <div class="listings-section">
        <h2 class="section-title">🏪 Marketplace Listings ({{ filteredListings.length }})</h2>
        
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Fetching directories...</p>
        </div>

        <div v-else-if="filteredListings.length === 0" class="empty-state">
          <p>No approved markets found matching your filters.</p>
        </div>

        <div v-else class="grid">
          <BusinessCard
            v-for="item in filteredListings"
            :key="item.id"
            :business="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useBusinesses } from "~/composables/useBusinesses"
import { GET_CATEGORIES } from "~/graphql/queries"

const { $apollo } = useNuxtApp() as unknown as { $apollo: any }

/* DATA STATES */
const businesses = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)

const search = ref("")
const category = ref("")
const city = ref("")

/* LEAFLET MAP STATES */
let L: any = null
let map: any = null
const markersGroup = ref<any>(null)

/* ==========================================
   FETCH DATA & MAP INITIALIZATION
========================================== */
onMounted(async () => {
  try {
    // 1. Fetch businesses (approved only)
    businesses.value = await useBusinesses({ featured: false })
    
    // 2. Fetch categories
    const catRes = await $apollo.query({
      query: GET_CATEGORIES
    })
    categories.value = catRes.data.categories || []
  } catch (err) {
    console.error("Failed to load data on listings page:", err)
  } finally {
    loading.value = false
  }

  // 3. Initialize Leaflet Map (Client Side Only)
  if (import.meta.client) {
    L = await import("leaflet")
    await import("leaflet/dist/leaflet.css")

    map = L.map("explore-map").setView([9.03, 38.74], 12)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map)

    // Layer group to hold markers, so we can clear and update them dynamically
    markersGroup.value = L.layerGroup().addTo(map)

    // Initial marker draw
    updateMapMarkers()
  }
})

/* ==========================================
   LISTINGS FILTERING (REACTIVE)
========================================== */
const filteredListings = computed(() => {
  return businesses.value.filter((b) => {
    // Resolve category name gracefully
    const catName = typeof b.category === 'object' ? b.category.name : (b.category || "")
    const matchesSearch = !search.value || 
      b.name.toLowerCase().includes(search.value.toLowerCase()) || 
      (b.city && b.city.toLowerCase().includes(search.value.toLowerCase())) ||
      (b.address && b.address.toLowerCase().includes(search.value.toLowerCase()))

    const matchesCategory = !category.value || 
      catName.toLowerCase() === category.value.toLowerCase()

    const matchesCity = !city.value || 
      b.city === city.value

    return matchesSearch && matchesCategory && matchesCity
  })
})

/* ==========================================
   MAP MARKERS UPDATES (REACTIVE)
========================================== */
const updateMapMarkers = () => {
  if (!map || !L || !markersGroup.value) return

  // Clear existing markers
  markersGroup.value.clearLayers()

  // Add new markers based on filtered list
  filteredListings.value.forEach((b) => {
    if (b.lat && b.lng) {
      const marker = L.marker([b.lat, b.lng])
      
      const popupContent = `
        <div style="font-family: sans-serif; padding: 5px;">
          <h4 style="margin: 0 0 5px 0; color: #0f172a; font-weight: bold;">${b.name}</h4>
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #64748b;">📍 ${b.address || b.city}</p>
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #eab308;">📞 ${b.phone || 'No Phone'}</p>
          <a href="/market/${b.id}" style="display: inline-block; margin-top: 8px; font-size: 11px; color: white; background: #0f172a; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-weight: bold;">View Details</a>
        </div>
      `
      
      marker.bindPopup(popupContent)
      markersGroup.value.addLayer(marker)
    }
  })

  // Fit map boundaries to markers if there are markers, otherwise reset center
  if (filteredListings.value.length > 0) {
    const validCoords = filteredListings.value
      .filter(b => b.lat && b.lng)
      .map(b => [b.lat, b.lng] as [number, number])
    
    if (validCoords.length > 0) {
      map.fitBounds(validCoords, { padding: [50, 50] })
    }
  } else {
    map.setView([9.03, 38.74], 12)
  }
}

// Watch filteredListings and update map markers automatically!
watch(filteredListings, () => {
  updateMapMarkers()
})
</script>

<style scoped>
.page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 100px 20px 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* HEADER */
.header {
  text-align: center;
  margin-bottom: 35px;
}

.title {
  font-size: 38px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 17px;
}

/* FILTERS CARD */
.filters-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .filters-card {
    grid-template-columns: 1fr;
  }
}

input, select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  font-size: 14px;
  transition: all 0.2s;
}

input:focus, select:focus {
  border-color: #facc15;
  background: white;
  box-shadow: 0 0 0 3px rgba(250,204,21,0.15);
}

/* MAP */
.map-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 15px;
}

.map-container {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 25px rgba(0,0,0,0.03);
}

#explore-map {
  height: 350px;
  width: 100%;
  z-index: 1;
}

/* LISTINGS */
.listings-section {
  margin-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

/* LOADING & EMPTY */
.loading {
  text-align: center;
  padding: 50px 0;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(250,204,21,0.1);
  border-left-color: #facc15;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 16px;
  background: white;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
}
</style>