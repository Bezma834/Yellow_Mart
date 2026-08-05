<template>
  <Teleport to="body">
    <div class="toast-viewport" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
          role="status"
        >
          <span class="toast-icon">
            <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-close"
            :aria-label="'Dismiss notification'"
            @click="removeToast(toast.id)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast"

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-viewport {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  max-width: min(380px, calc(100vw - 2rem));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.8125rem 0.875rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast.success .toast-icon {
  color: #16a34a;
}

.toast.error .toast-icon {
  color: #dc2626;
}

.toast.info .toast-icon {
  color: var(--color-primary-hover);
}

.toast-message {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.45;
  color: var(--color-text-primary);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--radius-lg);
  background: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toast-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 220ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.toast-move {
  transition: transform 220ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none;
  }
}

@media (max-width: 480px) {
  .toast-viewport {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>

<style>
:root.dark .toast {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .toast-message {
  color: var(--color-text-primary);
}

:root.dark .toast-close {
  color: var(--color-text-secondary);
}

:root.dark .toast-close:hover {
  background: var(--color-dark-bg-tertiary);
}
</style>
