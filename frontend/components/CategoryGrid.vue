<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { GET_CATEGORIES } from "~/graphql/queries"
import { useTheme } from "~/composables/useTheme"

const router = useRouter()
const { $apollo } = useNuxtApp() as any
const { darkMode } = useTheme()

const showAll = ref(false)
const categories = ref<any[]>([])
const loading = ref(true)

const loadCategories = async () => {
  try {
    const result = await $apollo.query({
      query: GET_CATEGORIES,
      fetchPolicy: "network-only"
    })
    categories.value = result.data.categories || []
  } catch (error) {
    console.error("CATEGORY ERROR:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})

const visibleCategories = computed(() => {
  return showAll.value ? categories.value : categories.value.slice(0, 8)
})

const toggleCategories = () => {
  showAll.value = !showAll.value
}

const openCategory = (categoryId: string) => {
  router.push(`/category/${categoryId}`)
}
</script>

<template>
  <section class="category-section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Browse by Category</span>
        <h2>Explore Categories</h2>
        <p>Discover businesses by category — from dining and hotels to healthcare and finance.</p>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="category-grid">
        <div v-for="n in 8" :key="n" class="category-card skeleton-card">
          <div class="skeleton icon-skeleton"></div>
          <div class="skeleton text-skeleton"></div>
          <div class="skeleton sub-skeleton"></div>
        </div>
      </div>

      <div v-else class="category-grid">
        <div
          v-for="category in visibleCategories"
          :key="category.id"
          class="category-card"
          @click="openCategory(category.id)"
        >
          <div class="icon-wrapper">
            <span class="icon">{{ category.icon }}</span>
          </div>
          <h3>{{ category.name }}</h3>
          <p>Discover {{ category.name }} businesses</p>
          <span class="explore-link">
            Explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>

      <div class="category-footer" v-if="categories.length > 8">
        <button class="view-more-btn" @click="toggleCategories">
          {{ showAll ? "Show Less" : "View All Categories" }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline :points="showAll ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-section {
  padding: 6rem 0;
  background: var(--color-bg-secondary);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.category-card {
  background: var(--color-surface);
  padding: 2.25rem 1.5rem;
  border-radius: var(--radius-2xl);
  cursor: pointer;
  text-align: center;
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-elevated);
  border-color: var(--color-primary);
}

.category-card:hover::before {
  transform: scaleX(1);
}

.icon-wrapper {
  width: 68px;
  height: 68px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background: var(--color-primary-light);
  transition: all var(--transition-base);
}

.category-card:hover .icon-wrapper {
  transform: scale(1.08) rotate(-4deg);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-lighter) 100%);
  box-shadow: 0 8px 20px -6px var(--color-primary-glow);
}

.icon {
  font-size: 2rem;
  line-height: 1;
}

.category-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.category-card p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-primary-dark);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.category-card:hover .explore-link {
  gap: 0.625rem;
}

.category-footer {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.view-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-more-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

/* Skeletons */
.icon-skeleton {
  width: 68px;
  height: 68px;
  border-radius: var(--radius-xl);
  margin: 0 auto 1.25rem;
}

.text-skeleton {
  height: 18px;
  width: 60%;
  margin: 0 auto 0.5rem;
}

.sub-skeleton {
  height: 14px;
  width: 75%;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .category-section {
    padding: 4rem 0;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Dark mode styles - global to work with html.dark */
:root.dark .category-section {
  background: var(--color-dark-bg);
}

:root.dark .category-section .view-more-btn {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .category-section .view-more-btn:hover {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-primary);
}

:root.dark .category-section .category-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .category-section .category-card:hover {
  border-color: var(--color-primary);
}

:root.dark .category-section .icon-wrapper {
  background: rgba(245, 158, 11, 0.15);
}

:root.dark .category-section .category-card:hover .icon-wrapper {
  background: rgba(245, 158, 11, 0.22);
  box-shadow: 0 8px 20px -6px rgba(245, 158, 11, 0.25);
}

:root.dark .category-section .explore-link {
  color: var(--color-primary);
}
</style>
