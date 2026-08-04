<script setup lang="ts">
const route = useRoute()
await navigateTo(`/market/${route.params.id}`, { replace: true })
</script>
<template>
  <div></div>
</template>
