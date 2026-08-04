<script setup lang="ts">

import { ref, computed, onMounted } from "vue"

import BusinessCard from "~/components/BusinessCard.vue"

import { GET_BUSINESSES_BY_CATEGORY } from "~/graphql/queries"


const route = useRoute()

const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])

const loading = ref(true)

const categoryName = ref("")

const sortType = ref("featured")



const loadCategoryBusinesses = async () => {

  try {

    const result = await $apollo.query({

      query: GET_BUSINESSES_BY_CATEGORY,

      variables: {

        category_id: String(route.params.id)

      },

      fetchPolicy: "network-only"

    })

    businesses.value = result.data.businesses || []

    if (businesses.value.length) {

      categoryName.value = businesses.value[0].category?.name || "Businesses"

    }

  } catch (error) {

    console.error("CATEGORY ERROR:", error)

  } finally {

    loading.value = false

  }

}

const sortedBusinesses = computed(() => {

  const data = [...businesses.value]

  if (sortType.value === "popular") {

    return data.sort((a, b) => (b.views || 0) - (a.views || 0))

  }

  if (sortType.value === "a-z") {

    return data.sort((a, b) => a.name.localeCompare(b.name))

  }

  return data

})

onMounted(() => {

  loadCategoryBusinesses()

})

</script>

<template>
  <section class="category-page">
    <div class="container">
      <!-- HEADER -->
      <div class="category-header">
        <span class="eyebrow">Category</span>
        <h1>{{ categoryName || "Businesses" }}</h1>
        <p>Discover the best {{ categoryName || "businesses" }} near you</p>
      </div>

      <!-- TOOLBAR -->
      <div class="toolbar">
        <h2>
          {{ businesses.length }} Business{{ businesses.length === 1 ? "" : "es" }} Found
        </h2>

        <div class="filters">
          <button
            :class="{ active: sortType === 'featured' }"
            @click="sortType = 'featured'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Featured
          </button>
          <button
            :class="{ active: sortType === 'popular' }"
            @click="sortType = 'popular'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            Popular
          </button>
          <button
            :class="{ active: sortType === 'a-z' }"
            @click="sortType = 'a-z'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
            A-Z
          </button>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="loading">
        <div class="loader"></div>
        <p>Loading businesses...</p>
      </div>

      <!-- GRID -->
      <div v-else-if="sortedBusinesses.length" class="business-grid">
        <BusinessCard
          v-for="business in sortedBusinesses"
          :key="business.id"
          :business="business"
        />
      </div>

      <!-- EMPTY -->
      <div v-else class="empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <h3>No businesses found</h3>
        <p>Try another category</p>
        <NuxtLink to="/" class="btn btn-secondary">Browse All Categories</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 6.5rem 1.5rem 5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.category-header {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 60% 100% at 50% -20%, var(--color-primary-light) 0%, transparent 60%),
    var(--color-surface);
  border: 1px solid var(--color-border-light);
  padding: 3.5rem 2rem;
  border-radius: var(--radius-3xl);
  text-align: center;
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.category-header h1 {
  font-size: clamp(1.875rem, 4vw, 2.75rem);
  font-weight: 800;
  margin: 0.75rem 0 0.625rem;
  letter-spacing: -0.02em;
}

.category-header p {
  color: var(--color-text-secondary);
  font-size: 1.0625rem;
  margin: 0;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.toolbar h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filters button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.125rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filters button:hover {
  border-color: var(--color-primary);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.filters button.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-color: transparent;
  color: var(--color-text-primary);
  box-shadow: 0 4px 16px -4px var(--color-primary-glow);
}

/* Grid */
.business-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.loader {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  padding: 4.5rem 1.5rem;
  border-radius: var(--radius-3xl);
  text-align: center;
}

.empty svg {
  color: var(--color-text-tertiary);
  margin-bottom: 0.5rem;
}

.empty h3 {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
}

.empty p {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin: 0 0 1rem 0;
}

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
  .category-page {
    padding: 5.5rem 1rem 4rem;
  }

  .category-header {
    padding: 2.5rem 1.25rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    flex-wrap: nowrap;
  }

  .filters button {
    white-space: nowrap;
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
:root.dark .category-page {
  background: var(--color-dark-bg);
}

:root.dark .category-header {
  background:
    radial-gradient(ellipse 60% 100% at 50% -20%, rgba(245, 158, 11, 0.15) 0%, transparent 60%),
    var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .toolbar h2 {
  color: var(--color-text-primary);
}

:root.dark .filters button {
  background: var(--color-dark-surface);
  color: var(--color-text-secondary);
  border-color: var(--color-dark-border);
}

:root.dark .filters button:hover {
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

:root.dark .loader {
  border-color: var(--color-dark-border);
  border-top-color: var(--color-primary);
}

:root.dark .empty {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
</style>
