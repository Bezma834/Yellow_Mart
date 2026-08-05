<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="brand-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 class="title">Reset Password</h1>
        <p class="subtitle">Choose a new password for your account</p>
      </div>

      <template v-if="hasToken">
        <p v-if="message" :class="['msg', messageType]">{{ message }}</p>

        <label class="field-label" for="password">New Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter a new password"
        />

        <label class="field-label" for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Repeat your new password"
        />

        <button
          class="submit-btn"
          :disabled="loading"
          @click="reset"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </template>

      <div v-else class="invalid-state">
        <p>This reset link is invalid. Please request a new one.</p>
        <NuxtLink to="/forgot-password" class="link">
          Request a new link
        </NuxtLink>
      </div>

      <NuxtLink to="/login" class="link">
        Back to Login
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { useToast } from "~/composables/useToast"

const { success, error } = useToast()
const route = useRoute()

const token = computed(() => String(route.query.token || ""))

const hasToken = computed(() => token.value.length > 0)

const password = ref("")
const confirmPassword = ref("")
const message = ref("")
const messageType = ref("success")
const loading = ref(false)

const reset = async () => {
  if (!password.value || !confirmPassword.value) {
    messageType.value = "error"
    message.value = "Please fill in both password fields"
    return
  }

  if (password.value.length < 6) {
    messageType.value = "error"
    message.value = "Password must be at least 6 characters"
    return
  }

  if (password.value !== confirmPassword.value) {
    messageType.value = "error"
    message.value = "Passwords do not match"
    return
  }

  loading.value = true
  message.value = ""

  try {
    const res = await fetch(
      "https://yellow-mart-backend.onrender.com/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.value,
          password: password.value
        })
      }
    )

    const data = await res.json().catch(() => ({ message: "Server error. Please try again." }))

    if (!res.ok) {
      messageType.value = "error"
      message.value = data.message || "Could not reset password"
      error(data.message || "Could not reset password")
      return
    }

    success(data.message || "Password reset successfully. You can now log in.")
    await navigateTo("/login")
  } catch (err) {
    console.error(err)
    messageType.value = "error"
    message.value = "Cannot connect to server. Please try again."
    error("Cannot connect to server. Please try again.")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245, 158, 11, 0.12) 0%, transparent 60%),
    var(--color-bg-secondary);
  padding: 100px 20px;
}

.auth-card {
  width: 420px;
  padding: 2.75rem 2.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-3xl);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-lg);
}

.auth-brand {
  text-align: center;
  margin-bottom: 1.75rem;
}

.brand-badge {
  width: 52px;
  height: 52px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-2xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  box-shadow: 0 8px 24px -6px var(--color-primary-glow);
}

.title {
  text-align: center;
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 0.375rem;
}

.subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 0.9375rem;
}

.invalid-state {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  padding: 0.75rem 0;
}

.field-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 0.375rem;
}

input {
  width: 100%;
  padding: 0.8125rem 1rem;
  margin-bottom: 1.125rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  transition: all var(--transition-fast);
}

input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-glow);
}

input::placeholder {
  color: var(--color-text-tertiary);
}

.submit-btn {
  width: 100%;
  padding: 0.8125rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border: none;
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 0.9375rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 16px -4px var(--color-primary-glow);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px -6px var(--color-primary-glow);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.msg {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-xl);
  margin-bottom: 1.125rem;
  font-size: 0.875rem;
}

.msg.success {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #16a34a;
}

.msg.error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.link {
  display: block;
  margin-top: 1.25rem;
  text-align: center;
  color: var(--color-primary-hover);
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>

<style>
:root.dark .auth-wrapper {
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245, 158, 11, 0.1) 0%, transparent 60%),
    var(--color-dark-bg);
}

:root.dark .auth-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}

:root.dark input {
  background: var(--color-dark-bg-secondary);
  border-color: var(--color-dark-border);
  color: var(--color-text-primary);
}

:root.dark input:focus {
  border-color: var(--color-primary);
}
</style>
