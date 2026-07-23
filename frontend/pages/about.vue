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

📈 +{{stat.growth}}% growth

</div>


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

<h3>
🏪 Local Businesses
</h3>

<p>
Discover trusted businesses near you.
</p>

</div>



<div class="card">

<h3>
🔍 Easy Search
</h3>

<p>
Find products and services quickly.
</p>

</div>




<div class="card">

<h3>
⭐ Trusted Platform
</h3>

<p>
Helping customers and businesses grow.
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


<NuxtLink
to="/add-business"
class="cta-btn"
>
  Add Your Business
</NuxtLink>


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

background:#f8fafc;

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

}



.hero-content span{

color:#facc15;

}



.hero-content p{

font-size:20px;

color:#e2e8f0;

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

background:white;

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

color:#eab308;

}



.stat-card p{

color:#64748b;

font-weight:600;

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

color:#475569;

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

background:white;

padding:35px;

border-radius:20px;

box-shadow:
0 10px 25px rgba(0,0,0,.08);

}





/* CTA */


.cta{

background:#0f172a;

color:white;

padding:70px;

text-align:center;

}



.cta h2{

font-size:40px;

}



.cta button{

margin-top:20px;

background:#facc15;

border:none;

padding:15px 35px;

border-radius:30px;

font-weight:800;

cursor:pointer;

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



}
.growth-number{

font-size:45px;

font-weight:900;

color:#eab308;

}


.growth-number span{

font-size:30px;

}


.growth-line{

height:8px;

background:#e2e8f0;

border-radius:20px;

overflow:hidden;

margin:20px 0;

}



.growth-fill{

height:100%;

background:
linear-gradient(
90deg,
#facc15,
#22c55e
);

border-radius:20px;

transition:width .2s ease;

}



.growth{

color:#16a34a;

font-weight:700;

font-size:14px;

}




.cta-btn{

display:inline-block;

margin-top:20px;

background:#facc15;

color:#0f172a;

padding:15px 35px;

border-radius:30px;

font-weight:800;

text-decoration:none;

transition:.3s;

}



.cta-btn:hover{

transform:translateY(-5px);

background:#eab308;

}

</style>