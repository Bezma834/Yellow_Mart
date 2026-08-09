<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

const showLogoutModal = ref(false)

const { darkMode, toggleTheme, loadTheme } = useTheme()

onMounted(() => {
  loadTheme()
})

const user = ref<any>(null)

if (import.meta.client) {
  try {
    const raw = localStorage.getItem("user")
    user.value = raw ? JSON.parse(raw) : null
  } catch {
    user.value = null
  }
}

const userName = computed(() => user.value?.fullname || user.value?.username || "Admin")

const initials = computed(() =>
  userName.value
    .split(" ")
    .map((w: string) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()
)

const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  navigateTo("/login")
}

const confirmLogout = () => {
  showLogoutModal.value = false
  logout()
}

definePageMeta({
  middleware: "admin"
})
</script>

<template>
  <div class="admin-shell">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <NuxtLink to="/admin" class="logo">
        <span class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/></svg>
        </span>
        <span class="logo-text">Yellow Mart</span>
      </NuxtLink>

      <nav>
        <span class="nav-label">Main</span>

        <NuxtLink to="/admin" class="nav-link" exact-active-class="active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          Dashboard
        </NuxtLink>

        <NuxtLink to="/admin/businesses" class="nav-link" active-class="active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1.5-5h15L21 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>
          Businesses
        </NuxtLink>

        <NuxtLink to="/admin/categories" class="nav-link" active-class="active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Categories
        </NuxtLink>

        <NuxtLink to="/admin/users" class="nav-link" active-class="active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Users
        </NuxtLink>

        <span class="nav-label">Insights</span>

        <NuxtLink to="/admin/reports" class="nav-link" active-class="active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          Reports
        </NuxtLink>

        <NuxtLink to="/admin/map" class="nav-link" active-class="active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Business Map
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <NuxtLink to="/" class="view-site">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          View Site
        </NuxtLink>

        <button class="logout-btn" @click="showLogoutModal = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="main-area">
      <header class="topbar">
        <div class="topbar-title">
          <span class="mobile-menu-btn" @click="showLogoutModal = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </span>
          <span class="admin-badge">Admin Panel</span>
        </div>

        <div class="topbar-user">
          <button class="theme-toggle" :title="darkMode ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
            <svg v-if="!darkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <div class="topbar-avatar">{{ initials }}</div>
          <div class="topbar-meta">
            <strong>{{ userName }}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>

  <AppToast />

  <!-- Logout Confirm Modal -->
  <Teleport to="body">
    <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
      <div class="modal-box">
        <div class="modal-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
        <h3>Log out?</h3>
        <p>Are you sure you want to log out of your account?</p>
        <div class="modal-actions">
          <button class="modal-cancel" @click="showLogoutModal = false">Cancel</button>
          <button class="modal-confirm" @click="confirmLogout">Log Out</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

/* SIDEBAR */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: #0f172a;
  color: #94a3b8;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 22px;
  text-decoration: none;
}

.logo-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  font-size: 17px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.nav-label {
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #475569;
  padding: 14px 12px 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 9px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.15s;
}

.nav-link svg {
  flex-shrink: 0;
}

.nav-link:hover {
  background: rgba(148, 163, 184, 0.08);
  color: #e2e8f0;
}

.nav-link.active {
  background: rgba(245, 158, 11, 0.14);
  color: #fbbf24;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  margin-top: 12px;
}

.view-site {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.15s;
}

.view-site:hover {
  background: rgba(148, 163, 184, 0.08);
  color: #e2e8f0;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #f87171;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.12);
}

/* MAIN */
.main-area {
  margin-left: 250px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 90;
}

.topbar-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-badge {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-tertiary);
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--color-border-light);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(245, 158, 11, 0.08);
}

.topbar-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}

.topbar-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.topbar-meta strong {
  font-size: 14px;
  color: var(--color-text-primary);
}

.topbar-meta span {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.admin-content {
  flex: 1;
  padding: 28px;
  min-width: 0;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

.modal-box {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 36px 32px;
  width: 400px;
  max-width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box h3 {
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.modal-box p {
  color: var(--color-text-secondary);
  font-size: 15px;
  margin-bottom: 26px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
}

.modal-cancel {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
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

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
    padding: 16px 8px;
  }

  .logo {
    justify-content: center;
    padding: 6px 0 18px;
  }

  .logo-text,
  .nav-label,
  .view-site,
  .logout-btn {
    display: none;
  }

  .nav-link {
    justify-content: center;
    padding: 12px;
  }

  .main-area {
    margin-left: 64px;
  }

  .mobile-menu-btn {
    display: block;
  }

  .topbar {
    padding: 0 16px;
  }

  .topbar-meta {
    display: none;
  }

  .admin-content {
    padding: 18px 14px;
  }
}
</style>
