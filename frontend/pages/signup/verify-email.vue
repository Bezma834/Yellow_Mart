<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="brand-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 class="title">Verify Email</h1>
        <p class="subtitle">Enter the verification code sent to your email</p>
      </div>

      <p v-if="message" :class="['msg', messageType]">{{ message }}</p>

      <label class="field-label" for="code">Verification Code</label>
      <input
        id="code"
        v-model="code"
        placeholder="Enter verification code"
      />

      <button
        class="submit-btn"
        @click="verifyEmail"
      >
        Verify Email
      </button>

      <NuxtLink to="/signup" class="link">
        Back to Signup
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const code = ref("")
const message = ref("")
const messageType = ref("success")

const verifyEmail = () => {
  if (!code.value) {
    messageType.value = "error"
    message.value = "Please enter verification code"
    return
  }

  // demo flow: code "1234" verifies
  if (code.value === "1234") {
    messageType.value = "success"
    message.value = "Email verified successfully!"
  } else {
    messageType.value = "error"
    message.value = "Invalid verification code"
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
