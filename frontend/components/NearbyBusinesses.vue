<script setup lang="ts">

import { ref, onMounted } from "vue"
import { fetchBusinesses } from "~/composables/useBusinesses"

const allBusinesses = ref<any[]>([])
const nearbyBusinesses = ref<any[]>([])

const loading = ref(true)
const locationError = ref("")

const radius = ref(5)

const userLat = ref<number | null>(null)
const userLng = ref<number | null>(null)

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {

  const R = 6371

  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +

    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )

  return R * c

}

const filterBusinesses = () => {

  if (
    userLat.value === null ||
    userLng.value === null
  ) return

  nearbyBusinesses.value =

    allBusinesses.value

      .filter(
        business =>
          business.lat != null &&
          business.lng != null
      )

      .map(business => ({

        ...business,

        distance: calculateDistance(

          userLat.value!,

          userLng.value!,

          Number(business.lat),

          Number(business.lng)

        )

      }))

      .filter(
        business =>
          business.distance <= radius.value
      )

      .sort(
        (a, b) =>
          a.distance - b.distance
      )

      .slice(0, 6)

}

const changeRadius = (
  value: number
) => {

  radius.value = value

  filterBusinesses()

}

const loadNearbyBusinesses = async () => {

  try {

    allBusinesses.value =
      await fetchBusinesses(false)

    if (!navigator.geolocation) {

      locationError.value =
        "Your browser does not support location."

      loading.value = false

      return

    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        userLat.value =
          position.coords.latitude

        userLng.value =
          position.coords.longitude

        filterBusinesses()

        loading.value = false

      },

      () => {

        locationError.value =
          "Please allow location access."

        loading.value = false

      }

    )

  }

  catch (error) {

    console.error(error)

    loading.value = false

  }

}

onMounted(() => {

  loadNearbyBusinesses()

})

</script>
<template>

<section class="nearby-section">

  <div class="container">

    <div class="header">

      <h2>
        📍 Businesses Near You
      </h2>

      <div class="radius-buttons">

        <button
          :class="{ active: radius === 2 }"
          @click="changeRadius(2)"
        >
          2 km
        </button>

        <button
          :class="{ active: radius === 5 }"
          @click="changeRadius(5)"
        >
          5 km
        </button>

        <button
          :class="{ active: radius === 10 }"
          @click="changeRadius(10)"
        >
          10 km
        </button>

        <button
          :class="{ active: radius === 20 }"
          @click="changeRadius(20)"
        >
          20 km
        </button>

      </div>

    </div>


    <div
      v-if="loading"
      class="loading"
    >

      Loading nearby businesses...

    </div>


    <div
      v-else-if="locationError"
      class="error"
    >

      {{ locationError }}

    </div>


    <div
      v-else-if="nearbyBusinesses.length === 0"
      class="empty"
    >

      No businesses found within {{ radius }} km.

    </div>


    <div
      v-else
      class="business-grid"
    >

      <div
        v-for="business in nearbyBusinesses"
        :key="business.id"
        class="business-item"
      >

        <BusinessCard
          :business="business"
        />

        <p class="distance">

          📍 {{ business.distance.toFixed(1) }} km away

        </p>

      </div>

    </div>

  </div>

</section>

</template>
<style scoped>

.nearby-section {

  padding: 60px 20px;

}


.container {

  max-width: 1200px;

  margin: auto;

}


.header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  flex-wrap: wrap;

  margin-bottom: 30px;

}


h2 {

  font-size: 32px;

  font-weight: 800;

}


.radius-buttons {

  display: flex;

  gap: 10px;

  flex-wrap: wrap;

}


.radius-buttons button {

  padding: 10px 18px;

  border-radius: 20px;

  border: none;

  background: #e5e7eb;

  cursor: pointer;

  font-weight: 600;

  transition: 0.3s;

}


.radius-buttons button:hover {

  background: #d1d5db;

}


.radius-buttons button.active {

  background: #facc15;

  color: black;

}


.business-grid {

  display: grid;

  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  );

  gap: 25px;

}


.business-item {

  position: relative;

}


.distance {

  margin-top: 10px;

  color: #64748b;

  font-size: 14px;

}


.loading,
.error,
.empty {

  text-align: center;

  padding: 40px;

  font-size: 18px;

}


@media(max-width:768px){

  .header {

    flex-direction: column;

    align-items: flex-start;

  }


  h2 {

    font-size: 26px;

  }

}

</style>