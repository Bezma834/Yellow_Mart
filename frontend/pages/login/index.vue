<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="brand-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <h1 class="title">Welcome Back</h1>
        <p class="subtitle">Login to your Yellow-Mart account</p>
      </div>

      <div v-if="error" class="error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ error }}
      </div>

      <label class="field-label" for="identifier">Email or Username</label>
      <input
        id="identifier"
        v-model="identifier"
        type="text"
        placeholder="you@example.com"
      />

      <label class="field-label" for="password">Password</label>
      <div class="password-box">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
        />
        <button
          class="eye"
          type="button"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>
      </div>

      <div class="options-row">
        <NuxtLink class="forgot" to="/forgot-password">Forgot Password?</NuxtLink>
      </div>

      <button
        class="login-btn"
        :disabled="loading"
        @click="login"
      >
        <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <div class="divider">
        <span>or continue with</span>
      </div>

      <GoogleLogin
        :callback="googleLogin"
        :button-config="googleButtonConfig"
      />

      <p class="signup">
        Don't have an account?
        <NuxtLink to="/signup">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"

const router = useRouter()
const { login: authLogin, googleLogin: authGoogleLogin, loading: authLoading } = useAuth()

const identifier = ref("")
const password = ref("")
const error = ref("")
const showPassword = ref(false)

const googleButtonConfig = {
  theme: "outline",
  shape: "rectangular",
  text: "continue_with",
  locale: "en_US",
  width: "350",
  logo_alignment: "center"
}

// Single source of truth for loading (drives the button disabled state)
const loading = authLoading


const validate = () => {

  if (!identifier.value) {
    error.value = "Please enter your email"
    return false
  }

  if (!password.value) {
    error.value = "Please enter your password"
    return false
  }

  if (password.value.length < 6) {
    error.value = "Password must contain at least 6 characters"
    return false
  }

  return true
}


const login = async () => {

  error.value = ""

  if (loading.value) return

  if (!validate()) return

  try {

    const res = await authLogin(
      identifier.value,
      password.value
    )

    if (res?.user?.role?.trim() === "admin") {

      router.push("/admin")

    } else {

      router.push("/")

    }

  } catch (err: any) {

    error.value = err.message || "Invalid email or password"

  }

}


const googleLogin = async (response: any) => {

  error.value = ""

  if (loading.value) return

  try {

    const res = await authGoogleLogin(response.credential)

    if (res?.user?.role?.trim() === "admin") {
      router.push("/admin")
    } else {
      router.push("/")
    }

  } catch (err: any) {
    console.error("GOOGLE LOGIN ERROR:", err)
    error.value = err.message || "Google login failed. Please try again."
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

.password-box {

  position: relative;

}

.password-box input {

  padding-right: 2.75rem;

}

.eye {

  position: absolute;

  right: 0.625rem;

  top: 0.375rem;

  width: 36px;

  height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  background: none;

  color: var(--color-text-tertiary);

  cursor: pointer;

  transition: color var(--transition-fast);

}

.eye:hover {

  color: var(--color-text-secondary);

}

.options-row {

  display: flex;

  justify-content: flex-end;

  margin: -0.375rem 0 1.25rem;

}

.forgot {

  font-size: 0.8125rem;

  font-weight: 600;

  color: var(--color-primary-hover);

  text-decoration: none;

}

.forgot:hover {

  text-decoration: underline;

}

.login-btn {

  width: 100%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 0.5rem;

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

.login-btn:hover {

  transform: translateY(-1px);

  box-shadow: 0 8px 24px -6px var(--color-primary-glow);

}

.login-btn:disabled {

  opacity: 0.6;

  cursor: not-allowed;

  transform: none;

}

.divider {

  display: flex;

  align-items: center;

  gap: 1rem;

  margin: 1.5rem 0;

  color: var(--color-text-tertiary);

  font-size: 0.8125rem;

  text-transform: uppercase;

  letter-spacing: 0.05em;

}

.divider::before,

.divider::after {

  content: "";

  flex: 1;

  height: 1px;

  background: var(--color-border);

}

.google-btn {

  width: 100%;

  display: flex;

  justify-content: center;

}

.google-btn :deep(iframe) {

  width: 100% !important;

  max-width: 350px;

  height: 44px !important;

}

.google-icon {

  width: 20px;

  height: 20px;

  object-fit: contain;

  flex-shrink: 0;

}

.signup {

  text-align: center;

  margin-top: 1.5rem;

  color: var(--color-text-secondary);

  font-size: 0.875rem;

}

.signup a {

  color: var(--color-primary-hover);

  font-weight: 700;

  text-decoration: none;

}

.signup a:hover {

  text-decoration: underline;

}

.error {

  display: flex;

  align-items: center;

  gap: 0.5rem;

  background: rgba(239, 68, 68, 0.08);

  color: #dc2626;

  padding: 0.75rem 1rem;

  border-radius: var(--radius-xl);

  margin-bottom: 1.125rem;

  font-size: 0.875rem;

  border: 1px solid rgba(239, 68, 68, 0.2);

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

:root.dark .divider {
  color: var(--color-text-secondary);
}

:root.dark .divider::before,
:root.dark .divider::after {
  background: var(--color-dark-border);
}

:root.dark .error {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
}
</style>
