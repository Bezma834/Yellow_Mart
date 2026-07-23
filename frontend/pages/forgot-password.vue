<template>
  <div class="auth-wrapper">

    <div class="auth-card">

      <h2>Forgot Password</h2>
      <p class="subtitle">Enter your email to reset password</p>

      <input v-model="email" type="email" placeholder="Email address" />

      <button class="primary" @click="send">
        Send Reset Link
      </button>

      <p class="msg">{{ message }}</p>

      <NuxtLink to="/login" class="link">
        Back to Login
      </NuxtLink>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const email = ref("")
const message = ref("")

const send = () => {
  if (!email.value) {
    message.value = "Please enter your email"
    return
  }

  message.value = "Reset link sent to " + email.value
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #1f2937, #0f172a);
}

.auth-card {
  width: 380px;
  padding: 30px;
  border-radius: 16px;
  background: rgba(17,24,39,.95);
  color: white;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(255,255,255,.06);
  color: white;
}

.primary {
  width: 100%;
  padding: 12px;
  background: #facc15;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.msg {
  margin-top: 10px;
  color: lightgreen;
}

.link {
  display: block;
  margin-top: 15px;
  color: #facc15;
  text-align: center;
}
</style>