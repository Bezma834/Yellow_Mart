<template>

  <div class="terms-page">

    <div class="terms-card">

      <h1>
        Yellow-Mart Terms & Conditions
      </h1>

      <p class="updated">
        Last updated: July 2026
      </p>


      <section>

        <h2>1. Introduction</h2>

        <p>
          Welcome to Yellow-Mart. By creating an account and using our
          platform, you agree to follow these Terms & Conditions.
        </p>

      </section>



      <section>

        <h2>2. User Accounts</h2>

        <p>
          Users are responsible for keeping their account information
          accurate and protecting their login credentials.
        </p>

        <p>
          You must provide valid information when creating an account.
        </p>

      </section>



      <section>

        <h2>3. Business Listings</h2>

        <p>
          Businesses listed on Yellow-Mart must provide accurate information
          about their products, services, location, and contact details.
        </p>

      </section>



      <section>

        <h2>4. User Responsibilities</h2>

        <p>
          Users agree not to misuse the platform, upload harmful content,
          or provide false information.
        </p>

      </section>



      <section>

        <h2>5. Privacy</h2>

        <p>
          We respect your privacy and handle your personal information
          according to our privacy policies.
        </p>

      </section>



      <section>

        <h2>6. Account Termination</h2>

        <p>
          Yellow-Mart may suspend or remove accounts that violate these
          Terms & Conditions.
        </p>

      </section>



      <section>

        <h2>7. Contact Us</h2>

        <p>
          If you have questions about these terms, contact Yellow-Mart
          support.
        </p>

      </section>



      <NuxtLink
        to="/signup"
        class="back-btn"
      >
        ← Back to Signup
      </NuxtLink>


    </div>

  </div>

</template>


<style scoped>

.terms-page{

min-height:100vh;

display:flex;

justify-content:center;

align-items:center;

padding:40px;

background:#f8fafc;

}


.terms-card{

max-width:850px;

background:white;

padding:40px;

border-radius:20px;

box-shadow:
0 20px 40px rgba(0,0,0,.12);

}


h1{

font-size:32px;

font-weight:900;

color:#111827;

margin-bottom:10px;

}


.updated{

color:#64748b;

margin-bottom:30px;

}


section{

margin-bottom:25px;

}


h2{

font-size:20px;

font-weight:800;

color:#ca8a04;

margin-bottom:8px;

}


p{

color:#475569;

line-height:1.7;

}


.back-btn{

display:inline-block;

margin-top:20px;

background:#facc15;

color:#111827;

padding:12px 20px;

border-radius:10px;

font-weight:800;

text-decoration:none;

}


.back-btn:hover{

background:#eab308;

}

</style>