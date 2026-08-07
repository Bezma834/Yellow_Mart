<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import gql from "graphql-tag"

import { useAuth } from "~/composables/useAuth"
import { useToast } from "~/composables/useToast"

const router = useRouter()

const { user } = useAuth()

const toast = useToast()

const { $apollo } = useNuxtApp() as any

const businesses = ref<any[]>([])

const loading = ref(true)

const showDeleteModal = ref(false)

const selectedBusiness = ref<any>(null)

const deleting = ref(false)

// Open delete modal
const openDeleteModal = (business: any) => {
  selectedBusiness.value = business
  showDeleteModal.value = true
}

// Get businesses owned by user
const GET_MY_BUSINESSES = gql`
query GetMyBusinesses(
  $owner_id: uuid!
){
businesses(
where:{
owner_id:{
_eq:$owner_id
}
}
){
id
name
description
phone
address
city
image
lat
lng
views
likes
status

category{
id
name
}
}
}
`

// Delete mutation
const DELETE_BUSINESS = gql`
mutation DeleteBusiness(
$id:uuid!
){
delete_businesses_by_pk(
id:$id
){
id
}
}
`

// Load businesses
const loadBusinesses = async () => {
  if (!user.value) {
    router.push("/login")
    return
  }

  try {
    const result = await $apollo.query({
      query: GET_MY_BUSINESSES,
      variables: {
        owner_id: user.value.id
      },
      fetchPolicy: "network-only"
    })

    businesses.value = result.data.businesses || []
  } catch (error) {
    console.error("LOAD ERROR:", error)
    toast.error("Failed to load your businesses")
  } finally {
    loading.value = false
  }
}

// Delete business
const deleteBusiness = async (id: string) => {
  deleting.value = true
  try {
    await $apollo.mutate({
      mutation: DELETE_BUSINESS,
      variables: { id }
    })

    // remove from UI immediately
    businesses.value = businesses.value.filter((item) => item.id !== id)

    showDeleteModal.value = false
    selectedBusiness.value = null

    toast.success("Business deleted successfully")
  } catch (error) {
    console.error("DELETE ERROR:", error)
    toast.error("Failed to delete business")
  } finally {
    deleting.value = false
  }
}

// Edit page navigation
const editBusiness = (id: string) => {
  router.push(`/edit-business/${id}`)
}

const categoryName = (business: any) => {
  if (business.category && typeof business.category === "object") return business.category.name
  return business.category || "Business"
}

const statusLabel = (status: string) => {
  if (!status) return null
  const map: Record<string, string> = {
    approved: "Approved",
    pending: "Pending Review",
    rejected: "Rejected"
  }
  return map[status] || status
}

onMounted(() => {
  loadBusinesses()
})

</script>

<template>

<div class="page">

  <!-- Header -->
  <div class="header">

    <div>
      <h1>
        <svg class="title-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
        My Businesses
      </h1>
      <p>Manage your listed businesses</p>
    </div>

    <button
      @click="router.push('/add-business')"
      class="add-business-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {{ businesses.length ? "Add Your Business" : "Add Your First Business" }}
    </button>

  </div>

  <!-- Loading skeletons -->
  <div
    v-if="loading"
    class="grid"
  >
    <div
      v-for="i in 3"
      :key="i"
      class="business-wrapper skeleton-card"
    >
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-line w-60"></div>
      <div class="skeleton skeleton-line w-90"></div>
      <div class="skeleton skeleton-line w-80"></div>
      <div class="skeleton-actions">
        <div class="skeleton skeleton-btn"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    </div>
  </div>

  <!-- Business List -->
  <div
    v-else-if="businesses.length"
    class="grid"
  >

    <div
      v-for="business in businesses"
      :key="business.id"
      class="business-wrapper"
    >

      <div class="image-wrapper">
        <BusinessImage :business="business" :alt="business.name" />
        <span
          v-if="statusLabel(business.status)"
          class="status-badge"
          :class="business.status"
        >
          {{ statusLabel(business.status) }}
        </span>
      </div>

      <h2>{{ business.name }}</h2>

      <p class="description">{{ business.description }}</p>

      <span class="category-tag">
        {{ categoryName(business) }}
      </span>

      <div class="info">
        <span v-if="business.city">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ business.city }}
        </span>

        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {{ business.likes }}
        </span>

        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {{ business.views }}
        </span>
      </div>

      <div class="actions">

        <button
          @click="editBusiness(business.id)"
          class="edit-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          Edit
        </button>

        <button
          @click="openDeleteModal(business)"
          class="delete-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>

      </div>

    </div>

  </div>

  <!-- Empty State -->
  <div
    v-else
    class="empty-state"
  >

    <div class="empty-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
    </div>

    <h2>No businesses yet</h2>

    <p>
      Start growing your business today.
      Create your first listing and reach thousands of customers.
    </p>

    <button
      @click="router.push('/add-business')"
      class="add-business-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
      Add Your First Business
    </button>

  </div>

  <!-- Delete Modal -->
  <Teleport to="body">
    <div
      v-if="showDeleteModal"
      class="overlay"
      @click.self="showDeleteModal = false"
    >

      <div class="modal">

        <div class="modal-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </div>

        <h2>Delete Business?</h2>

        <p>
          Are you sure you want to delete
          <strong>{{ selectedBusiness?.name }}</strong>?
          This action cannot be undone.
        </p>

        <div class="modal-actions">

          <button
            @click="showDeleteModal = false"
            class="cancel"
            :disabled="deleting"
          >
            Cancel
          </button>

          <button
            @click="deleteBusiness(selectedBusiness.id)"
            class="confirm"
            :disabled="deleting"
          >
            <span v-if="deleting" class="spinner"></span>
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>

        </div>

      </div>

    </div>
  </Teleport>

</div>

</template>
<style scoped>

.page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 90px 30px 50px;
}

/* ================= HEADER ================= */

.header {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header h1 {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: var(--color-primary);
}

.header p {
  margin-top: 8px;
  color: var(--color-text-tertiary);
  font-size: 16px;
}

/* ================= ADD BUTTON ================= */

.add-business-btn {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  padding: 14px 26px;
  border-radius: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px -4px var(--color-primary-glow);
}

.add-business-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px -4px var(--color-primary-glow);
}

/* ================= GRID ================= */

.grid {
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 28px;
}

/* ================= CARD ================= */

.business-wrapper {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 24px;
  text-align: center;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  transition: 0.3s;
  display: flex;
  flex-direction: column;
}

.business-wrapper:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.15);
  border-color: var(--color-border-hover);
}

/* ================= IMAGE ================= */

.image-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 20px;
}

.image-wrapper :deep(img),
.image-wrapper :deep(.business-avatar) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  border: 4px solid var(--color-surface);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.business-wrapper:hover .image-wrapper :deep(img) {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.status-badge::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}

.status-badge.approved {
  background: #22c55e;
}

.status-badge.pending {
  background: var(--color-primary);
}

.status-badge.rejected {
  background: #dc2626;
}

.business-wrapper h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.business-wrapper p.description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-tag {
  display: inline-block;
  margin: 0 auto 4px;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: var(--radius-full);
}

/* ================= INFO ================= */

.info {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin: 14px 0;
  color: var(--color-text-tertiary);
  font-size: 14px;
  font-weight: 600;
}

.info span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.info svg {
  color: var(--color-primary-hover);
  flex-shrink: 0;
}

/* ================= BUTTONS ================= */

.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.actions button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: 0.25s;
}

.edit-btn {
  background: var(--color-primary);
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.edit-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.delete-btn {
  background: #ef4444;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.delete-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* ================= SKELETONS ================= */

.skeleton-card {
  min-height: 420px;
  gap: 14px;
}

.skeleton {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton-img {
  width: 220px;
  height: 220px;
  border-radius: 18px;
  margin: 0 auto;
}

.skeleton-line {
  height: 14px;
}

.w-60 { width: 60%; margin: 0 auto; }
.w-90 { width: 90%; margin: 0 auto; }
.w-80 { width: 80%; margin: 0 auto; }

.skeleton-actions {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}

.skeleton-btn {
  flex: 1;
  height: 46px;
  border-radius: 12px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

/* ================= EMPTY STATE ================= */

.empty-state {
  max-width: 700px;
  margin: 80px auto;
  background: var(--color-surface);
  border-radius: 28px;
  padding: 60px;
  text-align: center;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  width: 110px;
  height: 110px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-hover);
}

.empty-state h2 {
  font-size: 30px;
  margin-bottom: 15px;
  color: var(--color-text-primary);
}

.empty-state p {
  font-size: 17px;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
}

/* ================= DELETE MODAL ================= */

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--color-surface);
  width: 380px;
  max-width: 100%;
  border-radius: 24px;
  padding: 30px;
  text-align: center;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal h2 {
  margin-bottom: 15px;
  color: var(--color-text-primary);
}

.modal p {
  color: var(--color-text-secondary);
}

.modal p strong {
  color: var(--color-text-primary);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.cancel,
.confirm {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s;
}

.cancel,
.confirm:disabled {
  cursor: not-allowed;
}

.cancel {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.cancel:hover {
  background: var(--color-border-hover);
}

.confirm {
  background: #ef4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.confirm:hover {
  background: #dc2626;
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

/* ================= RESPONSIVE ================= */

@media (max-width: 768px) {

  .header {
    flex-direction: column;
    text-align: center;
  }

  .image-wrapper {
    width: 180px;
    height: 180px;
  }
  .skeleton-img {
    width: 180px;
    height: 180px;
  }

  .actions {
    flex-direction: column;
  }

}

</style>

<style>
:root.dark .page {
  background: var(--color-dark-bg);
}
:root.dark .business-wrapper {
  background: var(--color-dark-bg-secondary);
  box-shadow: none;
}
:root.dark .business-wrapper:hover {
  box-shadow: none;
}
:root.dark .header h1,
:root.dark .business-wrapper h2,
:root.dark .empty-state h2 {
  color: var(--color-text-primary);
}
:root.dark .header p,
:root.dark .info,
:root.dark .modal p {
  color: var(--color-text-secondary);
}
:root.dark .business-wrapper p.description,
:root.dark .empty-state p {
  color: var(--color-text-tertiary);
}
:root.dark .category-tag {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}
:root.dark .empty-state {
  background: var(--color-dark-bg-secondary);
}
:root.dark .modal {
  background: var(--color-dark-bg-secondary);
}
:root.dark .modal h2 {
  color: var(--color-text-primary);
}
:root.dark .modal p strong {
  color: var(--color-text-primary);
}
:root.dark .modal-icon {
  background: rgba(220, 38, 38, 0.15);
}
:root.dark .image-wrapper :deep(img),
:root.dark .image-wrapper :deep(.business-avatar) {
  border-color: var(--color-dark-bg-secondary);
}
:root.dark .edit-btn {
  color: var(--color-text-primary);
}
:root.dark .cancel {
  background: var(--color-dark-bg);
  color: var(--color-text-primary);
}
:root.dark .cancel:hover {
  background: var(--color-dark-bg-tertiary);
}
:root.dark .skeleton {
  background: var(--color-dark-bg-tertiary);
}
:root.dark .actions button:hover {
  box-shadow: none;
}
</style>
