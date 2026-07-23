<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
      <!-- Title -->
      <h2 class="text-3xl font-bold text-center mb-6">
        {{ isLogin ? "Welcome Back 👋" : "Create Account 🚀" }}
      </h2>

      <!-- Name (Signup only) -->
      <input
        v-if="!isLogin"
        v-model="name"
        type="text"
        placeholder="Full Name"
        class="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <!-- Password -->
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <!-- Submit -->
      <button
        @click="submit"
        class="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
      >
        {{ isLogin ? "Login" : "Create Account" }}
      </button>

      <!-- Switch -->
      <p class="text-center text-gray-500 mt-6">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      </p>

      <button
        @click="toggleMode"
        class="w-full mt-3 bg-black hover:bg-gray-800 text-white py-3 rounded-lg transition"
      >
        {{ isLogin ? "Create Account" : "Login" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const isLogin = ref(true)

const name = ref("")
const email = ref("")
const password = ref("")

const toggleMode = () => {
  isLogin.value = !isLogin.value

  // Optional: clear fields when switching
  name.value = ""
  email.value = ""
  password.value = ""
}

const submit = () => {
  if (!email.value || !password.value) {
    alert("Please fill in all required fields.")
    return
  }

  if (!isLogin.value && !name.value) {
    alert("Please enter your full name.")
    return
  }

  console.log({
    mode: isLogin.value ? "Login" : "Signup",
    name: name.value,
    email: email.value,
    password: password.value,
  })

  alert(
    isLogin.value
      ? "Login button clicked!"
      : "Create Account button clicked!"
  )
}
</script>