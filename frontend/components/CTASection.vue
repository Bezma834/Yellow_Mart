<template>
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2>List Your Business on Yellow Mart</h2>
        <p>Join thousands of businesses across Ethiopia and reach more customers</p>
        <div class="cta-buttons">
          <NuxtLink to="/add-business" class="cta-btn primary">
            Get Started — It's Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </NuxtLink>
          <NuxtLink to="/about" class="cta-btn secondary">
            Learn More
          </NuxtLink>
        </div>
        <div class="cta-features">
          <div class="feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Free to list</span>
          </div>
          <div class="feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Reach 100K+ users</span>
          </div>
          <div class="feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Boost visibility</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  position: relative;
  padding: 5rem 0;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-bg-warm) 100%);
  transition: background var(--transition-slow);
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-family: var(--font-heading);
}

.cta-content p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin: 0 0 2rem 0;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.cta-btn.primary {
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-dark-bg-tertiary) 100%);
  color: var(--color-text-inverse);
}

.cta-btn.primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.2);
}

.cta-btn.secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.cta-btn.secondary:hover {
  background: var(--color-surface);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.feature svg {
  color: var(--color-primary);
  opacity: 0.8;
}

@media (max-width: 640px) {
  .cta-content h2 {
    font-size: 1.75rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-features {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>

<style>
:root.dark .cta-section {
  background: linear-gradient(135deg, var(--color-dark-bg-secondary) 0%, var(--color-dark-bg) 100%);
}

:root.dark .cta-btn.primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
}

:root.dark .cta-btn.primary:hover {
  box-shadow: 0 0 24px var(--color-primary-glow);
}

:root.dark .cta-btn.secondary {
  color: var(--color-text-primary);
  border-color: var(--color-dark-border);
}

:root.dark .cta-btn.secondary:hover {
  background: var(--color-dark-bg-tertiary);
  border-color: var(--color-dark-border-hover);
}
</style>
