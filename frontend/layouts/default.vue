<template>
  <div class="app-shell">
    <Navbar />
    <Transition name="page" mode="out-in">
      <slot />
    </Transition>
    <Footer />
    <AppToast />

    <Transition name="fade-up">
      <button
        v-if="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue"
import { useTheme } from "~/composables/useTheme"

const { loadTheme } = useTheme()
const route = useRoute()
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

watch(
  () => route.fullPath,
  () => {
    window.scrollTo(0, 0)
  }
)

onMounted(() => {
  loadTheme()
  window.addEventListener("scroll", handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-shell > :not(nav):not(footer) {
  flex: 1;
}

.back-to-top {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 9997;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px -6px var(--color-primary-glow);
  transition: all var(--transition-base);
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -6px var(--color-primary-glow);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 250ms ease, transform 250ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
