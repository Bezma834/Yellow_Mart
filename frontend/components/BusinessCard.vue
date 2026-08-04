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
</script>

<template>
  <div class="business-card">
    <NuxtLink :to="`/market/${business.id}`" class="card-link">
      <div class="image-wrapper">
        <img
          :src="
            business.image_url ||
            business.image ||
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600'
          "
          :alt="business.name"
          loading="lazy"
        />
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

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.business-card:hover .image-wrapper img {
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
