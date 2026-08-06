<script setup lang="ts">
import {
  REMOVE_FAVORITE,
  ADD_FAVORITE
} from "~/graphql/queries"
import { gql } from "@apollo/client"
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted, nextTick } from "vue"
import { useAuth } from "~/composables/useAuth"
import { useRecentlyViewed } from "~/composables/useRecentlyViewed"

const route = useRoute()
const router = useRouter()

const { $apollo } = useNuxtApp() as any

const business = ref<any>(null)
const isFavorite = ref(false)

const { user } = useAuth()

const toggleFavorite = async () => {
  if (!user.value) {
    router.push("/login")
    return
  }

  if (!business.value) return

  try {
    if (!isFavorite.value) {
      await $apollo.mutate({
        mutation: ADD_FAVORITE,
        variables: {
          user_id: user.value.id,
          business_id: business.value.id
        }
      })
      isFavorite.value = true
    } else {
      await $apollo.mutate({
        mutation: REMOVE_FAVORITE,
        variables: {
          user_id: user.value.id,
          business_id: business.value.id
        }
      })
      isFavorite.value = false
    }
  } catch (error) {
    console.error("Favorite error:", error)
  }
}

const GET_BUSINESS = gql`
query GetBusiness($id: uuid!) {
  businesses_by_pk(id:$id){
    id
    name
    description
    category {
      id
      name
    }
    phone
    address
    city
    image
    lat
    lng
    views
    likes
  }
}
`

const loadBusiness = async () => {
  try {
    const result = await $apollo.query({
      query: GET_BUSINESS,
      variables: {
        id: route.params.id
      }
    })

    business.value = result.data.businesses_by_pk

    const { addRecentlyViewed } = useRecentlyViewed()
    addRecentlyViewed(business.value)
  } catch (error) {
    console.error("LOAD BUSINESS ERROR:", error)
  }
}

let map: any

const loadMap = async () => {
  if (!business.value || !business.value.lat || !business.value.lng) return

  await nextTick()

  const L = (await import("leaflet")).default
  await import("leaflet/dist/leaflet.css")

  map = L.map("business-map").setView(
    [business.value.lat, business.value.lng],
    15
  )

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap"
    }
  ).addTo(map)

  L.marker([business.value.lat, business.value.lng]).addTo(map)

  setTimeout(() => {
    map.invalidateSize()
  }, 300)
}

onMounted(async () => {
  await loadBusiness()
  await loadMap()
})
</script>

<template>
  <div class="page">
    <!-- LOADING -->
    <div v-if="!business" class="loading-state">
      <div class="spinner"></div>
      <p>Loading business...</p>
    </div>

    <!-- BUSINESS DETAILS -->
    <div v-else class="details">
      <!-- HERO IMAGE -->
      <div class="hero-image">
        <BusinessImage :business="business" :alt="business.name" />
        <div class="hero-overlay"></div>

        <button
          class="favorite-btn"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
          :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <svg v-if="isFavorite" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <span class="category-badge">{{ business.category?.name || "Business" }}</span>
      </div>

      <!-- CONTENT -->
      <div class="content">
        <div class="main-col">
          <!-- INFO CARD -->
          <div class="card info-card">
            <h1>{{ business.name }}</h1>

            <div class="location">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ business.address || "No address" }}, {{ business.city || "Ethiopia" }}</span>
            </div>

            <div class="stats-row" v-if="business.views || business.likes">
              <div class="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{{ business.views || 0 }} views</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span>{{ business.likes || 0 }} likes</span>
              </div>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div class="card">
            <h2>About</h2>
            <p class="about-text">
              {{ business.description || "No description available." }}
            </p>
          </div>

          <!-- MAP -->
          <div v-if="business.lat && business.lng" class="card">
            <h2>Location</h2>
            <div id="business-map"></div>
          </div>
        </div>

        <!-- SIDEBAR -->
        <aside class="side-col">
          <div class="card contact-card">
            <h2>Contact</h2>
            <a
              v-if="business.phone"
              :href="`tel:${business.phone}`"
              class="contact-btn primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Business
            </a>
            <a
              v-if="business.address"
              :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address + ', ' + business.city)}`"
              target="_blank"
              rel="noopener"
              class="contact-btn secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Get Directions
            </a>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 6.5rem 1.5rem 4rem;
  background: var(--color-bg-secondary);
  min-height: 100vh;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 50vh;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.details {
  max-width: 1100px;
  margin: 0 auto;
}

/* Hero */
.hero-image {
  position: relative;
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: var(--shadow-elevated);
}

.hero-image :deep(img) {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
}

.hero-image :deep(.business-avatar) {
  height: 420px;
}

@media (max-width: 768px) {
  .hero-image :deep(img),
  .hero-image :deep(.business-avatar) {
    height: 300px;
  }
}

@media (max-width: 640px) {
  .hero-image :deep(img),
  .hero-image :deep(.business-avatar) {
    height: 240px;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(11, 17, 33, 0.55) 100%);
  pointer-events: none;
}

.category-badge {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: var(--color-primary);
  color: var(--color-text-primary);
  padding: 0.375rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.favorite-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  color: #475569;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #fee2e2;
  color: #ef4444;
}

/* Content grid */
.content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  margin-top: 1.5rem;
  align-items: start;
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.side-col {
  position: sticky;
  top: 6rem;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-2xl);
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
}

.card h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

/* Info card */
.info-card h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
}

.location svg {
  flex-shrink: 0;
  color: var(--color-primary);
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border-light);
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.stat svg {
  color: var(--color-primary);
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 16px;
  background: var(--color-border);
}

.about-text {
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0;
  font-size: 0.9375rem;
}

/* Map */
#business-map {
  height: 320px;
  width: 100%;
  border-radius: var(--radius-xl);
  z-index: 1;
}

/* Contact sidebar */
.contact-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all var(--transition-base);
}

.contact-btn.primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
}

.contact-btn.primary:hover {
  box-shadow: 0 8px 24px -6px var(--color-primary-glow);
  transform: translateY(-2px);
}

.contact-btn.secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.contact-btn.secondary:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }

  .side-col {
    position: static;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 5.5rem 1rem 3rem;
  }

  .card {
    padding: 1.25rem;
  }

  .stats-row {
    flex-wrap: wrap;
  }
}
</style>

<style>
/* Dark mode - global */
:root.dark .page {
  background: var(--color-dark-bg);
}

:root.dark .card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .location {
  color: var(--color-text-secondary);
}

:root.dark .favorite-btn {
  background: var(--color-dark-surface);
  color: var(--color-text-secondary);
}

:root.dark .favorite-btn.active {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

:root.dark .stats-row {
  border-top-color: var(--color-dark-border);
}

:root.dark .stat {
  color: var(--color-text-secondary);
}

:root.dark .stat-divider {
  background: var(--color-dark-border);
}

:root.dark .about-text {
  color: var(--color-text-secondary);
}

:root.dark .contact-btn.secondary {
  border-color: var(--color-dark-border);
}

:root.dark .contact-btn.secondary:hover {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-dark-border-hover);
}
</style>
