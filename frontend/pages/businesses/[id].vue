<template>

  <div class="page">

    <button
      class="back-btn"
      @click="goBack"
    >
      ← Back
    </button>

    <div
      v-if="business"
      class="business-card"
    >

      <img
        :src="business.image || '/default-business.jpg'"
        class="business-image"
      />

      <div class="content">

        <h1>
          {{ business.name }}
        </h1>

        <p class="category">
          🏷️
          {{ business.category?.name || "Category" }}
        </p>

        <p>
          📍 {{ business.city }}
        </p>

        <p>
          🏠 {{ business.address }}
        </p>

        <p>
          ☎️ {{ business.phone }}
        </p>

        <p class="description">
          {{ business.description }}
        </p>

        <button
          class="contact-btn"
          @click="callBusiness"
        >
          📞 Contact Business
        </button>

      </div>

    </div>

    <div
      v-else
      class="loading"
    >
      Loading business...
    </div>

  </div>

</template>
<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

import {
  GET_BUSINESS_BY_ID
} from "~/graphql/queries"
import { useRecentlyViewed } from "~/composables/useRecentlyViewed"


const {
 addRecentlyViewed
} = useRecentlyViewed()
const route = useRoute()
const router = useRouter()

const { $apollo } = useNuxtApp() as any

const business = ref<any>(null)

const loadBusiness = async () => {

  try {

    const { data } = await $apollo.query({

      query: GET_BUSINESS_BY_ID,

      variables: {
        id: route.params.id
      },

      fetchPolicy: "network-only"

    })

    business.value = data.businesses_by_pk

    console.log("Business:", business.value)

  } catch (error) {

    console.error("Failed to load business:", error)

  }

}

onMounted(() => {

  loadBusiness()

})

const goBack = () => {

  router.back()

}

const callBusiness = () => {

  if (business.value?.phone) {

    window.location.href = `tel:${business.value.phone}`

  }

}

</script>
<style scoped>

.page{
  min-height:100vh;
  background:#f8fafc;
  padding:100px 20px;
}

.back-btn{
  padding:12px 22px;
  background:#0f172a;
  color:white;
  border:none;
  border-radius:12px;
  cursor:pointer;
  margin-bottom:30px;
  font-weight:700;
  transition:.3s;
}

.back-btn:hover{
  background:#1e293b;
}

.business-card{
  max-width:950px;
  margin:auto;
  background:white;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

.business-image{
  width:100%;
  height:400px;
  object-fit:cover;
}

.content{
  padding:35px;
}

.content h1{
  font-size:40px;
  margin-bottom:15px;
  color:#0f172a;
}

.category{
  display:inline-block;
  background:#fef3c7;
  color:#92400e;
  padding:6px 14px;
  border-radius:20px;
  font-weight:700;
  margin-bottom:20px;
}

.content p{
  font-size:17px;
  margin:12px 0;
  color:#475569;
}

.description{
  margin-top:25px;
  line-height:1.8;
}

.contact-btn{
  margin-top:30px;
  background:#facc15;
  color:#111827;
  border:none;
  padding:14px 28px;
  border-radius:12px;
  font-size:16px;
  font-weight:700;
  cursor:pointer;
  transition:.3s;
}

.contact-btn:hover{
  transform:translateY(-2px);
  background:#eab308;
}

.loading{
  text-align:center;
  font-size:24px;
  font-weight:700;
  color:#64748b;
  padding:100px;
}

</style>