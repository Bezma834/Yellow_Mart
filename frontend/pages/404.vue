<script setup lang="ts">
definePageMeta({
  layout: "default" as const
})
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-code">
        <span class="digit">4</span>
        <span class="zero">0</span>
        <span class="digit">4</span>
      </div>

      <h1 class="error-title">Page Not Found</h1>

      <p class="error-desc">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div class="error-actions">
        <NuxtLink to="/" class="btn btn-primary">
          ← Back to Home
        </NuxtLink>
        <NuxtLink to="/businesses" class="btn btn-secondary">
          Browse Businesses
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--color-bg-secondary);
}

.error-card {
  text-align: center;
  max-width: 520px;
  padding: 60px 48px;
  background: var(--color-surface);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-elevated);
  animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 16px;
  font-family: var(--font-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.digit {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bounce 2s ease-in-out infinite;
}

.zero {
  background: linear-gradient(135deg, var(--color-secondary) 0%, #14b8a6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bounce 2s ease-in-out infinite 0.3s;
  font-size: 140px;
}

.error-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.error-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 36px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 15px;
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  box-shadow: var(--shadow-glow), var(--shadow-lg);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-lighter);
  transform: translateY(-2px);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* Responsive */
@media (max-width: 480px) {
  .error-card {
    padding: 40px 24px;
  }
  .error-code {
    font-size: 80px;
  }
  .zero {
    font-size: 96px;
  }
  .error-title {
    font-size: 22px;
  }
  .error-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn {
    justify-content: center;
  }
}
</style>

<style>
:root.dark .error-page {
  background: var(--color-dark-bg);
}
:root.dark .error-card {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
}
:root.dark .error-title {
  color: var(--color-text-primary);
}
:root.dark .error-desc {
  color: var(--color-text-secondary);
}
:root.dark .btn-secondary {
  color: var(--color-text-primary);
  border-color: var(--color-dark-border);
}
:root.dark .btn-secondary:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: var(--color-primary);
}
</style>
