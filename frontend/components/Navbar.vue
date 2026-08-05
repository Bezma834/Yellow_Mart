<template>
  <nav :class="['navbar', { scrolled }]">
    <!-- LOGO -->
    <NuxtLink to="/" class="logo">
      <span class="logo-icon">Y</span>
      <span class="logo-text">Yellow Mart</span>
    </NuxtLink>

    <!-- SEARCH -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search businesses..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
    </div>

    <!-- NAVIGATION -->
    <div class="nav-links">
      <NuxtLink to="/add-business" class="add-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        Add Business
      </NuxtLink>

      <NuxtLink to="/map" class="nav-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Map
      </NuxtLink>

      <!-- DARK MODE TOGGLE -->
      <button class="theme-toggle" @click="toggleTheme" :title="darkMode ? 'Switch to light mode' : 'Switch to dark mode'">
        <svg v-if="!darkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>

      <!-- LOGGED USER -->
      <div
        v-if="user"
        class="user-dropdown"
        @mouseenter="open = true"
        @mouseleave="open = false"
      >
        <button class="user-btn" @click="open = !open">
          <div class="user-avatar">
            <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" />
            <span v-else>{{ user?.fullname?.charAt(0).toUpperCase() || "U" }}</span>
          </div>
          <span class="user-name">{{ user?.displayName || user?.email }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <Transition name="fade">
          <div v-if="open" class="dropdown-menu">
            <div class="dropdown-header">
              <div class="dropdown-avatar">
                <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" />
                <span v-else>{{ user?.fullname?.charAt(0).toUpperCase() || "U" }}</span>
              </div>
              <div>
                <h4>{{ user?.displayName || "Yellow Mart User" }}</h4>
                <p>{{ user?.email }}</p>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <NuxtLink to="/profile" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              My Profile
            </NuxtLink>

            <NuxtLink to="/favorites" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Favorites
            </NuxtLink>

            <NuxtLink to="/my-businesses" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              My Businesses
            </NuxtLink>

            <NuxtLink to="/settings" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </NuxtLink>

            <div class="dropdown-divider"></div>

            <button class="dropdown-item logout" @click="requestLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </Transition>
      </div>

      <!-- NOT LOGGED USER -->
      <NuxtLink v-else to="/login" class="login-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        Login
      </NuxtLink>

      <!-- MOBILE HAMBURGER -->
      <button class="hamburger" @click="mobileOpen = !mobileOpen" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'">
        <span :class="['bar', { open: mobileOpen }]"></span>
        <span :class="['bar', { open: mobileOpen }]"></span>
        <span :class="['bar', { open: mobileOpen }]"></span>
      </button>
    </div>

    <!-- MOBILE MENU PANEL -->
    <Transition name="mobile-slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="mobile-search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search businesses..."
            @keyup.enter="handleSearch()"
          />
          <button @click="handleSearch()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <div class="mobile-links">
          <NuxtLink to="/map" class="mobile-link" @click="mobileOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Map
          </NuxtLink>
          <NuxtLink to="/add-business" class="mobile-link" @click="mobileOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            Add Business
          </NuxtLink>
          <NuxtLink v-if="user" to="/profile" class="mobile-link" @click="mobileOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            My Profile
          </NuxtLink>
          <NuxtLink v-if="user" to="/my-businesses" class="mobile-link" @click="mobileOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            My Businesses
          </NuxtLink>
          <NuxtLink v-if="!user" to="/login" class="mobile-link" @click="mobileOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Login
          </NuxtLink>
          <button v-if="user" class="mobile-link logout" @click="requestLogout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>

        <button class="mobile-theme" @click="toggleTheme()">
          <svg v-if="!darkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          {{ darkMode ? "Light Mode" : "Dark Mode" }}
        </button>
      </div>
    </Transition>
  </nav>

  <!-- LOGOUT CONFIRM MODAL -->
  <Transition name="fade">
    <div
      v-if="showLogoutModal"
      class="logout-overlay"
      @click.self="cancelLogout"
    >
      <div class="logout-modal">
        <div class="logout-modal-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <h3>Log out?</h3>
        <p>Are you sure you want to log out of your account?</p>
        <div class="logout-modal-actions">
          <button class="logout-modal-cancel" @click="cancelLogout">
            Cancel
          </button>
          <button class="logout-modal-confirm" @click="confirmLogout">
            Log Out
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"
import { useTheme } from "~/composables/useTheme"

const router = useRouter()
const { user, logout, checkAuth } = useAuth()
const { darkMode, toggleTheme, loadTheme } = useTheme()

const searchQuery = ref("")
const open = ref(false)
const scrolled = ref(false)
const mobileOpen = ref(false)
const showLogoutModal = ref(false)

const requestLogout = () => {
  open.value = false
  mobileOpen.value = false
  showLogoutModal.value = true
}

const confirmLogout = () => {
  showLogoutModal.value = false
  logout()
  router.push("/")
}

const cancelLogout = () => {
  showLogoutModal.value = false
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
}

onMounted(() => {
  checkAuth()
  loadTheme()
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  z-index: 9999;
  transition: all var(--transition-base);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.08);
  border-bottom-color: var(--color-border);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: var(--color-primary);
  color: #0f172a;
  border-radius: var(--radius-lg);
  font-weight: 800;
  font-size: 1.125rem;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.logo-text {
  font-family: var(--font-heading);
}

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  transition: all var(--transition-fast);
  flex: 1;
  max-width: 400px;
  margin: 0 1.5rem;
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
  background: var(--color-surface);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.search-box input::placeholder {
  color: var(--color-text-tertiary);
}

.search-box button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast);
}

.search-box button:hover {
  color: var(--color-text-primary);
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
}

/* Add Business Button */
.add-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.125rem;
  background: var(--color-primary);
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.add-btn:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 0 24px var(--color-primary-glow);
  transform: translateY(-1px);
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

/* Login Button */
.login-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.125rem;
  background: transparent;
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.login-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-hover);
}

/* User Dropdown */
.user-dropdown {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-hover);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: #0f172a;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 280px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-elevated);
  padding: 0.75rem;
  z-index: 99999;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
}

.dropdown-avatar {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
  overflow: hidden;
  flex-shrink: 0;
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-header h4 {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  margin: 0;
}

.dropdown-header p {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
}

.dropdown-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

:root.dark .dropdown-item.logout {
  color: #f87171;
}

:root.dark .dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.hamburger:hover {
  border-color: var(--color-primary);
}

.hamburger .bar {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.hamburger .bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger .bar.open:nth-child(2) {
  opacity: 0;
}

.hamburger .bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu Panel */
.mobile-menu {
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-xl);
  padding: 1.25rem 1.5rem 1.5rem;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 72px);
  overflow-y: auto;
}

.mobile-search {
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.mobile-search:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
}

.mobile-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  min-width: 0;
}

.mobile-search input::placeholder {
  color: var(--color-text-tertiary);
}

.mobile-search button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast);
}

.mobile-search button:hover {
  color: var(--color-primary);
}

.mobile-links {
  display: flex;
  flex-direction: column;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 0.75rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.mobile-link:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.mobile-link.logout {
  color: #ef4444;
}

.mobile-link.logout:hover {
  background: #fef2f2;
}

.mobile-theme {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mobile-theme:hover {
  color: var(--color-text-primary);
  background: var(--color-border);
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Responsive */
@media (max-width: 1024px) {
  .search-box {
    display: none;
  }

  .nav-link,
  .login-btn {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .user-btn {
    padding: 0.375rem;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
  }

  .nav-link span,
  .user-name {
    display: none;
  }

  .add-btn span {
    display: none;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
}

/* Logout confirm modal */
.logout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.logout-modal {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: 36px 32px;
  width: 400px;
  max-width: 100%;
  text-align: center;
  box-shadow: var(--shadow-2xl);
  animation: popIn 0.25s ease;
}

.logout-modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-modal h3 {
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.logout-modal p {
  color: var(--color-text-secondary);
  font-size: 15px;
  margin-bottom: 26px;
}

.logout-modal-actions {
  display: flex;
  gap: 12px;
}

.logout-modal-cancel,
.logout-modal-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
}

.logout-modal-cancel {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.logout-modal-cancel:hover {
  background: var(--color-border);
}

.logout-modal-confirm {
  background: #111827;
  color: white;
}

.logout-modal-confirm:hover {
  background: #dc2626;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

<style>
:root.dark .navbar {
  background: rgba(11, 17, 33, 0.78);
  border-bottom-color: rgba(30, 58, 95, 0.4);
}

:root.dark .navbar.scrolled {
  background: rgba(11, 17, 33, 0.92);
  border-bottom-color: var(--color-dark-border);
}

:root.dark .logo {
  color: var(--color-text-primary);
}

:root.dark .search-box {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-dark-border);
}

:root.dark .search-box:focus-within {
  border-color: var(--color-primary);
  background: var(--color-dark-surface);
}

:root.dark .search-box input {
  color: var(--color-text-primary);
}

:root.dark .search-box input::placeholder {
  color: var(--color-text-tertiary);
}

:root.dark .search-box button {
  color: var(--color-text-tertiary);
}

:root.dark .search-box button:hover {
  color: var(--color-text-primary);
}

:root.dark .nav-link {
  color: var(--color-text-secondary);
}

:root.dark .nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-dark-bg-tertiary);
}

:root.dark .theme-toggle {
  background: var(--color-dark-bg-secondary);
  color: var(--color-text-secondary);
}

:root.dark .theme-toggle:hover {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .login-btn {
  color: var(--color-text-primary);
  border-color: var(--color-dark-border);
}

:root.dark .login-btn:hover {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-dark-border-hover);
}

:root.dark .user-btn {
  border-color: var(--color-dark-border);
}

:root.dark .user-btn:hover {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-dark-border-hover);
}

:root.dark .user-name {
  color: var(--color-text-primary);
}

:root.dark .dropdown-menu {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .dropdown-header h4 {
  color: var(--color-text-primary);
}

:root.dark .dropdown-header p {
  color: var(--color-text-tertiary);
}

:root.dark .dropdown-divider {
  background: var(--color-dark-border);
}

:root.dark .dropdown-item {
  color: var(--color-text-secondary);
}

:root.dark .dropdown-item:hover {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .hamburger {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark .hamburger:hover {
  border-color: var(--color-primary);
}

:root.dark .hamburger .bar {
  background: var(--color-text-primary);
}

:root.dark .mobile-menu {
  background: var(--color-dark-surface);
  border-bottom-color: var(--color-dark-border);
}

:root.dark .mobile-search {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-dark-border);
}

:root.dark .mobile-search input {
  color: var(--color-text-primary);
}

:root.dark .mobile-search button {
  color: var(--color-text-tertiary);
}

:root.dark .mobile-search button:hover {
  color: var(--color-primary);
}

:root.dark .mobile-link {
  color: var(--color-text-secondary);
}

:root.dark .mobile-link:hover {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .mobile-link.logout {
  color: #f87171;
}

:root.dark .mobile-link.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

:root.dark .mobile-theme {
  background: var(--color-dark-bg-secondary);
  color: var(--color-text-secondary);
}

:root.dark .mobile-theme:hover {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .logout-modal {
  background: var(--color-dark-surface);
}

:root.dark .logout-modal h3 {
  color: var(--color-text-primary);
}

:root.dark .logout-modal p {
  color: var(--color-text-secondary);
}

:root.dark .logout-modal-cancel {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .logout-modal-cancel:hover {
  background: var(--color-dark-border);
}

:root.dark .logout-modal-confirm {
  background: var(--color-dark-surface-hover);
  color: var(--color-text-primary);
}

:root.dark .logout-modal-confirm:hover {
  background: #dc2626;
  color: white;
}
</style>
