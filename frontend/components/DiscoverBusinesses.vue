<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import BusinessCard from "./BusinessCard.vue"
import { fetchBusinesses } from "~/composables/useBusinesses"
import { useRecentlyViewed } from "~/composables/useRecentlyViewed"

const activeTab = ref("featured")

const allBusinesses = ref<any[]>([])
const featuredBusinesses = ref<any[]>([])
const nearbyBusinesses = ref<any[]>([])
const popularBusinesses = ref<any[]>([])
const recentBusinesses = ref<any[]>([])
const loading = ref(true)
const nearbyLoading = ref(false)
const nearbyError = ref("")
const radius = ref(5)
const showAll = ref(false)

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const switchTab = (tab: string) => {
  activeTab.value = tab
  if (tab === "nearby") loadNearby()
}

const displayBusinesses = computed(() => {
  if (activeTab.value === "nearby") return nearbyBusinesses.value
  if (activeTab.value === "recent") return recentBusinesses.value
  if (activeTab.value === "popular") {
    const sorted = [...allBusinesses.value]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
    return showAll.value ? sorted : sorted.slice(0, 8)
  }
  // featured (default)
  return showAll.value ? allBusinesses.value : featuredBusinesses.value
})

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const loadBusinesses = async () => {
  const businesses = await fetchBusinesses(false)
  allBusinesses.value = businesses
  featuredBusinesses.value = businesses.slice(0, 8)
  popularBusinesses.value =
    [...businesses]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 8)
}

const loadNearby = async () => {
  nearbyError.value = ""

  if (!navigator.geolocation) {
    nearbyError.value = "Location is not supported by your browser"
    return
  }

  nearbyLoading.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      nearbyBusinesses.value =
        allBusinesses.value
          .filter((b) => b.lat != null && b.lng != null)
          .map(business => ({
            ...business,
            distance: calculateDistance(
              lat, lng,
              Number(business.lat),
              Number(business.lng)
            )
          }))
          .filter(business => business.distance <= radius.value)
          .sort((a, b) => a.distance - b.distance)

      nearbyLoading.value = false
    },
    (error) => {
      console.log("LOCATION ERROR", error)

      if (error.code === error.PERMISSION_DENIED) {
        nearbyError.value = "Location access was denied. Please enable it in your browser settings to see nearby businesses."
      } else {
        nearbyError.value = "Could not get your location. Please try again."
      }

      nearbyLoading.value = false
    }
  )
}

const loadRecent = () => {
  const { recentBusinesses: saved, loadRecentBusinesses } = useRecentlyViewed()
  loadRecentBusinesses()
  recentBusinesses.value = saved.value
}

const tabs = [
  { id: "featured", label: "Featured", icon: "star" },
  { id: "nearby", label: "Nearby", icon: "map-pin" },
  { id: "popular", label: "Popular", icon: "trending-up" },
  { id: "recent", label: "Recent", icon: "clock" }
]

onMounted(async () => {
  try {
    await loadBusinesses()
    loadRecent()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="discover-section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Handpicked For You</span>
        <h2>Discover Businesses</h2>
        <p>Browse top-rated businesses in your area</p>
      </div>

      <!-- Tabs -->
      <div class="tabs-wrap">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab', { active: activeTab === tab.id }]"
            @click="switchTab(tab.id)"
          >
            <svg v-if="tab.icon === 'star'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <svg v-else-if="tab.icon === 'map-pin'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <svg v-else-if="tab.icon === 'trending-up'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <svg v-else-if="tab.icon === 'clock'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ tab.label }}
          </button>
        </div>

        <button class="see-all-btn" @click="toggleShowAll">
          {{ showAll ? "Show Less" : "Show More" }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline :points="showAll ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
          </svg>
        </button>
      </div>

      <!-- Business Grid -->
      <div class="business-grid" :key="activeTab">
        <BusinessCard
          v-for="business in displayBusinesses"
          :key="business.id"
          :business="business"
        />
      </div>

      <div v-if="activeTab === 'nearby' && nearbyLoading" class="nearby-state">
        Finding businesses near you...
      </div>

      <div v-else-if="activeTab === 'nearby' && nearbyError" class="nearby-state error">
        {{ nearbyError }}
      </div>

      <div v-else-if="activeTab === 'nearby' && !nearbyLoading && nearbyBusinesses.length === 0" class="nearby-state">
        No businesses found within {{ radius }}km of your location yet.
      </div>
    </div>
  </section>
</template>

<style scoped>
.discover-section {
  padding: 6rem 0;
  background: var(--color-bg);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Tabs + toggle row */
.tabs-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.see-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: var(--color-primary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.see-all-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.375rem;
  padding: 0.375rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.tab:hover {
  color: var(--color-text-primary);
  background: var(--color-surface);
}

.tab.active {
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}

/* Business Grid */
.business-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.nearby-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.nearby-state.error {
  color: #dc2626;
}

/* Responsive */
@media (max-width: 1280px) {
  .business-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .business-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .discover-section {
    padding: 4rem 0;
  }

  .tabs-wrap {
    flex-direction: column;
    align-items: stretch;
    gap: 0.875rem;
  }

  .tabs {
    overflow-x: auto;
    width: 100%;
    -webkit-overflow-scrolling: touch;
  }

  .tab {
    white-space: nowrap;
  }

  .see-all-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .business-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Dark mode - global */
:root.dark .discover-section {
  background: var(--color-dark-bg);
}

:root.dark .see-all-btn {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(245, 158, 11, 0.08);
}

:root.dark .see-all-btn:hover {
  background: rgba(245, 158, 11, 0.18);
  border-color: var(--color-primary-hover);
}

:root.dark .tabs {
  background: var(--color-dark-bg-tertiary);
}

:root.dark .tab {
  color: #cbd5e1;
}

:root.dark .tab:hover {
  background: var(--color-dark-surface);
  color: #f1f5f9;
}

:root.dark .tab.active {
  background: var(--color-primary);
  color: var(--color-dark-bg);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
  font-weight: 700;
}

:root.dark .nearby-state {
  color: #cbd5e1;
}
</style>
