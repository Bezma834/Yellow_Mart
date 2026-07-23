<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"
import { useTheme } from "~/composables/useTheme"
const router = useRouter()

const { user, logout } = useAuth()


const { darkMode, toggleTheme } = useTheme()

const notifications = ref(true)

const language = ref("English")


// NOTIFICATIONS

const toggleNotifications = ()=>{


  if(import.meta.client){


    localStorage.setItem(

      "notifications",

      String(notifications.value)

    )


  }


}





// LOGOUT

const logoutUser = ()=>{


  logout()


  router.push("/login")


}





// DELETE ACCOUNT

const deleteAccount = ()=>{


  alert(

    "Account deletion will be available soon."

  )


}







onMounted(()=>{

  const savedNotifications =
    localStorage.getItem("notifications")


  if(savedNotifications){

    notifications.value =
      savedNotifications === "true"

  }

})



</script>





<template>


<div class="settings-page">



  <div class="settings-card">



    <h1>

      ⚙️ Settings

    </h1>





    <!-- Account -->

    <section class="setting-section">


      <h2>

        👤 Account

      </h2>



      <p>

        <strong>
          Name:
        </strong>

        {{ user?.fullname }}

      </p>



      <p>

        <strong>
          Email:
        </strong>

        {{ user?.email }}

      </p>



    </section>







    <!-- Notifications -->


    <section class="setting-section">


      <h2>

        🔔 Notifications

      </h2>



      <div class="setting-row">


        <span>

          Receive notifications

        </span>



        <input

          type="checkbox"

          v-model="notifications"

          @change="toggleNotifications"

        />


      </div>


    </section>







    <!-- Dark Mode -->


    <section class="setting-section">


      <h2>

        🌙 Appearance

      </h2>




      <div class="setting-row">


        <span>

          Dark Mode

        </span>


<input
  type="checkbox"
  :checked="darkMode"
  @change="toggleTheme"
/>


      </div>



    </section>
    
    <!-- Security -->


    <section class="setting-section">


      <h2>

        🔒 Security

      </h2>



      <button

        @click="router.push('/change-password')"

      >

        Change Password

      </button>



    </section>







    <!-- Danger -->


    <section class="danger">


      <h2>

        🗑 Danger Zone

      </h2>



      <button

        @click="deleteAccount"

      >

        Delete Account

      </button>


    </section>







    <button

      class="logout"

      @click="logoutUser"

    >

      🚪 Logout

    </button>




  </div>



</div>



</template>







<style scoped>


.settings-page{


min-height:100vh;

background:#f8fafc;

padding:100px 20px;

transition:.3s;

}




.settings-card{


max-width:600px;

margin:auto;

background:white;

padding:35px;

border-radius:25px;

box-shadow:0 15px 35px rgba(0,0,0,.08);

transition:.3s;

}




h1{


text-align:center;

margin-bottom:35px;

}





.setting-section{


padding:20px 0;

border-bottom:1px solid #eee;

}




.setting-section h2{


font-size:20px;

margin-bottom:15px;

}




.setting-row{


display:flex;

justify-content:space-between;

align-items:center;

}




input[type="checkbox"]{


width:22px;

height:22px;

cursor:pointer;

}





select{


width:100%;

padding:12px;

border-radius:10px;

border:1px solid #ddd;

}





button{


padding:12px 20px;

border:none;

border-radius:12px;

background:#facc15;

color:white;

font-weight:700;

cursor:pointer;

transition:.2s;

}



button:hover{


transform:translateY(-2px);

}





.danger button{


background:#ef4444;

}




.logout{


width:100%;

margin-top:25px;

background:#111827;

}







:global(.dark) body {

  background:#111827;
  color:#f9fafb;

}


:global(.dark) .settings-page {

  background:#111827;

  color:#f9fafb;

}



:global(.dark) .settings-card {

  background:#1f2937;

  color:#ffffff;

}



:global(.dark) h1,
:global(.dark) h2,
:global(.dark) h3,
:global(.dark) h4,
:global(.dark) span {

  color:#ffffff;

}



:global(.dark) p {

  color:#d1d5db;

}



:global(.dark) strong {

  color:#ffffff;

}



:global(.dark) .setting-section {

  border-color:#374151;

}



:global(.dark) select {

  background:#374151;

  color:white;

  border-color:#4b5563;

}



:global(.dark) button {

  color:white;

}



:global(.dark) select{


background:#374151;

color:white;

border-color:#4b5563;

}



@media(max-width:600px){


.settings-card{

padding:25px;

}



}


</style>