<template>

<div class="press-page">


<!-- HERO -->

<section class="press-hero">


<img
src="/press.jpg"
class="hero-image"
/>


<div class="overlay"></div>


<div class="hero-content">


<h1>

Yellow-Mart
<span>
Press Center
</span>

</h1>


<p>

News, company information, and media resources
about Ethiopia's growing business discovery platform.

</p>


<a
href="mailto:bezawittenaw0@gmail.com?subject=Yellow-Mart Press Inquiry"
class="press-btn"
>

Contact Press Team

</a>


</div>


</section>









<!-- ABOUT PRESS -->


<section class="about-press">


<h2>
About Yellow-Mart
</h2>


<p>

Yellow-Mart is a digital business directory platform
that helps customers discover restaurants, shops,
services, and local businesses across Ethiopia.

We connect businesses with customers through
technology, visibility, and easy online discovery.

</p>


</section>









<!-- STORY -->


<section class="story">


<div class="story-image">


<img
src="/business-growth.jpg"
/>


</div>





<div class="story-content">


<h2>
Our Story
</h2>


<p>

Yellow-Mart was created with a simple goal:
to make finding local businesses easier while
helping Ethiopian businesses build their online
presence.

</p>


<p>

We believe every business deserves to be
discovered by the right customers.

</p>


</div>


</section>









<!-- PRESS INFO -->


<section class="press-info">


<h2>
Media Resources
</h2>



<div class="resource-grid">



<div class="resource-card">


<h3>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
  <path d="M18 14h-8"/>
  <path d="M15 18h-5"/>
  <path d="M10 6h8v4h-8V6z"/>
</svg>
Company Information
</h3>


<p>

Basic information about Yellow-Mart,
our mission, and our vision.

</p>


</div>


<div class="resource-card">


<h3>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <circle cx="8.5" cy="8.5" r="1.5"/>
  <polyline points="21 15 16 10 5 21"/>
</svg>
Brand Assets
</h3>


<p>

Official logos and visual materials
will be available soon.

</p>


</div>





<div class="resource-card">


<h3>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
  <polyline points="10 9 9 9 8 9"/>
</svg>
Press Kit
</h3>


<p>

Our official press kit is currently
being prepared.

</p>


</div>



</div>



</section>









<!-- HIGHLIGHTS -->


<section class="highlights">


<h2>
Why Yellow-Mart Matters
</h2>



<div class="highlight-grid">


<div>

<span>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20"/>
  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
</svg>
</span>

<h3>
Local Impact
</h3>

<p>
Supporting Ethiopian businesses online.
</p>

</div>




<div>

<span>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
  <line x1="8" y1="21" x2="16" y2="21"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
</svg>
</span>

<h3>
Technology
</h3>

<p>
Building simple digital solutions.
</p>

</div>




<div>

<span>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>
</span>

<h3>
Community
</h3>

<p>
Connecting customers and businesses.
</p>

</div>



</div>


</section>









<!-- CONTACT -->


<section class="contact">


<h2>

Media Contact

</h2>


<p>

For interviews, partnerships, or press questions:

</p>



<a
href="mailto:bezawittenaw0@gmail.com?subject=Yellow-Mart Media Request"
class="contact-btn"
>

bezawittenaw0@gmail.com

</a>



</section>





</div>

</template>






<script setup lang="ts">


</script>







<style scoped>


.press-page{

background:var(--color-bg-secondary);

}






/* HERO */


.press-hero{


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
rgba(15,23,42,.6);

}




.hero-content{


position:relative;

z-index:2;

color:white;

text-align:center;

max-width:850px;

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

margin:25px 0;

}





.press-btn,
.contact-btn{


display:inline-block;

background:var(--color-primary);

color:var(--color-text-primary);

padding:15px 35px;

border-radius:30px;

font-weight:900;

text-decoration:none;

transition:.3s;


}



.press-btn:hover,
.contact-btn:hover{


background:var(--color-primary-hover);

transform:translateY(-5px);


}









/* ABOUT */


.about-press{


padding:70px 10%;

text-align:center;

}



.about-press h2{


font-size:40px;

}



.about-press p{


max-width:850px;

margin:auto;

font-size:18px;

line-height:1.8;

color:var(--color-text-tertiary);


}








/* STORY */


.story{


padding:60px 8%;

display:grid;

grid-template-columns:1fr 1fr;

gap:50px;

align-items:center;


}




.story-image img{


width:100%;

border-radius:25px;

}



.story-content h2{


font-size:40px;

}



.story-content p{


font-size:18px;

color:var(--color-text-tertiary);

line-height:1.7;


}









/* RESOURCES */


.press-info{


padding:70px 8%;

text-align:center;


}



.resource-grid{


display:grid;

grid-template-columns:
repeat(3,1fr);

gap:25px;

margin-top:40px;


}




.resource-card{


background:var(--color-surface);

padding:35px;

border-radius:20px;

box-shadow:
0 15px 30px
rgba(0,0,0,.08);


}





.resource-card h3{


display:flex;

align-items:center;

justify-content:center;

gap:8px;

color:var(--color-text-primary);


}








/* HIGHLIGHTS */


.highlights{


background:#0f172a;

padding:70px 8%;

color:white;

text-align:center;


}




.highlight-grid{


display:grid;

grid-template-columns:
repeat(3,1fr);

gap:25px;

margin-top:40px;


}




.highlight-grid div{


background:var(--color-dark-bg-secondary);

padding:35px;

border-radius:20px;


}




.highlight-grid span{


display:flex;

align-items:center;

justify-content:center;

color:var(--color-primary);

}







/* CONTACT */


.contact{


padding:70px;

text-align:center;


}



.contact h2{


font-size:40px;


}





@media(max-width:900px){


.story,
.resource-grid,
.highlight-grid{


grid-template-columns:1fr;


}



.hero-content h1{


font-size:35px;


}


}



</style>

<style>
:root.dark .press-page {
  background: var(--color-dark-bg);
}
:root.dark .about-press p {
  color: var(--color-text-secondary);
}
:root.dark .story-content p {
  color: var(--color-text-secondary);
}
:root.dark .resource-card {
  background: var(--color-dark-surface);
}
:root.dark .resource-card h3 {
  color: var(--color-text-primary);
}
:root.dark .press-btn,
:root.dark .contact-btn {
  color: var(--color-dark-bg);
}
:root.dark .highlights {
  background: var(--color-dark-bg-secondary);
}
</style>