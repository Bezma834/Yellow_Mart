<template>

<div class="careers-page">


<!-- HERO -->

<section class="career-hero">


<img
src="/yellow-team.jpg"
class="hero-image"
/>


<div class="overlay"></div>


<div class="hero-content">


<h1>

Build The Future
<span>
With Yellow-Mart
</span>

</h1>


<p>

Join our team and help connect Ethiopian
businesses with millions of customers.

</p>


<a
href="mailto:bezawittenaw0@gmail.com?subject=Yellow-Mart Career Application"
class="apply-btn"
>

Apply Now

</a>


</div>


</section>








<!-- INTRO -->


<section class="intro">


<h2>
Why Work With Yellow-Mart?
</h2>


<p>

We are building a digital platform that helps
customers discover local businesses and helps
businesses grow online.

</p>


</section>









<!-- CULTURE -->


<section class="culture">


<div class="culture-card">


<h3>
🚀 Innovation
</h3>


<p>

Work on modern technology and solve
real problems for businesses.

</p>


</div>





<div class="culture-card">


<h3>
🤝 Team Work
</h3>


<p>

Collaborate with creative people and
build meaningful products.

</p>


</div>






<div class="culture-card">


<h3>
📚 Learning
</h3>


<p>

Grow your skills through real projects
and experiences.

</p>


</div>



</section>









<!-- OPEN POSITIONS -->


<section class="jobs">


<h2>
Open Opportunities
</h2>




<div class="job-list">



<div class="job-card">


<h3>
Frontend Developer Intern
</h3>


<p>

Work with Vue, Nuxt, TypeScript and
modern UI development.

</p>


<span>
Technology Team
</span>


</div>





<div class="job-card">


<h3>
Backend Developer Intern
</h3>


<p>

Help build APIs, databases and
backend services.

</p>


<span>
Engineering Team
</span>


</div>







<div class="job-card">


<h3>
Digital Marketing Intern
</h3>


<p>

Create content and help businesses
grow their online presence.

</p>


<span>
Marketing Team
</span>


</div>




</div>


</section>









<!-- VALUES -->


<section class="values">


<h2>
Our Values
</h2>



<div class="value-grid">


<div>
⭐ Customer First
</div>


<div>
💡 Creativity
</div>


<div>
🔥 Passion
</div>


<div>
🌍 Local Impact
</div>


</div>



</section>









<!-- CTA -->


<section class="cta">


<h2>

Ready To Join Yellow-Mart?

</h2>


<p>

Send us your application and become part
of our growing team.

</p>



<a
href="mailto:bezawittenaw0@gmail.com?subject=Yellow-Mart Career Application"
class="cta-btn"
>

Send Application

</a>


</section>






</div>

</template>







<script setup lang="ts">

</script>







<style scoped>


.careers-page{

background:#f8fafc;

}





/* HERO */


.career-hero{


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







.apply-btn,
.cta-btn{


display:inline-block;

background:#facc15;

color:#0f172a;

padding:15px 40px;

border-radius:30px;

font-weight:900;

text-decoration:none;

transition:.3s;

}



.apply-btn:hover,
.cta-btn:hover{

background:#eab308;

transform:translateY(-5px);

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

font-size:18px;

color:#64748b;

max-width:800px;

margin:auto;

}









/* CULTURE */


.culture{


padding:40px 8%;


display:grid;

grid-template-columns:
repeat(3,1fr);

gap:25px;


}



.culture-card{


background:white;

padding:35px;

border-radius:20px;

box-shadow:
0 15px 30px
rgba(0,0,0,.08);


transition:.3s;


}



.culture-card:hover{

transform:translateY(-8px);

}








/* JOBS */


.jobs{


padding:70px 8%;

text-align:center;


}



.job-list{


display:grid;

grid-template-columns:
repeat(3,1fr);

gap:25px;

margin-top:40px;

}



.job-card{


background:white;

padding:35px;

border-radius:20px;

text-align:left;

box-shadow:
0 10px 25px
rgba(0,0,0,.08);


}



.job-card span{


display:inline-block;

margin-top:15px;

background:#fef3c7;

color:#92400e;

padding:7px 15px;

border-radius:20px;

font-weight:700;


}








/* VALUES */


.values{


background:#0f172a;

padding:60px 8%;

color:white;

text-align:center;


}



.value-grid{


display:grid;

grid-template-columns:
repeat(4,1fr);

gap:20px;

margin-top:40px;

}



.value-grid div{


background:#1e293b;

padding:25px;

border-radius:15px;

font-weight:800;


}









/* CTA */


.cta{


padding:70px;

text-align:center;


}



.cta h2{

font-size:40px;

}






@media(max-width:900px){


.culture,
.job-list,
.value-grid{

grid-template-columns:1fr;

}



.hero-content h1{

font-size:35px;

}


}



</style>