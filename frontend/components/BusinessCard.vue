<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  business: {
    type: Object,
    required: true
  }
})

const categoryName = computed(() => {
  if (typeof props.business.category === "object" && props.business.category) {
    return props.business.category.name
  }
  return props.business.category || "Business"
})

const truncateText = (text: string, length: number) => {
  if (!text) return ""
  return text.length > length ? text.substring(0, length) + "..." : text
}

const formatCount = (count: number) => {
  const n = Number(count) || 0
  if (n >= 1000) {
    return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K"
  }
  return String(n)
}
</script>

<template>
  <div class="business-card">
    <NuxtLink :to="`/market/${business.id}`" class="card-link">
      <div class="image-wrapper">
        <BusinessImage :business="business" :alt="business.name" />
        <div class="image-overlay"></div>
        <span class="category-badge">{{ categoryName }}</span>
      </div>

      <div class="content">
        <h3>{{ business.name }}</h3>

        <div class="info-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{{ business.address || "No Address" }}, {{ business.city || "Ethiopia" }}</span>
        </div>

        <p class="description" v-if="business.description">
          {{ truncateText(business.description, 100) }}
        </p>

        <div class="stats-row" v-if="business.views || business.likes">
          <span class="stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {{ formatCount(business.views || 0) }}
          </span>
          <span class="stat-divider"></span>
          <span class="stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {{ formatCount(business.likes || 0) }}
          </span>
        </div>

        <div class="card-footer" v-if="business.phone">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>{{ business.phone }}</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.business-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.business-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-elevated);
  border-color: var(--color-border-hover);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.image-wrapper :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.business-card:hover .image-wrapper :deep(img) {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(11, 17, 33, 0.4) 100%);
  pointer-events: none;
}

.category-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--color-primary);
  color: var(--color-text-primary);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.content {
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
}

.content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.4;
  font-family: var(--font-heading);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
}

.info-row svg {
  flex-shrink: 0;
  color: var(--color-primary);
  opacity: 0.7;
}

.description {
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: 1.5;
  flex-grow: 1;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.stat svg {
  color: var(--color-primary);
  opacity: 0.85;
}

.stat-divider {
  width: 3px;
  height: 3px;
  border-radius: var(--radius-full);
  background: var(--color-text-tertiary);
  opacity: 0.5;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-light);
}
</style>

<style>
:root.dark .business-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .business-card:hover {
  border-color: var(--color-dark-border-hover);
}

:root.dark .image-wrapper {
  background: var(--color-dark-bg-tertiary);
}

:root.dark .card-footer {
  border-color: var(--color-dark-border);
}
</style>
