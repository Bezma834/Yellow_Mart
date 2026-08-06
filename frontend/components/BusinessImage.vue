<script setup lang="ts">
import { computed, ref, watch } from "vue"

const props = defineProps({
  business: {
    type: Object,
    required: true
  },
  alt: {
    type: String,
    default: ""
  }
})

const imgFailed = ref(false)

const isBlobUrl = (url: string) => url.startsWith("blob:")

const initials = computed(() => {
  const name = props.business?.name || ""
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "B"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
})

const showImage = computed(() => {
  const b = props.business as any
  const url = b?.image || b?.image_url
  return Boolean(url) && !isBlobUrl(url) && !imgFailed.value
})

watch(
  () => props.business,
  () => {
    imgFailed.value = false
  },
  { deep: true }
)

const onImgError = () => {
  imgFailed.value = true
}
</script>

<template>
  <img
    v-if="showImage"
    :src="business.image || business.image_url"
    :alt="alt || business.name"
    loading="lazy"
    @error="onImgError"
  />
  <div
    v-else
    class="business-avatar"
    :aria-label="`${business.name || 'Business'} has no photo`"
  >
    <div class="avatar-monogram">
      <span class="avatar-initials">{{ initials }}</span>
    </div>
    <span class="avatar-caption">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 9l1.5-5h15L21 9"/>
        <path d="M5 9v11h14V9"/>
        <path d="M9 20v-6h6v6"/>
      </svg>
      No photo
    </span>
  </div>
</template>

<style scoped>
.business-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background:
    radial-gradient(ellipse 70% 60% at 50% 35%, rgba(245, 158, 11, 0.1), transparent 70%),
    var(--color-bg-tertiary);
}

.avatar-monogram {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42%;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-inverse);
  box-shadow: 0 10px 24px -8px var(--color-primary-glow);
}

.avatar-initials {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(1.125rem, 2.4vw, 2.5rem);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: 1;
}

.avatar-caption {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}
</style>

<style>
:root.dark .business-avatar {
  background:
    radial-gradient(ellipse 70% 60% at 50% 35%, rgba(245, 158, 11, 0.12), transparent 70%),
    var(--color-dark-bg-tertiary);
}

:root.dark .avatar-caption {
  color: var(--color-text-secondary);
}
</style>
