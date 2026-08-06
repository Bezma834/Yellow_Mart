<script setup lang="ts">
definePageMeta({
  layout: "admin"
})

import { ref, onMounted } from "vue"

import BusinessCard from "~/components/BusinessCard.vue"

import {
  GET_PENDING_BUSINESSES
} from "~/graphql/queries"

import {
  APPROVE_BUSINESS,
  REJECT_BUSINESS,
  DELETE_BUSINESS
} from "~/graphql/mutations"

import { useToast } from "~/composables/useToast"

const { $apollo } = useNuxtApp() as any

const toast = useToast()

const businesses = ref<any[]>([])

const loading = ref(true)

// Confirm modal state
const showConfirmModal = ref(false)
const confirmAction = ref<"reject" | "delete">("reject")
const confirmId = ref("")
const confirmName = ref("")
const processing = ref(false)

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

// LOAD PENDING BUSINESSES

const loadBusinesses = async () => {
  try {
    const { data } = await $apollo.query({
      query: GET_PENDING_BUSINESSES,
      fetchPolicy: "network-only"
    })

    businesses.value = data.businesses || []
  } catch (error) {
    console.error("ADMIN BUSINESS ERROR:", error)
    toast.error("Failed to load pending businesses")
  } finally {
    loading.value = false
  }
}

// APPROVE

const approveBusiness = async (id: string) => {
  try {
    await $apollo.mutate({
      mutation: APPROVE_BUSINESS,
      variables: { id }
    })
    toast.success("Business approved successfully")
    loadBusinesses()
  } catch (error) {
    console.error(error)
    toast.error("Failed to approve business")
  }
}

// Open confirm modal (reject/delete are destructive, use a modal not window.confirm)
const openConfirm = (action: "reject" | "delete", id: string, name: string) => {
  confirmAction.value = action
  confirmId.value = id
  confirmName.value = name
  showConfirmModal.value = true
}

// REJECT — soft reject: mark as "rejected", keep business + owner account
const rejectBusiness = async (id: string) => {
  processing.value = true
  try {
    await $apollo.mutate({
      mutation: REJECT_BUSINESS,
      variables: { id }
    })
    toast.success("Business rejected")
    loadBusinesses()
  } catch (error) {
    console.error(error)
    toast.error("Failed to reject business")
  } finally {
    processing.value = false
    showConfirmModal.value = false
  }
}

// DELETE — delete the business listing only, NEVER the owner account
const deleteBusiness = async (id: string) => {
  processing.value = true
  try {
    await $apollo.mutate({
      mutation: DELETE_BUSINESS,
      variables: { id }
    })
    toast.success("Business deleted")
    loadBusinesses()
  } catch (error) {
    console.error(error)
    toast.error("Failed to delete business")
  } finally {
    processing.value = false
    showConfirmModal.value = false
  }
}

onMounted(() => {
  loadBusinesses()
})
</script>

<template>
  <section class="admin-business-page">
    <div class="container">
      <h1>
        <svg class="title-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Pending Businesses
      </h1>

      <!-- Skeleton loading -->
      <div v-if="loading" class="business-grid">
        <div v-for="i in 3" :key="i" class="business-item skeleton-card">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-line w-60"></div>
          <div class="skeleton skeleton-line w-40"></div>
          <div class="skeleton skeleton-line w-80"></div>
        </div>
      </div>

      <div
        v-else-if="businesses.length"
        class="business-grid"
      >
        <div
          v-for="business in businesses"
          :key="business.id"
          class="business-item"
        >
          <BusinessCard
            :business="business"
          />

          <div class="actions">
            <button
              class="approve"
              @click="approveBusiness(business.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Approve
            </button>

            <button
              class="reject"
              @click="openConfirm('reject', business.id, business.name)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Reject
            </button>

            <button
              class="delete"
              @click="openConfirm('delete', business.id, business.name)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="empty"
      >
        <svg class="empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p>No pending businesses</p>
      </div>
    </div>

    <!-- Confirm modal -->
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
            <button
              class="modal-cancel"
              :disabled="processing"
              @click="showConfirmModal = false"
            >
              Cancel
            </button>
            <button
              class="modal-confirm"
              :class="confirmAction === 'delete' ? 'danger' : 'warning'"
              :disabled="processing"
              @click="confirmAction === 'delete' ? deleteBusiness(confirmId) : rejectBusiness(confirmId)"
            >
              <span v-if="processing" class="spinner"></span>
              {{ confirmCopy[confirmAction].button }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.admin-business-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 50px 20px;
}

.container {
  max-width: 1200px;
  margin: auto;
}

h1 {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.business-item {
  background: var(--color-surface);
  padding: 20px;
  border-radius: 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* Skeletons */
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 30px;
}

.skeleton {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton-img {
  height: 200px;
  border-radius: var(--radius-xl);
}

.skeleton-line {
  height: 14px;
}

.w-60 { width: 60%; }
.w-40 { width: 40%; }
.w-80 { width: 80%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.actions button {
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.actions button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.approve {
  background: #22c55e;
  color: white;
}

.reject {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.reject:hover {
  background: var(--color-primary-hover);
}

.delete {
  background: #dc2626;
  color: white;
}

.delete:hover {
  background: #b91c1c;
}

.empty {
  background: var(--color-surface);
  padding: 50px;
  border-radius: 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  color: var(--color-primary);
}

.empty p {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-secondary);
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
  box-shadow: var(--shadow-elevated);
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
  background: #fef2f2;
  color: #dc2626;
}

.modal-icon.warning {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.modal-box h3 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px;
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
  border-radius: var(--radius-lg);
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  background: #dc2626;
  color: white;
}

.modal-confirm.danger:hover {
  background: #b91c1c;
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
</style>

<style>
:root.dark .business-item {
  background: var(--color-dark-surface);
}
:root.dark .empty {
  background: var(--color-dark-surface);
}
:root.dark .modal-box {
  background: var(--color-dark-surface);
}
:root.dark .modal-icon.danger {
  background: rgba(220, 38, 38, 0.15);
}
:root.dark .modal-icon.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}
:root.dark .modal-cancel {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-secondary);
}
:root.dark .modal-cancel:hover {
  background: var(--color-dark-border-hover);
}
:root.dark .skeleton {
  background: var(--color-dark-bg-tertiary);
}
</style>
