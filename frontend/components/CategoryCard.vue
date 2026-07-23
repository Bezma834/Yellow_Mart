<script setup lang="ts">

defineProps<{
  id:string
  title:string
  description:string
}>()

</script>


<template>

<NuxtLink

:to="`/category/${id}`"

class="category-card"

>


<div class="icon">
📂
</div>


<h3>
{{ title }}
</h3>


<p>
{{ description }}
</p>


</NuxtLink>


</template>
<style scoped>

.category-card {

  display: block;

  text-decoration: none;

  background: white;

  padding: 30px 20px;

  border-radius: 22px;

  cursor: pointer;

  text-align: center;

  border: 1px solid #e5e7eb;

  transition: all .35s ease;

  position: relative;

  overflow: hidden;

}

.category-card::before {

  content: "";

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 4px;

  background: #facc15;

  transform: scaleX(0);

  transition: .3s ease;

}

.category-card:hover::before {

  transform: scaleX(1);

}

.category-card:hover {

  transform: translateY(-8px);

  border-color: #facc15;

  box-shadow: 0 18px 35px rgba(0,0,0,.12);

}

.icon {

  width: 70px;

  height: 70px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 20px;

  background: #fef3c7;

  font-size: 42px;

  transition: .3s ease;

}

.category-card:hover .icon {

  transform: scale(1.1) rotate(5deg);

}

.category-card h3 {

  font-size: 20px;

  font-weight: 800;

  color: #111827;

  margin-bottom: 8px;

}

.category-card p {

  color: #64748b;

  font-size: 15px;

  line-height: 1.5;

}

.dark .category-card {

  background: #1f2937;

  border-color: #374151;

}

.dark .category-card h3 {

  color: white;

}

.dark .category-card p {

  color: #d1d5db;

}

.dark .icon {

  background: #374151;

}

</style>