<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

import { ref, onMounted, computed } from "vue"
import { useAdminApi } from "~/composables/useAdminApi"

const { getStats, loading } = useAdminApi()

const stats = ref({
  businesses: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  users: 0,
  categories: 0,
  featured: 0
})

const error = ref("")

const loadStats = async () => {
  error.value = ""
  try {
    stats.value = await getStats()
  } catch (err: any) {
    error.value = err.message || "Could not load stats"
    console.error("ADMIN STATS ERROR:", err)
  }
}

onMounted(loadStats)

const kpis = computed(() => [
  {
    label: "Total Businesses",
    value: stats.value.businesses,
    icon: "store",
    tone: "primary"
  },
  {
    label: "Pending Review",
    value: stats.value.pending,
    icon: "clock",
    tone: "pending"
  },
  {
    label: "Approved",
    value: stats.value.approved,
    icon: "check",
    tone: "approved"
  },
  {
    label: "Rejected",
    value: stats.value.rejected,
    icon: "x",
    tone: "rejected"
  },
  {
    label: "Registered Users",
    value: stats.value.users,
    icon: "users",
    tone: "primary"
  },
  {
    label: "Categories",
    value: stats.value.categories,
    icon: "folder",
    tone: "primary"
  }
])

const iconPaths: Record<string, string> = {
  store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  x: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'
}
</script>

<template>
  <div class="dashboard">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Overview of the Yellow-Mart marketplace</p>
      </div>
      <button class="refresh-btn" @click="loadStats" :disabled="loading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ spinning: loading }">
          <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- ERROR BANNER -->
    <div v-if="error" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {{ error }}
      <button @click="loadStats">Retry</button>
    </div>

    <!-- KPI CARDS -->
    <div v-if="loading && !stats.businesses" class="kpi-grid">
      <div v-for="i in 6" :key="i" class="kpi-card skeleton">
        <div class="skeleton-icon"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>

    <div v-else class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card" :class="`tone-${kpi.tone}`">
        <div class="kpi-icon" v-html="iconPaths[kpi.icon] ? `<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>${iconPaths[kpi.icon]}</svg>` : ''"></div>
        <div class="kpi-meta">
          <span class="kpi-value">{{ kpi.value }}</span>
          <span class="kpi-label">{{ kpi.label }}</span>
        </div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <div class="quick-section">
      <h2>Quick Actions</h2>
      <div class="action-grid">
        <button class="action-card" @click="navigateTo('/admin/businesses')">
          <span class="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
          </span>
          <span class="action-title">Review Businesses</span>
          <span class="action-sub">{{ stats.pending }} awaiting approval</span>
        </button>

        <button class="action-card" @click="navigateTo('/admin/categories')">
          <span class="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </span>
          <span class="action-title">Manage Categories</span>
          <span class="action-sub">{{ stats.categories }} categories</span>
        </button>

        <button class="action-card" @click="navigateTo('/admin/users')">
          <span class="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="action-title">Manage Users</span>
          <span class="action-sub">{{ stats.users }} registered users</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.page-header p {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  font-weight: 500;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.error-banner button {
  margin-left: auto;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}

.error-banner button:hover {
  background: rgba(239, 68, 68, 0.18);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.kpi-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary);
}

.tone-pending .kpi-icon {
  background: rgba(250, 204, 21, 0.15);
  color: #d97706;
}

.tone-approved .kpi-icon {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.tone-rejected .kpi-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.kpi-meta {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 34px;
  font-weight: 900;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.tone-pending .kpi-value {
  color: #d97706;
}

.tone-approved .kpi-value {
  color: #16a34a;
}

.tone-rejected .kpi-value {
  color: #ef4444;
}

.kpi-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.quick-section h2 {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 24px;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.action-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 10px 24px rgba(245, 158, 11, 0.12);
  transform: translateY(-3px);
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.action-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text-primary);
}

.action-sub {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.skeleton {
  min-height: 92px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: var(--color-bg-tertiary);
  flex-shrink: 0;
}

.skeleton-line {
  height: 16px;
  width: 70px;
  border-radius: 6px;
  background: var(--color-bg-tertiary);
}

.skeleton-line.short {
  width: 110px;
  height: 12px;
  margin-top: 6px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
