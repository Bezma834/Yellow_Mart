<template>
  <div class="container">

    <h2>Verify Email</h2>

    <p>Enter the verification code sent to your email</p>

    <input
      v-model="code"
      placeholder="Enter verification code"
      class="input"
    />

    <button @click="verifyEmail">
      Verify Email
    </button>

    <p class="message">
      {{ message }}
    </p>

    <NuxtLink to="/signup">
      Back to Signup
    </NuxtLink>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const code = ref("")
const message = ref("")

const verifyEmail = () => {
  if (!code.value) {
    message.value = "Please enter verification code"
    return
  }

  // fake logic for now
  if (code.value === "1234") {
    message.value = "Email verified successfully!"
  } else {
    message.value = "Invalid verification code"
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
  text-align: center;
}

.input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
}

button {
  padding: 12px 20px;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
}

.message {
  margin-top: 10px;
}
</style>