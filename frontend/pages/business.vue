<script setup lang="ts">
import { ref, computed } from "vue"

interface MarketItem {
  marketName: string
  location: string
  category: string
  products: string
  status: "approved" | "pending"
}

const userRole = ref<"buyer" | "seller">("seller")

const showForm = ref(false)

const markets = ref<MarketItem[]>([
  {
    marketName: "Addis Tech Store",
    location: "Addis Ababa",
    category: "Electronics",
    products: "Phones, Laptops",
    status: "approved"
  },
  {
    marketName: "Fashion Hub",
    location: "Bole",
    category: "Fashion",
    products: "Shoes, Clothes",
    status: "approved"
  }
])

const marketName = ref("")
const location = ref("")
const category = ref("")
const products = ref("")

const addItem = () => {
  if (!marketName.value || !location.value || !category.value || !products.value)
    return

  markets.value.push({
    marketName: marketName.value,
    location: location.value,
    category: category.value,
    products: products.value,
    status: "pending"
  })

  marketName.value = ""
  location.value = ""
  category.value = ""
  products.value = ""

  showForm.value = false
}

const visibleMarkets = computed(() => {
  return markets.value.filter(m => m.status === "approved")
})
</script>

<template>
  <div class="page">

    <!-- TOP BAR -->
    <div class="top-bar">
      <h1>🟡 E-Market Marketplace</h1>

      <button
        v-if="userRole === 'seller'"
        class="add-btn"
        @click="showForm = !showForm"
      >
        + Add Item
      </button>
    </div>

    <!-- FORM -->
    <div v-if="showForm" class="form-box">
      <h2>Add Marketplace</h2>

      <input v-model="marketName" placeholder="Marketplace Name" />
      <input v-model="location" placeholder="Location" />
      <input v-model="category" placeholder="Category" />
      <textarea v-model="products" placeholder="What do they sell?" />

      <button @click="addItem">
        Submit for Approval
      </button>
    </div>

    <!-- LIST -->
    <h2 class="section-title">Available Marketplaces</h2>

    <div class="market-grid">
      <div
        v-for="(market, index) in visibleMarkets"
        :key="index"
        class="market-card"
      >
        <h3>{{ market.marketName }}</h3>
        <p>📍 {{ market.location }}</p>
        <p>🏪 {{ market.category }}</p>
        <p>🛍 {{ market.products }}</p>

        <span class="approved">Approved</span>

        <NuxtLink :to="`/market/${index + 1}`">
          <button class="view-btn">
            View Details
          </button>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  background: #facc15;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.form-box {
  background: white;
  max-width: 500px;
  margin: 30px auto;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-box input,
.form-box textarea {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-box button {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border: none;
  background: #111827;
  color: white;
  border-radius: 10px;
}

.market-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.market-card {
  width: 300px;
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.view-btn {
  margin-top: 10px;
  padding: 10px 14px;
  border: none;
  background: #111827;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.approved {
  color: green;
  font-weight: bold;
}
</style>