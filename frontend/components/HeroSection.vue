<template>
  <section class="hero">
    <!-- Background Video -->
    <video
      ref="heroVideo"
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source src="/videos/hero-loop-small.mp4" type="video/mp4">
    </video>

    <!-- Gradient Overlay -->
    <div class="hero-overlay"></div>

    <!-- Content -->
    <div class="hero-content">
      <div class="hero-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Ethiopia's #1 Business Directory
      </div>

      <h1 class="hero-title">
        Find the Best
        <span class="highlight">Businesses</span>
        Across Ethiopia
      </h1>

      <p class="hero-subtitle">
        Discover restaurants, shops, services, and local businesses near you. Connect with the best providers in your area.
      </p>

      <!-- SEARCH BAR -->
      <div class="hero-search-wrapper">
        <div class="hero-search">
          <div class="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="What are you looking for? (e.g., Tomoca, Edna Mall...)"
            @keyup.enter="handleSearch()"
            @blur="setTimeout(() => showSuggestions = false, 200)"
            @focus="searchQuery.trim() && suggestions.length && (showSuggestions = true)"
          />
          <button @click="handleSearch()">
            Search
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        <!-- Live Suggestions -->
        <div v-if="showSuggestions" class="hero-suggestions">
          <div
            v-for="biz in suggestions.slice(0, 6)"
            :key="biz.id"
            class="hero-suggestion-item"
            @mousedown.prevent="goToBusiness(biz.id)"
          >
            <div class="suggestion-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div class="suggestion-info">
              <span class="suggestion-name">{{ biz.name }}</span>
              <span class="suggestion-meta">{{ biz.city }}{{ biz.category?.name ? ` · ${biz.category.name}` : '' }}</span>
            </div>
          </div>
          <div class="hero-suggestion-footer" @mousedown.prevent="handleSearch()">
            See all results for "{{ searchQuery }}"
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">10K+</span>
          <span class="stat-label">Businesses</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">50+</span>
          <span class="stat-label">Categories</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">100K+</span>
          <span class="stat-label">Users</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { SEARCH_BUSINESSES } from "~/graphql/queries"

const router = useRouter()
const { $apollo } = useNuxtApp() as any

const searchQuery = ref("")
const heroVideo = ref<HTMLVideoElement | null>(null)
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const handleSearch = (q?: string) => {
  const query = (q || searchQuery.value).trim()
  if (query) {
    showSuggestions.value = false
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }
}

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  if (!val.trim()) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  debounceTimer = setTimeout(async () => {
    try {
      const result = await $apollo.query({
        query: SEARCH_BUSINESSES,
        variables: { search: `%${val.trim()}%` },
        fetchPolicy: "network-only"
      })
      suggestions.value = result.data.businesses || []
      showSuggestions.value = suggestions.value.length > 0
    } catch (err) {
      console.error("Live search error:", err)
      suggestions.value = []
    }
  }, 300)
})

const goToBusiness = (id: string) => {
  showSuggestions.value = false
  router.push(`/business/${id}`)
}

onMounted(async () => {
  if (heroVideo.value) {
    heroVideo.value.playbackRate = 1.2
    try {
      await heroVideo.value.play()
    } catch (error) {
      console.log("Video play failed", error)
    }
  }
})
</script>

<style scoped>
.hero {
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-top: 72px;
}

/* Background Video */
.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Gradient Overlay — premium dark with subtle amber edges */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(11, 17, 33, 0.7) 0%,
    rgba(11, 17, 33, 0.35) 40%,
    rgba(11, 17, 33, 0.45) 60%,
    rgba(11, 17, 33, 0.75) 100%
  );
  z-index: 1;
}

.hero-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* Content */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 1.5rem;
  animation: heroFadeIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes heroFadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.5rem;
  animation: heroFadeIn 1s 0.15s both;
}

/* Title */
.hero-title {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  font-family: var(--font-heading);
  animation: heroFadeIn 1s 0.3s both;
}

.highlight {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtitle */
.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: heroFadeIn 1s 0.45s both;
}

/* Search Bar — Glassmorphic */
.hero-search-wrapper {
  position: relative;
  margin-bottom: 3rem;
  animation: heroFadeIn 1s 0.6s both;
}

.hero-search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-radius: 1.75rem;
  padding: 0.5rem;
  box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.hero-search:focus-within {
  box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(245, 158, 11, 0.3);
  transform: scale(1.01);
}

/* Live Suggestions */
.hero-suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 20px 50px -8px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 100;
  text-align: left;
  animation: suggestionsSlideIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transform-origin: top center;
}

@keyframes suggestionsSlideIn {
  from { opacity: 0; transform: translateY(-8px) scaleY(0.96); }
  to { opacity: 1; transform: translateY(0) scaleY(1); }
}

.hero-suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--color-text-primary);
  border-left: 3px solid transparent;
}

.hero-suggestion-item:hover {
  background: var(--color-primary-light);
  border-left-color: var(--color-primary);
  padding-left: 21px;
}

.hero-suggestion-item:active {
  background: #fde68a;
  transform: scale(0.99);
}

.suggestion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-bg-tertiary);
  border-radius: 10px;
  flex-shrink: 0;
  color: var(--color-text-tertiary);
  transition: all 0.15s ease;
}

.hero-suggestion-item:hover .suggestion-icon {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.suggestion-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-meta {
  font-size: 12px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-suggestion-footer {
  padding: 12px 18px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  border-top: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.15s ease;
}

.hero-suggestion-footer:hover {
  background: var(--color-primary-light);
  color: var(--color-primary-hover);
}

.hero-suggestion-footer:active {
  transform: scale(0.99);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: var(--color-text-tertiary);
}

.hero-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 1rem 0;
  font-size: 1rem;
  color: var(--color-text-primary);
  min-width: 300px;
}

.hero-search input::placeholder {
  color: var(--color-text-tertiary);
}

.hero-search button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.hero-search button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
  pointer-events: none;
}

.hero-search button:hover {
  box-shadow: 0 0 30px var(--color-primary-glow);
  transform: scale(1.03);
}

.hero-search button:active {
  transform: scale(0.98);
}

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  animation: heroFadeIn 1s 0.75s both;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

/* Mobile */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-search {
    flex-direction: column;
    padding: 0.75rem;
    gap: 0.5rem;
    border-radius: 1.25rem;
  }

  .search-icon {
    display: none;
  }

  .hero-search input {
    width: 100%;
    min-width: auto;
    padding: 0.75rem 1rem;
    background: var(--color-bg-tertiary);
    border-radius: 0.75rem;
  }

  .hero-search button {
    width: 100%;
    justify-content: center;
    padding: 0.875rem;
  }

  .hero-suggestions {
    border-radius: 1rem;
    left: 4px;
    right: 4px;
  }

  .hero-suggestion-item {
    padding: 10px 14px;
  }

  .hero-suggestion-footer {
    font-size: 13px;
    padding: 10px 14px;
  }

  .hero-stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }
}
</style>

<style>
:root.dark .hero-overlay {
  background: linear-gradient(
    180deg,
    rgba(11, 17, 33, 0.8) 0%,
    rgba(11, 17, 33, 0.4) 40%,
    rgba(11, 17, 33, 0.5) 60%,
    rgba(11, 17, 33, 0.85) 100%
  );
}

:root.dark .hero-suggestions {
  background: var(--color-dark-surface);
  box-shadow: 0 20px 50px -8px rgba(0, 0, 0, 0.5);
}

:root.dark .hero-suggestion-item {
  color: var(--color-text-primary);
}

:root.dark .hero-suggestion-item:hover {
  background: var(--color-dark-bg-tertiary);
  border-left-color: var(--color-primary);
}

:root.dark .suggestion-icon {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-tertiary);
}

:root.dark .hero-suggestion-item:hover .suggestion-icon {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

:root.dark .suggestion-name {
  color: var(--color-text-primary);
}

:root.dark .suggestion-meta {
  color: var(--color-text-tertiary);
}

:root.dark .hero-suggestion-footer {
  color: var(--color-primary);
  border-top-color: var(--color-dark-border);
}

:root.dark .hero-suggestion-footer:hover {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-primary-hover);
}
</style>
