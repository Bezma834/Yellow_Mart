<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

import { ref, onMounted, computed } from "vue"
import { useAdminApi } from "~/composables/useAdminApi"
import { useToast } from "~/composables/useToast"

const { getUsers, updateUserRole, deleteUser, loading } = useAdminApi()
const toast = useToast()

const users = ref<any[]>([])
const error = ref("")
const search = ref("")
const roleFilter = ref<"all" | "user" | "owner" | "admin">("all")

const showDeleteModal = ref(false)
const userToDelete = ref<any | null>(null)
const processing = ref(false)

const loadUsers = async () => {
  error.value = ""
  try {
    const data = await getUsers(search.value || undefined)
    users.value = data.users || []
  } catch (err: any) {
    error.value = err.message || "Could not load users"
    console.error(err)
  }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null

const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(loadUsers, 350)
}

const filteredUsers = computed(() => {
  if (roleFilter.value === "all") return users.value
  return users.value.filter((u) => u.role === roleFilter.value)
})

const changeRole = async (id: string, role: string) => {
  try {
    await updateUserRole(id, role)
    toast.success("Role updated")
    loadUsers()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Failed to update role")
  }
}

const openDeleteModal = (user: any) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  processing.value = true

  try {
    await deleteUser(userToDelete.value.id)
    toast.success("User deleted")
    loadUsers()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Failed to delete user")
  } finally {
    processing.value = false
    showDeleteModal.value = false
    userToDelete.value = null
  }
}

const initials = (name: string) =>
  (name || "?")
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

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

onMounted(loadUsers)
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1>Users</h1>
        <p>Manage registered accounts and roles</p>
      </div>
      <button class="refresh-btn" @click="loadUsers" :disabled="loading">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- TOOLBAR -->
    <div class="toolbar">
      <div class="search-wrap">
        <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" class="search-input" placeholder="Search by name, email or username..." @input="onSearch" />
      </div>

      <div class="role-tabs">
        <button
          v-for="role in (['all', 'user', 'owner', 'admin'] as const)"
          :key="role"
          class="role-tab"
          :class="{ active: roleFilter === role }"
          @click="roleFilter = role"
        >
          {{ role.charAt(0).toUpperCase() + role.slice(1) }}
        </button>
      </div>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="error-banner">
      {{ error }}
      <button @click="loadUsers">Retry</button>
    </div>

    <!-- SKELETON -->
    <div v-if="loading && !users.length" class="table-card">
      <div v-for="i in 4" :key="i" class="row-skeleton">
        <div class="sk-avatar"></div>
        <div class="sk-lines">
          <div class="sk-line w50"></div>
          <div class="sk-line w70"></div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div v-else-if="filteredUsers.length" class="table-card">
      <div class="table">
        <div class="table-head">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          <span class="col-actions">Actions</span>
        </div>

        <div v-for="user in filteredUsers" :key="user.id" class="table-row">
          <div class="user-cell">
            <div class="avatar">
              <img v-if="user.avatar" :src="user.avatar" :alt="user.fullname" />
              <span v-else>{{ initials(user.fullname || user.username) }}</span>
            </div>
            <div class="user-info">
              <strong>{{ user.fullname || user.username }}</strong>
              <span class="muted">@{{ user.username }}</span>
            </div>
          </div>

          <div class="email-cell muted">{{ user.email }}</div>

          <div class="role-cell">
            <select
              class="role-select"
              :class="`role-${user.role}`"
              :value="user.role"
              @change="changeRole(user.id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="user">user</option>
              <option value="owner">owner</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div class="muted">{{ formatDate(user.created_at) }}</div>

          <div class="col-actions">
            <button class="act-btn delete" @click="openDeleteModal(user)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h3>{{ search ? "No matching users" : "No users found" }}</h3>
      <p>{{ search ? "Try a different search term." : "Users will appear here as they register." }}</p>
    </div>

    <!-- DELETE MODAL -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-box" role="dialog" aria-modal="true">
          <div class="modal-icon danger">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <h3>Delete User?</h3>
          <p>
            This permanently removes <strong>"{{ userToDelete?.fullname || userToDelete?.username }}"</strong>
            ({{ userToDelete?.email }}). Their businesses and data will also be removed.
          </p>
          <div class="modal-actions">
            <button class="modal-cancel" :disabled="processing" @click="showDeleteModal = false">Cancel</button>
            <button class="modal-confirm" :disabled="processing" @click="confirmDelete">
              <span v-if="processing" class="spinner"></span>
              Delete User
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.users-page {
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

.toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 240px;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border-radius: 11px;
  border: 1px solid var(--color-border-light);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: 0.2s;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.role-tabs {
  display: flex;
  gap: 6px;
  background: var(--color-bg-tertiary);
  padding: 4px;
  border-radius: 11px;
}

.role-tab {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.role-tab:hover {
  color: var(--color-text-primary);
}

.role-tab.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
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
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1.8fr 1fr 1fr 0.8fr;
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
}

.table-row {
  border-top: 1px solid var(--color-border-light);
  transition: background 0.15s;
}

.table-row:hover {
  background: var(--color-bg-tertiary);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-info strong {
  font-size: 14px;
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

.email-cell {
  min-width: 0;
}

.role-select {
  padding: 7px 12px;
  border-radius: 9px;
  border: 1px solid var(--color-border-light);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.role-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.role-user {
  color: #6366f1;
}

.role-owner {
  color: #d97706;
}

.role-admin {
  color: #16a34a;
}

.col-actions {
  display: flex;
  justify-content: flex-end;
}

.act-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.act-btn.delete {
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.18);
}

.act-btn.delete:hover {
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.12);
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
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
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

.sk-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
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

.w50 { width: 50%; }
.w70 { width: 70%; }

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

.modal-box h3 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--color-text-primary);
}

.modal-box p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 26px;
}

.modal-box p strong {
  color: var(--color-text-primary);
  word-break: break-word;
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
  transition: all 0.2s;
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

.modal-confirm {
  background: #ef4444;
  color: white;
}

.modal-confirm:hover {
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

@media (max-width: 900px) {
  .table-head,
  .table-row {
    grid-template-columns: 2fr 1.4fr 1fr 0.9fr;
  }

  .col-actions {
    display: none;
  }
}

@media (max-width: 640px) {
  .table-head {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 10px;
  }
}
</style>
