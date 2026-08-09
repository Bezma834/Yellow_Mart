<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

import { ref, onMounted, computed } from "vue"
import { useAdminApi } from "~/composables/useAdminApi"
import { useToast } from "~/composables/useToast"

const { getCategories, createCategory, updateCategory, deleteCategory, loading } = useAdminApi()
const toast = useToast()

const categories = ref<any[]>([])
const error = ref("")

const name = ref("")
const icon = ref("")
const search = ref("")
const editingId = ref("")
const editName = ref("")
const editIcon = ref("")

const showDeleteModal = ref(false)
const categoryToDelete = ref<string | null>(null)
const categoryDeleteName = ref("")
const processing = ref(false)

const loadCategories = async () => {
  error.value = ""
  try {
    const data = await getCategories()
    categories.value = data.categories || []
  } catch (err: any) {
    error.value = err.message || "Could not load categories"
    console.error(err)
  }
}

const filteredCategories = computed(() => {
  const q = search.value.toLowerCase()
  return categories.value.filter((c) => c.name.toLowerCase().includes(q))
})

const addCategory = async () => {
  if (!name.value.trim()) {
    toast.error("Category name is required")
    return
  }

  try {
    await createCategory(name.value.trim(), icon.value.trim())
    toast.success("Category added successfully")
    name.value = ""
    icon.value = ""
    loadCategories()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Failed to add category")
  }
}

const startEdit = (category: any) => {
  editingId.value = category.id
  editName.value = category.name
  editIcon.value = category.icon || ""
}

const saveEdit = async () => {
  if (!editName.value.trim()) {
    toast.error("Category name is required")
    return
  }

  try {
    await updateCategory(editingId.value, editName.value.trim(), editIcon.value.trim())
    toast.success("Category updated successfully")
    editingId.value = ""
    loadCategories()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Failed to update category")
  }
}

const openDeleteModal = (category: any) => {
  categoryToDelete.value = category.id
  categoryDeleteName.value = category.name
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!categoryToDelete.value) return
  processing.value = true

  try {
    await deleteCategory(categoryToDelete.value)
    toast.success("Category deleted successfully")
    loadCategories()
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "Failed to delete category")
  } finally {
    processing.value = false
    showDeleteModal.value = false
    categoryToDelete.value = null
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

onMounted(loadCategories)
</script>

<template>
  <div class="categories-page">
    <div class="page-header">
      <div>
        <h1>Categories</h1>
        <p>Organize the marketplace by category</p>
      </div>
      <button class="refresh-btn" @click="loadCategories" :disabled="loading">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="error-banner">
      {{ error }}
      <button @click="loadCategories">Retry</button>
    </div>

    <!-- ADD FORM -->
    <div class="add-box">
      <div class="add-fields">
        <input v-model="name" placeholder="Category name" @keyup.enter="addCategory" />
        <input v-model="icon" placeholder="Icon (emoji or short text)" @keyup.enter="addCategory" />
      </div>
      <button class="add-btn" @click="addCategory">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Category
      </button>
    </div>

    <!-- SEARCH -->
    <div class="search-wrap">
      <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input v-model="search" class="search-input" placeholder="Search categories..." />
    </div>

    <!-- SKELETON -->
    <div v-if="loading && !categories.length" class="category-list">
      <div v-for="i in 4" :key="i" class="cat-skeleton">
        <div class="sk-icon"></div>
        <div class="sk-lines">
          <div class="sk-line w60"></div>
          <div class="sk-line w40"></div>
        </div>
      </div>
    </div>

    <!-- LIST -->
    <div v-else-if="filteredCategories.length" class="category-list">
      <div v-for="category in filteredCategories" :key="category.id" class="category-card">
        <!-- EDIT MODE -->
        <div v-if="editingId === category.id" class="edit-area">
          <input v-model="editName" placeholder="Category name" @keyup.enter="saveEdit" />
          <input v-model="editIcon" placeholder="Icon" @keyup.enter="saveEdit" />
          <div class="edit-actions">
            <button class="save-btn" @click="saveEdit">Save</button>
            <button class="cancel-btn" @click="editingId = ''">Cancel</button>
          </div>
        </div>

        <!-- NORMAL MODE -->
        <div v-else class="normal-area">
          <div class="category-info">
            <span v-if="category.icon" class="category-icon">{{ category.icon }}</span>
            <span v-else class="category-icon fallback">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </span>
            <div class="category-text">
              <strong>{{ category.name }}</strong>
              <span class="count">{{ category.business_count }} business{{ category.business_count === 1 ? "" : "es" }}</span>
            </div>
          </div>

          <div class="buttons">
            <button class="edit-btn" @click="startEdit(category)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button class="delete-btn" @click="openDeleteModal(category)">
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
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      </div>
      <h3>{{ search ? "No matching categories" : "No categories yet" }}</h3>
      <p>{{ search ? "Try a different search term." : "Add your first category above." }}</p>
    </div>

    <!-- DELETE MODAL -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-box" role="dialog" aria-modal="true">
          <div class="modal-icon danger">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <h3>Delete Category?</h3>
          <p>Are you sure you want to delete <strong>"{{ categoryDeleteName }}"</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="modal-cancel" :disabled="processing" @click="closeDeleteModal">Cancel</button>
            <button class="modal-confirm" :disabled="processing" @click="confirmDelete">
              <span v-if="processing" class="spinner"></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.categories-page {
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

.add-box {
  display: flex;
  gap: 14px;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  padding: 20px;
  border-radius: 16px;
  flex-wrap: wrap;
}

.add-fields {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 260px;
}

.add-fields input,
.edit-area input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: 0.2s;
  font-family: inherit;
}

.add-fields input:focus,
.edit-area input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;
}

.add-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(245, 158, 11, 0.25);
}

.search-wrap {
  position: relative;
  max-width: 400px;
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

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.category-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  padding: 20px;
  border-radius: 16px;
  transition: all 0.2s;
}

.category-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.normal-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1 1 200px;
}

.category-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.category-icon.fallback {
  color: var(--color-primary);
  background: rgba(245, 158, 11, 0.12);
}

.category-text {
  min-width: 0;
  flex: 1;
}

.category-text strong {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: block;
  line-height: 1.35;
  overflow-wrap: break-word;
  word-break: break-word;
}

.count {
  display: block;
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.edit-btn,
.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 9px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.edit-btn {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary-dark);
}

.edit-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.18);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
}

.edit-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.edit-actions button {
  flex: 1;
  padding: 11px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
}

.save-btn {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.save-btn:hover {
  background: var(--color-primary-hover);
}

.cancel-btn {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: var(--color-border-hover);
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
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-primary);
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

.cat-skeleton {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  animation: pulse 1.4s ease-in-out infinite;
}

.sk-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: var(--color-bg-tertiary);
}

.sk-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  max-width: 420px;
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
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
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

@media (max-width: 640px) {
  .add-box {
    flex-direction: column;
    align-items: stretch;
  }

  .add-fields {
    flex-direction: column;
    min-width: 0;
  }

  .add-btn {
    justify-content: center;
  }

  .normal-area {
    flex-direction: column;
    align-items: flex-start;
  }

  .buttons {
    width: 100%;
  }

  .edit-btn,
  .delete-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
