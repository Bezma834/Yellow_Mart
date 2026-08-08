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


<div class="growth">

<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
  <polyline points="17 6 23 6 23 12"/>
</svg>
+{{stat.growth}}% growth

</div>

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



<!-- TIMELINE -->

<section class="timeline">

<h2>Our Journey</h2>

<div class="timeline-items">

<div class="tl-item" v-for="(item, i) in milestones" :key="i">

<div class="tl-dot"></div>

<div class="tl-card">

<div class="tl-year">{{ item.year }}</div>

<h3>{{ item.title }}</h3>

<p>{{ item.desc }}</p>

</div>

</div>

</div>

</section>



<!-- TEAM -->

<section class="team">

<h2>Meet Our Team</h2>

<div class="team-grid">

<div class="team-card" v-for="member in team" :key="member.name">

<div class="avatar">{{ member.initials }}</div>

<h3>{{ member.name }}</h3>

<p class="role">{{ member.role }}</p>

<p class="bio">{{ member.bio }}</p>

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



const statsSection = ref<HTMLElement | null>(null)



const stats = ref([

  {
    label:"Businesses Listed",
    target:5000,
    current:0,
    progress:0,
    growth:35
  },


  {
    label:"Happy Customers",
    target:25000,
    current:0,
    progress:0,
    growth:42
  },


  {
    label:"Cities Covered",
    target:50,
    current:0,
    progress:0,
    growth:28
  },


  {
    label:"Services Available",
    target:300,
    current:0,
    progress:0,
    growth:31
  }

])



const milestones = [
  {
    year: "2023",
    title: "Platform Founded",
    desc: "Yellow-Mart was founded with a mission to digitize Ethiopian local businesses."
  },
  {
    year: "2024",
    title: "Public Launch",
    desc: "We launched our platform, onboarding hundreds of businesses across major Ethiopian cities."
  },
  {
    year: "2025",
    title: "1000+ Businesses",
    desc: "Our community grew to over 1,000 active business listings with thousands of monthly visitors."
  },
  {
    year: "2026",
    title: "Expanding Reach",
    desc: "Continuing to grow with enhanced features, better search, and nationwide coverage."
  }
]

const team = [
  {
    name: "Bezawit Tenaw",
    role: "Founder & CEO",
    initials: "BT",
    bio: "Passionate about connecting Ethiopian businesses with the digital economy."
  }
]



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




onMounted(()=>{


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




/* TIMELINE */

.timeline {
  padding: 70px 8% 80px;
  text-align: center;
}

.timeline h2 {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 50px;
}

.timeline-items {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-line {
  display: none;
}

.tl-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 20px 0;
}

.tl-item:nth-child(odd) {
  flex-direction: row;
  padding-right: calc(50% + 30px);
  text-align: right;
}

.tl-item:nth-child(even) {
  flex-direction: row-reverse;
  padding-left: calc(50% + 30px);
  text-align: left;
}

.tl-dot {
  position: absolute;
  left: 50%;
  top: 28px;
  width: 18px;
  height: 18px;
  background: var(--color-primary);
  border: 4px solid var(--color-bg-secondary);
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.tl-card {
  background: var(--color-surface);
  padding: 22px 28px;
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  width: 100%;
  transition: all var(--transition-base);
}

.tl-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.tl-year {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  padding: 3px 14px;
  border-radius: var(--radius-full);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.tl-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.tl-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}


/* TEAM */

.team {
  padding: 70px 8% 80px;
  text-align: center;
  background: var(--color-bg);
}

.team h2 {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 50px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  max-width: 900px;
  margin: 0 auto;
}

.team-card {
  background: var(--color-surface);
  padding: 36px 28px;
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.team-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
}

.avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
}

.team-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.team-card .role {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.team-card .bio {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
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

.tl-item:nth-child(odd),
.tl-item:nth-child(even) {
  padding: 16px 0 16px 50px;
  text-align: left;
  flex-direction: row;
}

.tl-dot {
  left: 20px;
}

.team-grid {
  grid-template-columns: 1fr;
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



.growth{

display:flex;

align-items:center;

justify-content:center;

gap:6px;

color:var(--color-secondary);

font-weight:700;

font-size:14px;

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
:root.dark .growth {
  color: var(--color-secondary);
}
:root.dark .tl-dot {
  border-color: var(--color-dark-bg);
}
:root.dark .tl-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .tl-year {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-primary);
}
:root.dark .tl-card h3 {
  color: var(--color-text-primary);
}
:root.dark .tl-card p {
  color: var(--color-text-secondary);
}
:root.dark .team {
  background: var(--color-dark-bg-secondary);
}
:root.dark .team h2 {
  color: var(--color-text-primary);
}
:root.dark .team-card {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .team-card h3 {
  color: var(--color-text-primary);
}
:root.dark .team-card .bio {
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
