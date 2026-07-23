<template>
  <div>
    <input v-model="name" placeholder="name" />
    <input v-model="email" placeholder="email" />
    <input v-model="password" type="password" placeholder="password" />

    <button @click="handleRegister">Register</button>
  </div>
</template>

<script setup lang="ts">
const name = ref("")
const email = ref("")
const password = ref("")
const { Register } = useAuth()

const handleRegister = async () => {
  await register(name.value, email.value, password.value)
  await navigateTo("/login")
}
</script>