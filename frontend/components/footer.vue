<template>

<footer class="footer">

  <div class="footer-container">


    <!-- COMPANY -->
    <div class="footer-box">

      <h2 class="logo">
        🟡 Yellow Mart
      </h2>


      <p class="desc">
        Yellow Mart is Ethiopia's premier business directory,
        connecting customers with local businesses across the nation.
        Discover the best services near you.
      </p>

<!-- SOCIAL MEDIA -->

<div class="social-links">


<a 
href="https://www.facebook.com/yellowmart"
target="_blank"
aria-label="Facebook"
>
<i class="fab fa-facebook"></i>
</a>



<a 
href="https://www.instagram.com/yellowmart"
target="_blank"
aria-label="Instagram"
>
<i class="fab fa-instagram"></i>
</a>




<a 
href="https://twitter.com/yellowmart"
target="_blank"
aria-label="Twitter"
>
<i class="fab fa-twitter"></i>
</a>




<a 
href="https://www.linkedin.com/company/yellowmart"
target="_blank"
aria-label="LinkedIn"
>
<i class="fab fa-linkedin"></i>
</a>



<a 
href="https://www.youtube.com/@yellowmart"
target="_blank"
aria-label="Youtube"
>
<i class="fab fa-youtube"></i>
</a>


</div>


    </div>




    <!-- CATEGORIES -->
    <div class="footer-box">

      <h3>
        Categories
      </h3>


      <ul class="footer-list">

        <li>🍔 Restaurants</li>
        <li>🏨 Hotels</li>
        <li>🏥 Healthcare</li>
        <li>🚗 Automotive</li>
        <li>🎓 Education</li>
        <li>💰 Finance</li>

      </ul>


    </div>





    <!-- QUICK LINKS -->
    <div class="footer-box">

      <h3>
        Quick Links
      </h3>


      <ul class="footer-list">


        <li>
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </li>


        <li>
          <NuxtLink to="/about">
            About Us
          </NuxtLink>
        </li>


        <li>
          <NuxtLink to="/advertise">
            Advertise
          </NuxtLink>
        </li>


        <li>
          <NuxtLink to="/careers">
            Careers
          </NuxtLink>
        </li>


        <li>
          <NuxtLink to="/press">
            Press
          </NuxtLink>
        </li>


      </ul>


    </div>



<!-- CONTACT -->

<div class="footer-box">

<h3>
Contact Us
</h3>


<ul class="footer-list contact">


<li>

<a 
href="https://www.google.com/maps/search/?api=1&query=Bole+Road+Addis+Ababa+Ethiopia"
target="_blank"
>

📍 Bole Road, Addis Ababa, Ethiopia

</a>

</li>



<li>

<a href="tel:+251911000000">

📞 +251 911 000 000

</a>

</li>




<li>

<a href="mailto:info@yellowmart.et">

📧 info@yellowmart.et

</a>

</li>


</ul>



</div>

  </div>




  <div class="copyright">

    © 2026 Yellow Mart. All rights reserved.

  </div>



</footer>


</template>

<style>
/* FOOTER WRAPPER */
.footer {
  background: #0f172a;
  color: white;
  padding: 60px 20px;
}

/* GRID */
.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

/* LOGO */
.logo {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  transition: 0.3s;
}

.logo:hover {
  color: #facc15;
  transform: scale(1.05);
}

/* DESCRIPTION */
.desc {
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.6;
}

/* LIST STYLE */
.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin: 8px 0;
  font-size: 14px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

/* hover effect */
.footer-list li:hover {
  transform: translateX(5px);
  color: #facc15;
}

/* CONTACT ICON ALIGN FIX */
.contact li span {
  width: 20px;
  display: inline-block;
}

/* SOCIAL ICONS */
.socials {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  justify-content: flex-start; /* important: left side */
}

.socials a {
  color: white;
  font-size: 18px;
  transition: 0.3s;
}

.socials a:hover {
  color: #facc15;
  transform: translateY(-3px);
}

/* FOOTER LINKS */
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  transition: 0.3s;
}

.footer-links a:hover {
  color: #facc15;
  transform: scale(1.1);
}

/* COPYRIGHT */
.copyright {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  opacity: 0.7;
}
.social-links{

display:flex;

gap:15px;

margin-top:25px;

}


.social-links a{

width:42px;

height:42px;

display:flex;

align-items:center;

justify-content:center;

background:#1e293b;

border-radius:50%;

color:white;

font-size:20px;

transition:.3s;

}


.social-links a:hover{

background:#facc15;

color:#111827;

transform:translateY(-5px);

}



.footer-list a{

color:#cbd5e1;

text-decoration:none;

transition:.3s;

}


.footer-list a:hover{

color:#facc15;

padding-left:5px;

}
</style>