<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="brand-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M19 8v6"/>
            <path d="M22 11h-6"/>
          </svg>
        </div>
        <h1 class="title">Create Account</h1>
        <p class="subtitle">Join Yellow-Mart today</p>
      </div>

      <div v-if="errorMsg" class="error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errorMsg }}
      </div>

      <label class="field-label" for="username">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        placeholder="johndoe"
      />

      <label class="field-label" for="fullName">Full Name</label>
      <input
        id="fullName"
        v-model="fullName"
        type="text"
        placeholder="John Doe"
      />

      <label class="field-label" for="email">Email Address</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="you@example.com"
        @blur="checkEmail"
      />
      <p v-if="emailCheckMsg" :class="['email-check', emailCheckType]">
        {{ emailCheckMsg }}
      </p>

      <label class="field-label" for="phone">Phone Number</label>
      <input
        id="phone"
        v-model="phone"
        type="tel"
        placeholder="+251 91 234 5678"
      />

      <label class="field-label" for="password">Password</label>
      <div class="password-box">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter a strong password"
        />
        <button
          type="button"
          class="eye"
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

      <div class="strength" v-if="password">
        <div class="strength-bar">
          <span :class="['strength-fill', strength.toLowerCase()]"></span>
        </div>
        <span :class="['strength-label', strength.toLowerCase()]">{{ strength }}</span>
      </div>

      <label class="field-label" for="confirmPassword">Confirm Password</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        placeholder="Repeat your password"
      />

      <label class="terms">
        <input v-model="agree" type="checkbox" />
        <span>I agree to the <NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink></span>
      </label>

      <button
        class="signup-btn"
        :disabled="loading"
        @click="signup"
      >
        <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M19 8v6"/>
          <path d="M22 11h-6"/>
        </svg>
        {{ loading ? "Creating Account..." : "Create Account" }}
      </button>

      <div class="divider">
        <span>or continue with</span>
      </div>

      <GoogleLogin
        :callback="googleLogin"
        :button-config="googleButtonConfig"
        :client-id="googleClientId"
      />

      <p class="login-link">
        Already have an account?
        <NuxtLink to="/login">Login</NuxtLink>
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useToast } from "~/composables/useToast"
import { useAuth } from "~/composables/useAuth"
import { SIGNUP_MUTATION, CHECK_EMAIL_MUTATION } from "~/graphql/mutations"
const router = useRouter()
const { success, error } = useToast()
const { googleLogin: authGoogleLogin } = useAuth()

const username = ref("")
const fullName = ref("")
const email = ref("")
const phone = ref("")
const password = ref("")
const confirmPassword = ref("")

const avatar = ref<File | null>(null)

const agree = ref(false)

const errorMsg = ref("")
const loading = ref(false)

const showPassword = ref(false)

const googleButtonConfig = {
  theme: "outline",
  shape: "rectangular",
  text: "continue_with",
  locale: "en_US",
  width: "350",
  logo_alignment: "center"
}

const googleClientId = useRuntimeConfig().public.googleClientId

const emailCheckMsg = ref("")
const emailCheckType = ref<"ok" | "bad">("ok")
const emailChecked = ref(false)
const emailChecking = ref(false)

const strength = computed(() => {

  if (password.value.length < 6) {
    return "Weak"
  }

  if (password.value.length < 10) {
    return "Medium"
  }

  return "Strong"

})

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const checkEmail = async () => {
  const value = email.value.trim()

  emailCheckMsg.value = ""
  emailChecked.value = false

  if (!value) return

  if (!validateEmail(value)) {
    emailCheckMsg.value = "Please enter a valid email address"
    emailCheckType.value = "bad"
    return
  }

  emailChecking.value = true
  emailCheckMsg.value = "Checking email..."

  try {
    const { $apollo } = useNuxtApp() as any

    const res = await $apollo.mutate({
      mutation: CHECK_EMAIL_MUTATION,
      variables: { email: value }
    })

    const data = res.data.checkEmail

    if (data.valid) {
      emailCheckMsg.value = "Email looks good"
      emailCheckType.value = "ok"
      emailChecked.value = true
    } else {
      emailCheckMsg.value = data.message || "This email address does not exist"
      emailCheckType.value = "bad"
    }
  } catch (err: any) {
    console.error(err)
    emailCheckMsg.value = "Could not verify email. Please try again."
    emailCheckType.value = "bad"
  } finally {
    emailChecking.value = false
  }
}

const handleAvatar = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    avatar.value = target.files[0]
  }
}

const signup = async () => {

  errorMsg.value = ""

  if (
    !username.value.trim() ||
    !fullName.value.trim() ||
    !email.value.trim() ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMsg.value = "Please fill in all required fields"
    return
  }

  if (!validateEmail(email.value)) {
    errorMsg.value = "Please enter a valid email address"
    return
  }

  if (emailChecked.value === false && !emailCheckMsg.value) {
    await checkEmail()
  }

  if (emailCheckType.value === "bad" || emailChecked.value === false) {
    if (!emailCheckMsg.value) {
      emailCheckMsg.value = "This email address does not exist. Please use a real, working email."
      emailCheckType.value = "bad"
    }
    errorMsg.value = "Please use a real, working email address"
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = "Password must be at least 6 characters"
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match"
    return
  }

  if (!agree.value) {
    errorMsg.value = "Please accept the Terms & Conditions"
    return
  }

  loading.value = true

  try {

    const { $apollo } = useNuxtApp() as any

    const res = await $apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        username: username.value.trim(),
        name: fullName.value.trim(),
        email: email.value.trim(),
        password: password.value,
        phone: phone.value.trim() || null,
        avatar: null
      }
    })

    success("Account created! You can now log in.")
    router.push("/login")
  }
  catch (err: any) {
    console.error(err)
    errorMsg.value = err.message || "Signup failed"
    error(err.message || "Signup failed")
  }
  finally {
    loading.value = false
  }
}

const googleLogin = async (response: any) => {

  errorMsg.value = ""
  loading.value = true

  try {

    const res = await authGoogleLogin(response.credential)

    if (res?.user?.role?.trim() === "admin") {
      router.push("/admin")
    } else {
      router.push("/")
    }

  } catch (err: any) {
    console.error(err)
    errorMsg.value = err.message || "Google login failed"
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

  width: 440px;

  max-width: 100%;

  background: var(--color-surface);

  padding: 2.75rem 2.5rem;

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

  border: 1px solid var(--color-border);

  border-radius: var(--radius-xl);

  background: var(--color-surface);

  color: var(--color-text-primary);

  font-size: 0.9375rem;

  font-family: inherit;

  outline: none;

  transition: all var(--transition-fast);

  box-sizing: border-box;

}

input:focus {

  border-color: var(--color-primary);

  box-shadow: 0 0 0 4px var(--color-primary-glow);

}

input::placeholder {

  color: var(--color-text-tertiary);

}

.email-check {

  font-size: 0.8125rem;

  margin: -0.625rem 0 1.125rem;

  display: flex;

  align-items: center;

  gap: 0.375rem;

}

.email-check.ok {

  color: #16a34a;

}

.email-check.bad {

  color: #dc2626;

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

.strength {

  display: flex;

  align-items: center;

  gap: 0.75rem;

  margin: -0.375rem 0 1.125rem;

}

.strength-bar {

  flex: 1;

  height: 6px;

  border-radius: var(--radius-full);

  background: var(--color-bg-tertiary);

  overflow: hidden;

}

.strength-fill {

  display: block;

  height: 100%;

  border-radius: var(--radius-full);

  transition: width var(--transition-base);

}

.strength-fill.weak {

  width: 33%;

  background: #ef4444;

}

.strength-fill.medium {

  width: 66%;

  background: #f59e0b;

}

.strength-fill.strong {

  width: 100%;

  background: #22c55e;

}

.strength-label {

  font-size: 0.75rem;

  font-weight: 700;

  text-transform: capitalize;

}

.strength-label.weak { color: #ef4444; }

.strength-label.medium { color: #f59e0b; }

.strength-label.strong { color: #22c55e; }

.terms {

  display: flex;

  align-items: flex-start;

  gap: 0.625rem;

  font-size: 0.875rem;

  color: var(--color-text-secondary);

  margin-bottom: 1.25rem;

  cursor: pointer;

}

.terms input {

  width: 18px;

  height: 18px;

  margin: 0;

  flex-shrink: 0;

  accent-color: var(--color-primary);

}

.terms a {

  color: var(--color-primary-hover);

  font-weight: 700;

  text-decoration: none;

}

.terms a:hover {

  text-decoration: underline;

}

.signup-btn {

  width: 100%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 0.5rem;

  padding: 0.8125rem;

  border: none;

  border-radius: var(--radius-xl);

  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);

  color: var(--color-text-primary);

  font-weight: 700;

  font-size: 0.9375rem;

  font-family: inherit;

  cursor: pointer;

  transition: all var(--transition-fast);

  box-shadow: 0 4px 16px -4px var(--color-primary-glow);

}

.signup-btn:hover {

  transform: translateY(-1px);

  box-shadow: 0 8px 24px -6px var(--color-primary-glow);

}

.signup-btn:disabled {

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

.login-link {

  margin-top: 1.5rem;

  text-align: center;

  color: var(--color-text-secondary);

  font-size: 0.875rem;

}

.login-link a {

  color: var(--color-primary-hover);

  font-weight: 700;

  text-decoration: none;

}

.login-link a:hover {

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

@media (max-width: 480px) {
  .auth-card {
    padding: 2.25rem 1.5rem;
  }
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

:root.dark .strength-bar {
  background: var(--color-dark-bg-tertiary);
}

:root.dark .terms {
  color: var(--color-text-secondary);
}

:root.dark .error {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
}

/* GoogleLogin is rendered without .google-btn wrapper - constrain its
   iframe directly so it never overflows the auth card on mobile */
.g-btn-wrapper {
  width: 100% !important;
}

.g-btn-wrapper iframe {
  width: 100% !important;
  max-width: 350px;
  height: 44px !important;
}

/* GSI renders the visible button as a div with inline width:350px
   (the iframe is only the invisible auth handshake) - override it */
.g-btn-wrapper .nsm7Bb-HzV7m-LgbsSe {
  width: 100% !important;
  max-width: 350px !important;
}
</style>
