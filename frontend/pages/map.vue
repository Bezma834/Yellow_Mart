<template>
  <div class="map-page">
    <div class="container">
      <div class="page-hero">
        <span class="eyebrow">Explore</span>
        <h1>Find Businesses Near You</h1>
        <p>Explore businesses across Addis Ababa and beyond</p>
      </div>

      <div class="map-toolbar">
        <span class="map-count">{{ businesses.length }} business{{ businesses.length === 1 ? "" : "es" }} on the map</span>
        <span class="map-hint">Scroll to zoom · Drag to pan · Click a marker for details</span>
      </div>

      <div id="business-map"></div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { onMounted, ref } from "vue"
import { GET_ALL_BUSINESSES } from "~/graphql/queries"


const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])


let L: any = null
let map: any = null



onMounted(async () => {

  try {

    const result = await $apollo.query({

      query: GET_ALL_BUSINESSES

    })

    businesses.value = result.data.businesses || []

  } catch (error) {

    console.error("Failed loading businesses:", error)

  }

  if (import.meta.client) {

    await import("leaflet/dist/leaflet.css")

    const leaflet = await import("leaflet")

    L = leaflet.default

    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    })

    map = L.map("business-map").setView([9.03, 38.74], 13)

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap" }
    ).addTo(map)

    businesses.value.forEach((business) => {
      if (business.lat && business.lng) {
        const marker = L.marker([business.lat, business.lng]).addTo(map)

        marker.bindPopup(`
          <h3>${business.name}</h3>
          <p>${business.city || ""}</p>
          <p>${business.address || ""}</p>
          <a href="/market/${business.id}">View Details</a>
        `)
      }
    })
  }
})

</script>



<style scoped>

.map-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 6.5rem 1.5rem 5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 60% 100% at 50% -20%, var(--color-primary-light) 0%, transparent 60%),
    var(--color-surface);
  border: 1px solid var(--color-border-light);
  padding: 3rem 2rem;
  border-radius: var(--radius-3xl);
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.page-hero h1 {
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0.75rem 0 0.625rem;
}

.page-hero p {
  color: var(--color-text-secondary);
  font-size: 1.0625rem;
  margin: 0;
}

.map-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 0.25rem;
}

.map-count {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.map-count::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.map-hint {
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
}

#business-map {
  height: 560px;
  width: 100%;
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-light);
  z-index: 0;
}

#business-map :deep(.leaflet-popup-content) {
  font-family: inherit;
}

#business-map :deep(.leaflet-popup-content h3) {
  margin: 0 0 0.25rem;
  font-size: 0.9375rem;
  font-weight: 700;
}

#business-map :deep(.leaflet-popup-content p) {
  margin: 0 0 0.125rem;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

#business-map :deep(.leaflet-popup-content a) {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-primary-hover);
  text-decoration: none;
}

@media (max-width: 768px) {
  .map-page {
    padding: 5.5rem 1rem 4rem;
  }

  .page-hero {
    padding: 2.25rem 1.25rem;
  }

  .map-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }

  #business-map {
    height: 420px;
    border-radius: var(--radius-2xl);
  }
}

</style>

<style>
:root.dark .map-page {
  background: var(--color-dark-bg);
}

:root.dark .page-hero {
  background:
    radial-gradient(ellipse 60% 100% at 50% -20%, rgba(245, 158, 11, 0.15) 0%, transparent 60%),
    var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .map-count {
  color: var(--color-text-primary);
}

:root.dark .map-hint {
  color: var(--color-text-secondary);
}

:root.dark #business-map {
  border-color: var(--color-dark-border);
}
</style>
