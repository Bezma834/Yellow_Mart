<template>

<div class="about-page">


<!-- HERO -->

<section class="about-hero">

<img
src="/yellow-city.jpg"
class="hero-image"
/>


<div class="hero-overlay"></div>


<div class="hero-content">

<h1>
Connecting Ethiopia's
<span>
Businesses
</span>
with People
</h1>


<p>
Yellow-Mart helps customers discover trusted restaurants,
shops, and services across Ethiopia.
</p>

</div>

</section>




<!-- STATS -->

<section
ref="statsSection"
class="stats-section"
>


<div
class="stat-card"
v-for="stat in stats"
:key="stat.label"
>


<div class="growth-number">

{{stat.current.toLocaleString()}}

<span>+</span>

</div>


<div class="growth-line">

<div
class="growth-fill"
:style="{width: stat.progress + '%'}"
>
</div>

</div>


<p>
{{stat.label}}
</p>


</div>


</section>



<!-- MISSION & VISION -->

<section class="mission-vision">

<div class="mv-card mission">

<h3>Our Mission</h3>

<p>
To empower Ethiopian businesses with a digital presence
that connects them to the communities they serve,
driving local economic growth and making discovery effortless
for every customer.
</p>

</div>

<div class="mv-card vision">

<h3>Our Vision</h3>

<p>
To become Ethiopia's most trusted business discovery platform
— where every local business is just a click away
and every customer finds exactly what they need,
right in their neighborhood.
</p>

</div>

</section>



<!-- ABOUT -->

<section class="about-content">


<div class="about-text">


<h2>
About Yellow-Mart
</h2>


<p>

Yellow-Mart is a digital business directory
designed to connect Ethiopian customers
with local businesses easily.

</p>


<p>

Our goal is to make finding restaurants,
shops, hotels, and services faster and easier.

</p>

</div>




<div class="about-image">

<img
src="/business-team.jpg"
/>

</div>



</section>




<!-- WHY US -->


<section class="why">


<h2>
Why Choose Yellow-Mart?
</h2>



<div class="cards">


<div class="card">

<div class="card-icon">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 21h18"/>
  <path d="M5 21V7l7-4 7 4v14"/>
  <path d="M9 21v-6h6v6"/>
</svg>
</div>

<h3>
Local Businesses
</h3>

<p>
Discover trusted businesses near you.
</p>

</div>



<div class="card">

<div class="card-icon">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
</svg>
</div>

<h3>
Easy Search
</h3>

<p>
Find products and services quickly.
</p>

</div>




<div class="card">

<div class="card-icon">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
</div>

<h3>
Trusted Platform
</h3>

<p>
Helping customers and businesses grow.
</p>

</div>

</div>

</section>



<!-- VALUES -->

<section class="values">

<h2>Our Values</h2>

<p class="values-sub">
What drives us every day as we build Yellow-Mart.
</p>

<div class="cards">

<div class="card">

<div class="card-icon">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/>
  <path d="m9 12 2 2 4-4"/>
</svg>
</div>

<h3>Trust</h3>

<p>
We help people discover businesses they can rely on.
</p>

</div>



<div class="card">

<div class="card-icon">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>
</div>

<h3>Community</h3>

<p>
Supporting local businesses and the neighborhoods they serve.
</p>

</div>



<div class="card">

<div class="card-icon">
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M22 7 13.5 15.5 8.5 10.5 2 17"/>
  <path d="M16 7h6v6"/>
</svg>
</div>

<h3>Growth</h3>

<p>
Helping Ethiopian businesses grow and reach more customers.
</p>

</div>

</div>

</section>



<!-- HOW IT WORKS -->

<section class="how-it-works">

<h2>How It Works</h2>

<div class="hiw-grid">

<div class="hiw-card">

<div class="hiw-number">1</div>

<h3>Search</h3>

<p>
Find businesses, services, and products across Ethiopia in seconds.
</p>

</div>

<div class="hiw-card">

<div class="hiw-number">2</div>

<h3>Compare</h3>

<p>
Browse descriptions, locations, and contact details to pick what fits you best.
</p>

</div>

<div class="hiw-card">

<div class="hiw-number">3</div>

<h3>Connect</h3>

<p>
Contact the business directly and support your local economy.
</p>

</div>

</div>

</section>



<!-- CTA -->

<section class="cta">


<h2>
Grow Your Business With Us
</h2>


<p>
Join Yellow-Mart and reach more customers.
</p>


<div class="cta-actions">

<NuxtLink
to="/add-business"
class="cta-btn primary"
>
  Add Your Business
</NuxtLink>

<NuxtLink
to="/businesses"
class="cta-btn secondary"
>
  Browse Listings
</NuxtLink>

</div>

</section>



</div>

</template>


<script setup lang="ts">

import {
  ref,
  onMounted
} from "vue"
import { GET_ABOUT_STATS } from "~/graphql/queries"


const statsSection = ref<HTMLElement | null>(null)


const stats = ref([

  {
    label:"Businesses Listed",
    target:0,
    current:0,
    progress:0
  },


  {
    label:"Happy Customers",
    target:0,
    current:0,
    progress:0
  },


  {
    label:"Cities Covered",
    target:0,
    current:0,
    progress:0
  },


  {
    label:"Categories Available",
    target:0,
    current:0,
    progress:0
  }

])


const loadStats = async () => {

  try {

    const { $apollo } = useNuxtApp() as any

    const { data } = await $apollo.query({
      query: GET_ABOUT_STATS
    })

    const approvedCount =
      data.businesses_aggregate?.aggregate?.count ?? 0

    const distinctCities =
      new Set(
        (data.cities || [])
          .map((b: any) => b?.city)
          .filter((c: unknown): c is string =>
            typeof c === "string" && c.trim() !== ""
          )
          .map((c: string) => c.trim().toLowerCase())
      ).size

    stats.value = [
      {
        label: "Businesses Listed",
        target: approvedCount,
        current: 0,
        progress: 0
      },
      {
        label: "Happy Customers",
        target: data.users_aggregate?.aggregate?.count ?? 0,
        current: 0,
        progress: 0
      },
      {
        label: "Cities Covered",
        target: distinctCities,
        current: 0,
        progress: 0
      },
      {
        label: "Categories Available",
        target: data.categories_aggregate?.aggregate?.count ?? 0,
        current: 0,
        progress: 0
      }
    ]

  } catch (err) {

    console.error("About stats error:", err)

  }

}



const animateNumbers = () => {


  stats.value.forEach((stat)=>{


    let start = 0


    const duration = 2500


    const step =
      stat.target / (duration / 16)



    const timer = setInterval(()=>{


      start += step



      if(start >= stat.target){


        stat.current =
          stat.target


        stat.progress =
          100


        clearInterval(timer)


      }

      else{


        stat.current =
          Math.floor(start)


        stat.progress =
          (start / stat.target) * 100


      }


    },16)



  })





}




onMounted(async () => {

  await loadStats()


  if(!statsSection.value)
    return


  const observer =
    new IntersectionObserver(

      (entries)=>{


        if(entries[0].isIntersecting){


          animateNumbers()


          observer.disconnect()


        }


      },

      {
        threshold:0.5
      }

    )


  observer.observe(statsSection.value)



})


</script>




<style scoped>


.about-page{

background:var(--color-bg-secondary);

}


/* HERO */


.about-hero{

height:75vh;

position:relative;

display:flex;

align-items:center;

justify-content:center;

overflow:hidden;

}

.hero-image{

position:absolute;

width:100%;

height:100%;

object-fit:cover;

}



.hero-overlay{

position:absolute;

inset:0;

background:
linear-gradient(
rgba(15,23,42,.65),
rgba(15,23,42,.45)
);

}



.hero-content{

position:relative;

z-index:2;

text-align:center;

color:white;

max-width:800px;

padding:20px;

}



.hero-content h1{

font-size:55px;

font-weight:900;

color:#ffffff;

}



.hero-content span{

color:var(--color-primary);

}



.hero-content p{

font-size:20px;

color:rgba(255,255,255,0.92);

}




/* STATS */


.stats-section{

display:grid;

grid-template-columns:
repeat(4,1fr);

gap:25px;

padding:70px 8%;

}



.stat-card{

background:var(--color-surface);

padding:35px;

border-radius:20px;

text-align:center;

box-shadow:
0 15px 30px
rgba(0,0,0,.08);

transition:.3s;

}



.stat-card:hover{

transform:translateY(-10px);

}



.stat-card h2{

font-size:45px;

font-weight:900;

color:var(--color-primary);

}



.stat-card p{

color:var(--color-text-secondary);

font-weight:600;

}



/* MISSION & VISION */

.mission-vision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 10px 8% 70px;
}

.mv-card {
  padding: 40px 36px;
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.mv-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.mv-card.mission {
  background: linear-gradient(135deg, var(--color-primary-lighter), var(--color-surface));
  border: 1px solid var(--color-primary-light);
}

.mv-card.vision {
  background: linear-gradient(135deg, var(--color-secondary-light), var(--color-surface));
  border: 1px solid #99f6e4;
}

.mv-card h3 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 16px;
}

.mv-card.mission h3 {
  color: var(--color-primary-dark);
}

.mv-card.vision h3 {
  color: var(--color-secondary);
}

.mv-card p {
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text-secondary);
}


/* ABOUT */


.about-content{

display:flex;

align-items:center;

gap:50px;

padding:70px 8%;

}



.about-text{

flex:1;

}



.about-text h2{

font-size:40px;

}



.about-text p{

font-size:18px;

line-height:1.7;

color:var(--color-text-secondary);

}



.about-image img{

width:450px;

border-radius:25px;

}




/* CARDS */


.why{

padding:70px 8%;

text-align:center;

}



.cards{

display:grid;

grid-template-columns:
repeat(3,1fr);

gap:25px;

margin-top:40px;

}



.card{

background:var(--color-surface);

padding:35px;

border-radius:20px;

box-shadow:
0 10px 25px rgba(0,0,0,.08);

}

.card-icon{

width:64px;

height:64px;

margin:0 auto 18px;

display:flex;

align-items:center;

justify-content:center;

background:
linear-gradient(
135deg,
var(--color-primary),
var(--color-primary-hover)
);

color:var(--color-text-primary);

border-radius:var(--radius-2xl);

box-shadow:
0 8px 24px -6px
var(--color-primary-glow);

}


/* CATEGORIES */

.categories {
  padding: 70px 8%;
  text-align: center;
}

.categories h2 {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 10px;
}

.categories-sub {
  color: var(--color-text-secondary);
  margin-bottom: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.category-card {
  background: var(--color-surface);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.category-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  text-decoration: none;
  color: var(--color-text-primary);
}

.category-icon {
  font-size: 26px;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-lighter), var(--color-surface));
  border-radius: 14px;
}

.category-name {
  font-weight: 600;
  font-size: 15px;
  text-align: left;
}


/* HOW IT WORKS */

.how-it-works {
  padding: 70px 8% 80px;
  text-align: center;
  background: var(--color-bg);
}

.how-it-works h2 {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 40px;
}

.hiw-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  max-width: 900px;
  margin: 0 auto;
}

.hiw-card {
  background: var(--color-surface);
  padding: 35px 30px;
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.hiw-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.hiw-number {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 800;
  border-radius: 50%;
  box-shadow: 0 8px 24px -6px var(--color-primary-glow);
}

.hiw-card h3 {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 8px;
}

.hiw-card p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}


/* CTA */


.cta{

background:var(--color-dark-bg);

color:white;

padding:70px;

text-align:center;

}



.cta h2{

font-size:40px;

color:var(--color-text-inverse);

}



.cta-actions {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.cta-btn{

display:inline-block;

margin-top:20px;

padding:15px 35px;

border-radius:30px;

font-weight:800;

cursor:pointer;

text-decoration:none;

transition:.3s;

}

.cta-btn.primary {
  background:var(--color-primary);

  color:var(--color-text-primary);
}

.cta-btn.primary:hover {
  transform:translateY(-5px);
  background:var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.cta-btn.secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.cta-btn.secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-5px);
}




@media(max-width:768px){


.stats-section{

grid-template-columns:1fr 1fr;

}



.about-content{

flex-direction:column;

}



.cards{

grid-template-columns:1fr;

}



.hero-content h1{

font-size:35px;

}

.mission-vision {
  grid-template-columns: 1fr;
  padding: 10px 5% 50px;
}

.hiw-grid {
  grid-template-columns: 1fr;
}

.categories-grid {
  grid-template-columns: repeat(2, 1fr);
}


}
.growth-number{

font-size:45px;

font-weight:900;

color:var(--color-primary);

}


.growth-number span{

font-size:30px;

}


.growth-line{

height:8px;

background:var(--color-border);

border-radius:20px;

overflow:hidden;

margin:20px 0;

}



.growth-fill{

height:100%;

background:
linear-gradient(
90deg,
var(--color-primary),
var(--color-secondary)
);

border-radius:20px;

transition:width .2s ease;

}

</style>

<style>
:root.dark .about-page {
  background: var(--color-dark-bg);
}
:root.dark .hero-overlay{
  background:
  linear-gradient(
    rgba(11,17,33,.85),
    rgba(11,17,33,.65)
  );
}
:root.dark .hero-content span {
  color: var(--color-primary);
}
:root.dark .stat-card {
  background: var(--color-dark-surface);
}
:root.dark .stat-card p {
  color: var(--color-text-secondary);
}
:root.dark .stat-card h2 {
  color: var(--color-primary);
}
:root.dark .mv-card.mission {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), var(--color-dark-surface));
  border-color: rgba(245, 158, 11, 0.2);
}
:root.dark .mv-card.vision {
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.08), var(--color-dark-surface));
  border-color: rgba(13, 148, 136, 0.2);
}
:root.dark .mv-card.mission h3 {
  color: var(--color-primary);
}
:root.dark .mv-card.vision h3 {
  color: #2dd4bf;
}
:root.dark .mv-card p {
  color: var(--color-text-secondary);
}
:root.dark .about-text p {
  color: var(--color-text-secondary);
}
:root.dark .card {
  background: var(--color-dark-surface);
}
:root.dark .why h2 {
  color: var(--color-text-primary);
}
:root.dark .growth-number {
  color: var(--color-primary);
}
:root.dark .growth-line {
  background: var(--color-dark-border);
}
:root.dark .categories h2 {
  color: var(--color-text-primary);
}
:root.dark .categories-sub {
  color: var(--color-text-secondary);
}
:root.dark .category-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .category-link {
  color: var(--color-text-primary);
}
:root.dark .category-icon {
  background: rgba(245, 158, 11, 0.12);
}
:root.dark .how-it-works {
  background: var(--color-dark-bg-secondary);
}
:root.dark .how-it-works h2 {
  color: var(--color-text-primary);
}
:root.dark .hiw-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .hiw-card h3 {
  color: var(--color-text-primary);
}
:root.dark .hiw-card p {
  color: var(--color-text-secondary);
}
:root.dark .cta {
  background: var(--color-dark-bg-secondary);
}
:root.dark .cta h2 {
  color: var(--color-text-primary);
}
:root.dark .cta p {
  color: var(--color-text-secondary);
}
:root.dark .cta-btn.secondary {
  border-color: rgba(255,255,255,0.15);
  color: var(--color-text-primary);
}
:root.dark .cta-btn.secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
