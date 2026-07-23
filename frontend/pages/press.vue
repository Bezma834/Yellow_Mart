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
📰 Company Information
</h3>


<p>

Basic information about Yellow-Mart,
our mission, and our vision.

</p>


</div>





<div class="resource-card">


<h3>
📸 Brand Assets
</h3>


<p>

Official logos and visual materials
will be available soon.

</p>


</div>





<div class="resource-card">


<h3>
📄 Press Kit
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
🌍
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
💻
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
🤝
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

background:#f8fafc;

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

background:#facc15;

color:#0f172a;

padding:15px 35px;

border-radius:30px;

font-weight:900;

text-decoration:none;

transition:.3s;


}



.press-btn:hover,
.contact-btn:hover{


background:#eab308;

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

color:#64748b;


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

color:#64748b;

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


background:white;

padding:35px;

border-radius:20px;

box-shadow:
0 15px 30px
rgba(0,0,0,.08);


}





.resource-card h3{


color:#0f172a;


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


background:#1e293b;

padding:35px;

border-radius:20px;


}




.highlight-grid span{


font-size:40px;

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