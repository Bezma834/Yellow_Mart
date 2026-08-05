<script setup lang="ts">

import { ref, watch, onMounted, computed } from "vue"

import { SEARCH_BUSINESSES } from "~/graphql/queries"

import BusinessCard from "~/components/BusinessCard.vue"



const route = useRoute()

const { $apollo } = useNuxtApp() as any



const search = ref(
  (route.query.q as string) || ""
)



const businesses = ref<any[]>([])

const loading = ref(false)



const sortType = ref("latest")





const searchBusinesses = async () => {

  if (!search.value) {

    businesses.value = []

    return

  }

  loading.value = true

  try {

    const result = await $apollo.query({

      query: SEARCH_BUSINESSES,

      variables: {

        search: `%${search.value}%`

      },

      fetchPolicy: "network-only"

    })

    businesses.value = result.data.businesses || []

  } catch (error) {

    console.error("SEARCH ERROR", error)

  } finally {

    loading.value = false

  }

}

const sortedBusinesses = computed(() => {

  const data = [...businesses.value]

  if (sortType.value === "popular") {

    return data.sort((a, b) => Number(b.views || 0) - Number(a.views || 0))

  }

  if (sortType.value === "name") {

    return data.sort((a, b) => a.name.localeCompare(b.name))

  }

  return data

})



watch(search, () => {

  searchBusinesses()

})



watch(sortType, (value) => {

  console.log("SORT CHANGED:", value)

})



onMounted(() => {

  searchBusinesses()

})

</script>

<template>
  <div class="search-page">
    <!-- HEADER -->
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Search</span>
        <h1>Search Businesses</h1>
        <p>Find shops, restaurants and services near you</p>

        <div class="search-wrapper">
          <div class="search-box-wrap">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="search"
              placeholder="Search business name or location..."
              class="search-box"
            />
            <button v-if="search" class="clear-btn" @click="search = ''" aria-label="Clear search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- RESULTS -->
    <section class="results">
      <div class="container">
        <div class="toolbar">
          <h2>
            {{ search ? `Results for "${search}"` : "All Businesses" }}
            <span class="count" v-if="sortedBusinesses.length">({{ sortedBusinesses.length }})</span>
          </h2>

          <div class="filters">
            <button
              :class="{ active: sortType === 'latest' }"
              @click="sortType = 'latest'"
            >
              Latest
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
              :class="{ active: sortType === 'name' }"
              @click="sortType = 'name'"
            >
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
        <div v-else-if="sortedBusinesses.length" class="grid">
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
          <p>Try another keyword or browse all categories</p>
          <NuxtLink to="/" class="btn btn-secondary">Back to Home</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Search wrapper */
.search-wrapper {
  margin-top: 2rem;
}

.search-box-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 650px;
  margin: 0 auto;
  padding: 0.375rem 0.5rem 0.375rem 1.125rem;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-elevated);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.search-box-wrap:focus-within {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25), var(--shadow-lg);
  transform: scale(1.01);
}

.search-icon {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
}

.search-box {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.875rem 0;
  font-size: 1rem;
  color: var(--color-text-primary);
  min-width: 0;
}

.search-box::placeholder {
  color: var(--color-text-tertiary);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.clear-btn:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

/* Results */
.results {
  padding: 3rem 0 5rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.toolbar h2 {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.count {
  color: var(--color-text-tertiary);
  font-weight: 500;
  font-size: 0.9375rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
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
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8125rem;
  font-family: inherit;
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
.grid {
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
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
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
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }

  .filters button {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Dark mode - global */
:root.dark .search-page {
  background: var(--color-dark-bg);
}

:root.dark .search-box-wrap {
  background: var(--color-dark-surface);
}

:root.dark .search-box {
  color: var(--color-text-primary);
}

:root.dark .clear-btn {
  background: var(--color-dark-bg-tertiary);
}

:root.dark .clear-btn:hover {
  background: var(--color-dark-border);
}

:root.dark .toolbar h2 {
  color: var(--color-text-primary);
}

:root.dark .filters button {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
  color: var(--color-text-secondary);
}

:root.dark .filters button:hover {
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

:root.dark .filters button.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-color: transparent;
  color: var(--color-text-inverse);
  box-shadow: 0 4px 16px -4px var(--color-primary-glow);
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
