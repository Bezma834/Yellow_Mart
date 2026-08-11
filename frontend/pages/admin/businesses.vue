<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

import { ref, onMounted, onUnmounted, computed } from "vue"
import { useAdminApi } from "~/composables/useAdminApi"
import { useToast } from "~/composables/useToast"

const { getBusinesses, approveBusiness, rejectBusiness, deleteBusiness, loading } = useAdminApi()
const toast = useToast()

const businesses = ref<any[]>([])
const error = ref("")

const activeTab = ref<"pending" | "approved" | "rejected">("pending")

const tabs = [
  { key: "pending" as const, label: "Pending" },
  { key: "approved" as const, label: "Approved" },
  { key: "rejected" as const, label: "Rejected" }
]

const loadBusinesses = async () => {
  error.value = ""
  try {
    const data = await getBusinesses(activeTab.value)
    businesses.value = data.businesses || []
  } catch (err: any) {
    error.value = err.message || "Could not load businesses"
    console.error("ADMIN BUSINESS ERROR:", err)
  }
}

const switchTab = (tab: typeof activeTab.value) => {
  activeTab.value = tab
  loadBusinesses()
}

// Confirm modal state
const showConfirmModal = ref(false)
const confirmAction = ref<"reject" | "delete">("reject")
const confirmId = ref("")
const confirmName = ref("")
const processing = ref(false)

// Row action dropdown (3-dot menu) state
const menuOpenId = ref<string | null>(null)

const toggleMenu = (id: string) => {
  menuOpenId.value = menuOpenId.value === id ? null : id
}

const closeMenu = () => {
  menuOpenId.value = null
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest(".row-menu")) {
    menuOpenId.value = null
  }
}

onMounted(() => {
  loadBusinesses()
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})

const confirmCopy = {
  reject: {
    title: "Reject this business?",
    body: "The business will be marked as rejected and hidden from the market. The owner's account and their other businesses are NOT affected.",
    button: "Reject Business"
  },
  delete: {
    title: "Delete this business?",
    body: "This permanently removes the business listing. The owner's account is NOT affected.",
    button: "Delete Business"
  }
}

const approve = async (id: string) => {
  try {
    await approveBusiness(id)
    toast.success("Business approved successfully")
    loadBusinesses()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Failed to approve business")
  } finally {
    closeMenu()
  }
}

const openConfirm = (action: "reject" | "delete", id: string, name: string) => {
  confirmAction.value = action
  confirmId.value = id
  confirmName.value = name
  showConfirmModal.value = true
  closeMenu()
}

const confirmActionHandler = async () => {
  processing.value = true
  try {
    if (confirmAction.value === "delete") {
      await deleteBusiness(confirmId.value)
      toast.success("Business deleted")
    } else {
      await rejectBusiness(confirmId.value)
      toast.success("Business rejected")
    }
    loadBusinesses()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Action failed")
  } finally {
    processing.value = false
    showConfirmModal.value = false
  }
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  } catch {
    return ""
  }
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()
</script>

<template>
  <div class="businesses-page">
    <div class="page-header">
      <div>
        <h1>Businesses</h1>
        <p>Review and manage marketplace listings</p>
      </div>
      <button class="refresh-btn" @click="loadBusinesses" :disabled="loading">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="error-banner">
      {{ error }}
      <button @click="loadBusinesses">Retry</button>
    </div>

    <!-- SKELETON -->
    <div v-if="loading && !businesses.length" class="table-card">
      <div v-for="i in 3" :key="i" class="row-skeleton">
        <div class="sk-img"></div>
        <div class="sk-lines">
          <div class="sk-line w60"></div>
          <div class="sk-line w40"></div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div v-else-if="businesses.length" class="table-card">
      <div class="table">
        <div class="table-head">
          <span class="col-business">Business</span>
          <span class="col-category">Category</span>
          <span class="col-owner">Owner</span>
          <span class="col-date">Submitted</span>
          <span class="col-status">Status</span>
          <span class="col-actions">Actions</span>
        </div>

        <div v-for="business in businesses" :key="business.id" class="table-row">
          <div class="col-business cell-main">
            <div class="biz-thumb">
              <img v-if="business.image" :src="business.image" :alt="business.name" />
              <span v-else>{{ initials(business.name || "?") }}</span>
            </div>
            <div class="biz-info">
              <strong>{{ business.name }}</strong>
              <span class="muted">{{ business.address || business.city || "No address" }}</span>
            </div>
          </div>

          <div class="col-category">
            <span class="badge badge-neutral">{{ business.category_name || "Uncategorized" }}</span>
          </div>

          <div class="col-owner">
            <div class="owner-cell">
              <span class="owner-avatar">{{ initials(business.owner_name || "?") }}</span>
              <div class="owner-info">
                <strong>{{ business.owner_name || "Unknown" }}</strong>
                <span class="muted">{{ business.owner_email || "" }}</span>
              </div>
            </div>
          </div>

          <div class="col-date muted">{{ formatDate(business.created_at) }}</div>

          <div class="col-status">
            <span class="status-pill" :class="business.status">
              {{ business.status }}
            </span>
          </div>

          <div class="col-actions">
            <div class="row-menu">
              <button
                class="menu-btn"
                :aria-label="`Actions for ${business.name}`"
                :aria-expanded="menuOpenId === business.id"
                @click.stop="toggleMenu(business.id)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>

              <Transition name="menu-fade">
                <div v-if="menuOpenId === business.id" class="menu-dropdown">
                  <button v-if="business.status !== 'approved'" class="menu-item approve" @click="approve(business.id)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Approve
                  </button>
                  <button v-if="business.status !== 'rejected'" class="menu-item reject" @click="openConfirm('reject', business.id, business.name)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Reject
                  </button>
                  <button class="menu-item delete" @click="openConfirm('delete', business.id, business.name)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h3>No {{ activeTab }} businesses</h3>
      <p>When businesses are submitted they will appear here.</p>
    </div>

    <!-- CONFIRM MODAL -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
        <div class="modal-box" role="dialog" aria-modal="true">
          <div class="modal-icon" :class="confirmAction === 'delete' ? 'danger' : 'warning'">
            <svg v-if="confirmAction === 'delete'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3>{{ confirmCopy[confirmAction].title }}</h3>
          <p class="business-name">"{{ confirmName }}"</p>
          <p class="modal-body">{{ confirmCopy[confirmAction].body }}</p>
          <div class="modal-actions">
            <button class="modal-cancel" :disabled="processing" @click="showConfirmModal = false">
              Cancel
            </button>
            <button
              class="modal-confirm"
              :class="confirmAction === 'delete' ? 'danger' : 'warning'"
              :disabled="processing"
              @click="confirmActionHandler"
            >
              <span v-if="processing" class="spinner"></span>
              {{ confirmCopy[confirmAction].button }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.businesses-page {
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
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 600;
  opacity: 0.75;
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

.tabs {
  display: flex;
  gap: 8px;
  background: var(--color-bg-tertiary);
  padding: 5px;
  border-radius: 12px;
  width: fit-content;
}

.tab {
  padding: 9px 22px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tab:hover {
  color: var(--color-text-primary);
}

.tab.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.table-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  overflow: visible;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 2.2fr 1fr 1.8fr 0.9fr 0.8fr 1.4fr;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
}

.table-head {
  background: var(--color-bg-tertiary);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-secondary);
  border-radius: 16px 16px 0 0;
}

.table-row {
  border-top: 1px solid var(--color-border-light);
  transition: background 0.15s;
}

.table-row:last-child {
  border-radius: 0 0 16px 16px;
}

.table-row:hover {
  background: var(--color-bg-tertiary);
}

.cell-main {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.biz-thumb {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  flex-shrink: 0;
}

.biz-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.biz-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.biz-info strong {
  font-size: 15px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.muted {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.badge-neutral {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.owner-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.owner-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.owner-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.owner-info strong {
  font-size: 13px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-pill.pending {
  background: rgba(250, 204, 21, 0.15);
  color: #d97706;
}

.status-pill.approved {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.status-pill.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.col-actions {
  display: flex;
  justify-content: flex-end;
}

/* 3-dot row action menu */
.row-menu {
  position: relative;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border-light);
  border-radius: 9px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(245, 158, 11, 0.08);
}

.menu-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 170px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
  padding: 6px;
  z-index: 50;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  text-align: left;
}

.menu-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.menu-item.approve {
  color: #16a34a;
}

.menu-item.approve:hover {
  background: rgba(34, 197, 94, 0.1);
}

.menu-item.reject {
  color: #d97706;
}

.menu-item.reject:hover {
  background: rgba(245, 158, 11, 0.12);
}

.menu-item.delete {
  color: #ef4444;
}

.menu-item.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.empty-state {
  background: var(--color-surface);
  border: 1px dashed var(--color-border-light);
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.empty-state h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: capitalize;
}

.empty-state p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.row-skeleton {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border-light);
  animation: pulse 1.4s ease-in-out infinite;
}

.sk-img {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--color-bg-tertiary);
}

.sk-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.sk-line {
  height: 12px;
  border-radius: 6px;
  background: var(--color-bg-tertiary);
}

.w60 { width: 60%; }
.w40 { width: 40%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-box {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 34px 32px 28px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.modal-icon.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-icon.warning {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary-dark);
}

.modal-box h3 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--color-text-primary);
}

.business-name {
  font-weight: 700;
  color: var(--color-text-secondary);
  margin: 0 0 10px;
  word-break: break-word;
}

.modal-body {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 26px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions button {
  flex: 1;
  padding: 13px 18px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
}

.modal-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-cancel {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.modal-cancel:hover {
  background: var(--color-border-hover);
}

.modal-confirm.danger {
  background: #ef4444;
  color: white;
}

.modal-confirm.danger:hover {
  background: #dc2626;
}

.modal-confirm.warning {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.modal-confirm.warning:hover {
  background: var(--color-primary-hover);
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 1100px) {
  .table-head,
  .table-row {
    grid-template-columns: 2fr 1fr 1.4fr 0.8fr 1fr;
  }

  .col-date,
  .table-head .col-date {
    display: none;
  }
}

@media (max-width: 800px) {
  .table-head {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 12px;
  }

  .col-actions {
    justify-content: flex-start;
  }
}
</style>
