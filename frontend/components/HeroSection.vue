<template>
  <section class="hero">

    <!-- Background Video -->
    <video
  ref="heroVideo"
  class="hero-video"
  autoplay
  muted
  loop
  playsinline
  preload="auto"
  @ended="restartVideo"
>
  <source src="/videos/hero-loop-web.mp4" type="video/mp4">
</video>

    <!-- Dark Overlay -->
    <div class="hero-overlay"></div>

    <!-- Existing Content -->
    <div class="hero-content">

      <h1 class="hero-title">
        Find the Best
        <span class="highlight">
          Businesses
        </span>
        Across Ethiopia
      </h1>

      <p class="hero-subtitle">
        Discover restaurants, shops, services, and local businesses near you.
      </p>

      <!-- SEARCH BAR -->
      <div class="hero-search">

        <input
          v-model="searchQuery"
          type="text"
          placeholder="What are you looking for? (e.g., Tomoca, Edna Mall...)"
          @keyup.enter="handleSearch"
        />

        <button @click="handleSearch">
          Search 🔍
        </button>

      </div>

    </div>

  </section>
</template>


<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const searchQuery = ref("")

const heroVideo = ref<HTMLVideoElement | null>(null)


const handleSearch = () => {

  if(searchQuery.value.trim()) {

    router.push(
      `/search?q=${encodeURIComponent(searchQuery.value.trim())}`
    )

  }

}



onMounted(() => {
  if (heroVideo.value) {

    heroVideo.value.play()

    heroVideo.value.addEventListener("ended", () => {

      if (heroVideo.value) {
        heroVideo.value.currentTime = 0
        heroVideo.value.play()
      }

    })

  }
})
onMounted(async () => {

  if(heroVideo.value){

    heroVideo.value.playbackRate = 1.3

    try {

      await heroVideo.value.play()

      console.log("Hero video playing")

    } catch(error){

      console.log("Video play failed", error)

    }

  }

})

</script>

<style scoped>

.hero{

height:75vh;

width:100%;

position:relative;

display:flex;

justify-content:center;

align-items:center;

overflow:hidden;

padding-top:80px;

}


/* Background Video */
.hero-video {

  position:absolute;

  top:0;
  left:0;

  width:100%;
  height:100%;

  object-fit:cover;

  z-index:0;

 
}


/* Dark Overlay */
.hero-overlay {

  position:absolute;

  inset:0;

  background:rgba(15,23,42,0.20);

  z-index:1;

}


/* Content */

.hero-content{

position:relative;

z-index:2;

text-align:center;

color:white;

max-width:800px;

padding:20px;

}


.hero-title{

font-size:3.5rem;

font-weight:900;

letter-spacing:-1px;

line-height:1.2;

margin-bottom:15px;

}


.highlight{

color:#facc15;

}


.hero-subtitle{

font-size:1.25rem;

color:#cbd5e1;

font-weight:500;

margin-bottom:35px;

}


/* Search */

.hero-search{

display:flex;

overflow:hidden;

border-radius:50px;

background:white;

box-shadow:
0 10px 30px rgba(0,0,0,.25),
0 0 40px rgba(250,204,21,.15);

border:1px solid rgba(255,255,255,.1);

}


.hero-search input{

flex:1;

width:450px;

border:none;

outline:none;

padding:16px 25px;

font-size:16px;

color:#0f172a;

}


.hero-search button{

border:none;

background:#facc15;

color:#0f172a;

padding:0 30px;

font-weight:700;

font-size:16px;

cursor:pointer;

transition:.25s;

}


.hero-search button:hover{

background:#eab308;



}


/* Mobile */

@media (max-width:640px){

.hero{

height:90vh;

}

.hero-title{

font-size:2.5rem;

}

.hero-search{

flex-direction:column;

border-radius:20px;

background:transparent;

box-shadow:none;

gap:10px;

}

.hero-search input{

width:100%;

border-radius:30px;

padding:14px 20px;

}

.hero-search button{

width:100%;

padding:14px;

border-radius:30px;

}

}


</style>