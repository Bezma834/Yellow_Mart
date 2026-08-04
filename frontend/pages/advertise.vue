<template>

<div class="advertise-page">


<!-- HERO -->

<section class="advertise-hero">

<img
src="/advertise-business.jpg"
class="hero-image"
/>


<div class="overlay"></div>


<div class="hero-content">


<h1>

Grow Your Business
<span>
With Yellow-Mart
</span>

</h1>


<p>

Connect with thousands of customers
searching for businesses across Ethiopia.

</p>


<NuxtLink
to="/add-business"
class="hero-btn"
>

List Your Business

</NuxtLink>


</div>


</section>






<!-- INTRO -->

<section class="intro">


<h2>
Why Advertise With Yellow-Mart?
</h2>


<p>

Yellow-Mart helps Ethiopian businesses
become more visible online and reach
customers who are actively looking for
products and services.

</p>


</section>







<!-- BENEFITS -->


<section class="benefits">


<div class="benefit-card">


<div class="icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
  <line x1="8" y1="11" x2="14" y2="11"/>
</svg>
</div>


<h3>
More Visibility
</h3>


<p>

Help customers discover your business
when they search for services.

</p>


</div>





<div class="benefit-card">


<div class="icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>
</div>


<h3>
Reach Local Customers
</h3>


<p>

Show your business location and details
to nearby customers.

</p>


</div>






<div class="benefit-card">


<div class="icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
</div>


<h3>
Build Trust
</h3>


<p>

Create a professional business profile
with important information.

</p>


</div>






<div class="benefit-card">


<div class="icon">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
  <polyline points="17 6 23 6 23 12"/>
</svg>
</div>


<h3>
Business Growth
</h3>


<p>

Increase your online presence and
customer opportunities.

</p>


</div>



</section>








<!-- HOW IT WORKS -->


<section class="steps">


<h2>
How It Works
</h2>



<div class="step-container">



<div class="step">

<span>
1
</span>

<h3>
Create Profile
</h3>

<p>
Add your business information.
</p>

</div>




<div class="step">

<span>
2
</span>

<h3>
Get Discovered
</h3>

<p>
Customers find your business easily.
</p>

</div>





<div class="step">

<span>
3
</span>

<h3>
Grow Together
</h3>

<p>
Build stronger customer connections.
</p>

</div>



</div>



</section>








<!-- STATS -->


<section class="growth">


<div class="growth-box">


<h2>
5000+
</h2>

<p>
Businesses Connected
</p>

</div>




<div class="growth-box">


<h2>
25K+
</h2>

<p>
Potential Customers
</p>

</div>





<div class="growth-box">


<h2>
50+
</h2>

<p>
Cities Across Ethiopia
</p>

</div>


</section>









<!-- CTA -->


<section class="cta">


<h2>

Ready To Grow Your Business?

</h2>


<p>

Join Yellow-Mart and make your business
easier to discover.

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

</script>







<style scoped>


.advertise-page{

background:var(--color-bg-secondary);

}





/* HERO */


.advertise-hero{

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



.overlay{

position:absolute;

inset:0;

background:
rgba(15,23,42,.55);

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

margin:25px 0;

color:#e2e8f0;

}




.hero-btn{

display:inline-block;

background:var(--color-primary);

color:var(--color-text-primary);

padding:15px 40px;

border-radius:30px;

font-weight:800;

text-decoration:none;

}








/* INTRO */


.intro{

padding:70px 10%;

text-align:center;

}



.intro h2{

font-size:40px;

}



.intro p{

max-width:800px;

margin:auto;

font-size:18px;

color:var(--color-text-tertiary);

}








/* BENEFITS */


.benefits{

padding:40px 8%;

display:grid;

grid-template-columns:
repeat(4,1fr);

gap:25px;

}



.benefit-card{

background:var(--color-surface);

padding:35px;

border-radius:20px;

text-align:center;

box-shadow:
0 15px 30px
rgba(0,0,0,.08);

transition:.3s;

}



.benefit-card:hover{

transform:translateY(-10px);

}



.icon{

width:64px;

height:64px;

margin:0 auto;

display:flex;

align-items:center;

justify-content:center;

background:var(--color-primary-light);

color:var(--color-primary-dark);

border-radius:var(--radius-2xl);

}



.benefit-card h3{

margin:20px 0;

}









/* STEPS */


.steps{

padding:70px 8%;

text-align:center;

}



.step-container{

display:grid;

grid-template-columns:
repeat(3,1fr);

gap:30px;

margin-top:40px;

}



.step{

background:var(--color-surface);

padding:35px;

border-radius:20px;

}



.step span{

background:var(--color-primary);

padding:15px 22px;

border-radius:50%;

font-weight:900;

font-size:25px;

}








/* GROWTH */


.growth{

background:#0f172a;

padding:60px 8%;

display:grid;

grid-template-columns:
repeat(3,1fr);

text-align:center;

}



.growth-box h2{

color:#facc15;

font-size:45px;

}



.growth-box p{

color:white;

}







/* CTA */


.cta{

padding:70px;

text-align:center;

}



.cta h2{

font-size:40px;

}



.cta-btn{

display:inline-block;

margin-top:20px;

background:var(--color-primary);

padding:15px 40px;

border-radius:30px;

font-weight:900;

text-decoration:none;

color:var(--color-text-primary);

}







@media(max-width:900px){


.benefits{

grid-template-columns:1fr 1fr;

}


.step-container{

grid-template-columns:1fr;

}


.growth{

grid-template-columns:1fr;

gap:30px;

}


.hero-content h1{

font-size:35px;

}


}



</style>

<style>
:root.dark .advertise-page {
  background: var(--color-dark-bg);
}
:root.dark .intro p {
  color: var(--color-text-secondary);
}
:root.dark .benefit-card {
  background: var(--color-dark-surface);
}
:root.dark .step {
  background: var(--color-dark-surface);
}
:root.dark .hero-btn,
:root.dark .cta-btn {
  color: var(--color-dark-bg);
}
:root.dark .growth {
  background: var(--color-dark-bg-secondary);
}
</style>