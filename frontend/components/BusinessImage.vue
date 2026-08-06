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

const hasImage = computed(() => {
  const b = props.business as any
  return Boolean(b?.image || b?.image_url)
})

// blob: URLs only exist in the browser session where the file was uploaded -
// they break everywhere else, so treat them as "no photo".
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
    <span class="avatar-initials">{{ initials }}</span>
    <span class="avatar-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 9l1.5-5h15L21 9"/>
        <path d="M5 9v11h14V9"/>
        <path d="M9 20v-6h6v6"/>
      </svg>
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
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary), #d97706);
  color: var(--color-dark-bg);
}

.avatar-initials {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
}

.avatar-icon {
  display: flex;
  opacity: 0.75;
}

.avatar-icon svg {
  display: block;
}
</style>
