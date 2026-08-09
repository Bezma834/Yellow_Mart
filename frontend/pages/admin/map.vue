<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

import { ref, onMounted } from "vue"
import { useAdminApi } from "~/composables/useAdminApi"

const { getBusinesses, loading } = useAdminApi()

const businesses = ref<any[]>([])
const error = ref("")
const mapStatus = ref<"loading" | "ready" | "no-key" | "error">("loading")

const loadBusinesses = async () => {
  error.value = ""
  try {
    const data = await getBusinesses("approved")
    businesses.value = data.businesses || []
  } catch (err: any) {
    error.value = err.message || "Could not load businesses"
    console.error(err)
  }
}

const initMap = async () => {
  const apiKey = useRuntimeConfig().public.googleMapsKey as string | undefined

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_KEY") {
    mapStatus.value = "no-key"
    return
  }

  try {
    const { Loader } = await import("@googlemaps/js-api-loader")
    const loader = new Loader({ apiKey })
    const google = await loader.load()

    const el = document.getElementById("admin-map") as HTMLElement
    if (!el) return

    const map = new google.maps.Map(el, {
      center: { lat: 9.03, lng: 38.74 },
      zoom: 11
    })

    const markers = businesses.value.filter(
      (b) => b.lat != null && b.lng != null
    )

    markers.forEach((business) => {
      new google.maps.Marker({
        position: { lat: Number(business.lat), lng: Number(business.lng) },
        map,
        title: business.name
      })
    })

    mapStatus.value = "ready"
  } catch (err) {
    console.error("MAP ERROR:", err)
    mapStatus.value = "error"
  }
}

onMounted(async () => {
  await loadBusinesses()
  initMap()
})
</script>

<template>
  <div class="map-page">
    <div class="page-header">
      <div>
        <h1>Business Map</h1>
        <p>{{ businesses.length }} approved businesses with location data</p>
      </div>
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
      <button @click="loadBusinesses">Retry</button>
    </div>

    <div v-if="loading" class="map-skeleton"></div>

    <div v-else-if="mapStatus === 'no-key'" class="no-key">
      <div class="no-key-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <h3>Google Maps key not configured</h3>
      <p>Add <code>NUXT_PUBLIC_GOOGLE_MAPS_KEY</code> to your frontend environment to display the map.</p>
    </div>

    <div v-else-if="mapStatus === 'error'" class="no-key">
      <div class="no-key-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h3>Could not load the map</h3>
      <p>Check that your Google Maps key is valid and has Maps JavaScript API enabled.</p>
    </div>

    <div v-else id="admin-map" class="map-canvas"></div>
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  color: var(--color-text-primary);
}

.page-header p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.error-banner button {
  margin-left: auto;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}

.error-banner button:hover {
  background: rgba(239, 68, 68, 0.18);
}

.map-canvas {
  width: 100%;
  height: calc(100vh - 220px);
  min-height: 420px;
  border-radius: 16px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.map-skeleton {
  width: 100%;
  height: calc(100vh - 220px);
  min-height: 420px;
  border-radius: 16px;
  background: var(--color-bg-tertiary);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.no-key {
  background: var(--color-surface);
  border: 1px dashed var(--color-border-light);
  border-radius: 16px;
  padding: 70px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-key-icon {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.no-key h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.no-key p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 420px;
  line-height: 1.6;
}

.no-key code {
  background: var(--color-bg-tertiary);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 13px;
}
</style>
