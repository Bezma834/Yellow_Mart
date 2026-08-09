<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

import { ref, onMounted } from "vue"
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

const loadReports = async () => {
  error.value = ""
  try {
    stats.value = await getStats()
  } catch (err: any) {
    error.value = err.message || "Could not load reports"
    console.error(err)
  }
}

const approvalRate = () => {
  if (!stats.value.businesses) return 0
  return Math.round((stats.value.approved / stats.value.businesses) * 100)
}

const rows = [
  {
    label: "Total businesses",
    value: () => stats.value.businesses,
    tone: "primary"
  },
  {
    label: "Approved",
    value: () => stats.value.approved,
    tone: "approved"
  },
  {
    label: "Pending review",
    value: () => stats.value.pending,
    tone: "pending"
  },
  {
    label: "Rejected",
    value: () => stats.value.rejected,
    tone: "rejected"
  },
  {
    label: "Featured listings",
    value: () => stats.value.featured,
    tone: "primary"
  },
  {
    label: "Registered users",
    value: () => stats.value.users,
    tone: "primary"
  },
  {
    label: "Categories",
    value: () => stats.value.categories,
    tone: "primary"
  }
]

onMounted(loadReports)
</script>

<template>
  <div class="reports-page">
    <div class="page-header">
      <div>
        <h1>Reports</h1>
        <p>Marketplace performance at a glance</p>
      </div>
      <button class="refresh-btn" @click="loadReports" :disabled="loading">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
      <button @click="loadReports">Retry</button>
    </div>

    <!-- SUMMARY HERO -->
    <div class="summary-hero">
      <div class="hero-main">
        <span class="hero-label">Total Businesses</span>
        <span class="hero-value">{{ loading ? "…" : stats.businesses }}</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-main">
        <span class="hero-label">Approval Rate</span>
        <span class="hero-value">{{ loading ? "…" : `${approvalRate()}%` }}</span>
      </div>
    </div>

    <!-- TABLE -->
    <div v-if="loading" class="table-card">
      <div v-for="i in 6" :key="i" class="row-skeleton">
        <div class="sk-line w40"></div>
        <div class="sk-line w20"></div>
      </div>
    </div>

    <div v-else class="table-card">
      <div class="table">
        <div class="table-row head">
          <span>Metric</span>
          <span>Count</span>
        </div>
        <div v-for="row in rows" :key="row.label" class="table-row">
          <span class="metric-label">{{ row.label }}</span>
          <span class="metric-value" :class="`tone-${row.tone}`">{{ row.value() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  color: var(--color-text-primary);
}

.page-header p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
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

.summary-hero {
  display: flex;
  align-items: center;
  gap: 30px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  padding: 30px 36px;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(245, 158, 11, 0.2);
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-label {
  font-size: 13px;
  font-weight: 700;
  opacity: 0.8;
  color: var(--color-text-inverse);
}

.hero-value {
  font-size: 38px;
  font-weight: 900;
  color: var(--color-text-inverse);
  line-height: 1.1;
}

.hero-divider {
  width: 1px;
  height: 52px;
  background: rgba(255, 255, 255, 0.35);
}

.table-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
}

.table-row:not(.head) {
  border-top: 1px solid var(--color-border-light);
}

.table-row.head {
  background: var(--color-bg-tertiary);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-secondary);
}

.metric-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.metric-value {
  font-size: 20px;
  font-weight: 900;
  text-align: right;
}

.tone-primary {
  color: var(--color-primary-dark);
}

.tone-approved {
  color: #16a34a;
}

.tone-pending {
  color: #d97706;
}

.tone-rejected {
  color: #ef4444;
}

.row-skeleton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border-light);
  animation: pulse 1.4s ease-in-out infinite;
}

.sk-line {
  height: 12px;
  border-radius: 6px;
  background: var(--color-bg-tertiary);
}

.w40 { width: 40%; }
.w20 { width: 20%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@media (max-width: 560px) {
  .summary-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .hero-divider {
    width: 100%;
    height: 1px;
  }
}
</style>
