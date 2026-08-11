<template>
  <div class="page">
    <div class="container">
      <div class="page-hero">
        <span class="eyebrow">Directory</span>
        <h1>All Businesses</h1>
        <p>Browse every business listed on Yellow Mart</p>

        <div class="search-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Search by name or city..."
          />
          <button v-if="search" class="clear-search" @click="search = ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="toolbar">
        <span class="count">{{ filteredBusinesses.length }} business{{ filteredBusinesses.length === 1 ? "" : "es" }} found</span>
      </div>

      <div v-if="filteredBusinesses.length" class="grid">
        <BusinessCard
          v-for="business in filteredBusinesses"
          :key="business.id"
          :business="business"
        />
      </div>

      <div v-else class="empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <h3>No businesses found</h3>
        <p>Try a different search term or city</p>
        <button class="btn btn-secondary" @click="search = ''">Clear Search</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref, computed } from "vue"

import BusinessCard from "~/components/BusinessCard.vue"

import { GET_ALL_BUSINESSES } from "~/graphql/queries"


const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])

const search = ref("")

const loading = ref(true)


const loadBusinesses = async () => {

  try {

    const { data } = await $apollo.query({

      query: GET_ALL_BUSINESSES,

      fetchPolicy: "network-only"

    })

    businesses.value = data.businesses || []

  } catch (error) {

    console.error("FAILED TO LOAD BUSINESSES:", error)

  } finally {

    loading.value = false

  }

}

loadBusinesses()


const filteredBusinesses = computed(() => {

  const query = search.value.toLowerCase().trim()

  if (!query) return businesses.value

  return businesses.value.filter((biz) => {

    return (
      biz.name?.toLowerCase().includes(query) ||
      biz.city?.toLowerCase().includes(query) ||
      biz.category?.name?.toLowerCase().includes(query)
    )
  })
})

</script>




<style scoped>

.page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 6.5rem 1.5rem 5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-hero .eyebrow {
  color: var(--color-primary-hover);
}

.page-hero h1 {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.page-hero p {
  color: var(--color-text-tertiary);
  font-size: 18px;
  margin: 0 0 1.75rem;
}

.search-wrap {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.search-wrap > svg {
  position: absolute;
  left: 1.125rem;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-wrap input {
  width: 100%;
  padding: 0.875rem 2.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-xs);
}

.search-wrap input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-glow);
}

.search-wrap input::placeholder {
  color: var(--color-text-tertiary);
}

.clear-search {
  position: absolute;
  right: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.clear-search:hover {
  background: var(--color-border);
}

.toolbar {
  margin-bottom: 1.5rem;
  padding: 0 0.25rem;
}

.count {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

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
  .page {
    padding: 5.5rem 1rem 4rem;
  }

  .page-hero {
    margin-bottom: 2rem;
  }

  .page-hero h1 {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

</style>

<style>
:root.dark .page {
  background: var(--color-dark-bg);
}

:root.dark .page-hero p {
  color: var(--color-text-secondary);
}

:root.dark .search-wrap input {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
  color: var(--color-text-primary);
}

:root.dark .search-wrap input:focus {
  border-color: var(--color-primary);
}

:root.dark .count {
  color: var(--color-text-secondary);
}

:root.dark .empty {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
</style>
