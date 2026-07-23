<template>
  <div class="auth-wrapper">

    <div class="auth-card">

      <h1 class="title">
        Create Account 🚀
      </h1>

      <p class="subtitle">
        Join Yellow-Mart today
      </p>

      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>

      <!-- Username -->

      <input
        v-model="username"
        type="text"
        placeholder="Username"
      />

      <!-- Full Name -->

      <input
        v-model="fullName"
        type="text"
        placeholder="Full Name"
      />

      <!-- Email -->

      <input
        v-model="email"
        type="email"
        placeholder="Email Address"
      />

      <!-- Phone -->

      <input
        v-model="phone"
        type="tel"
        placeholder="Phone Number"
      />

      <!-- Avatar -->


      <!-- Password -->

      <div class="password-box">

        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
        />

        <button
          type="button"
          class="eye"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? "🙈" : "👁️" }}
        </button>

      </div>

      <!-- Confirm Password -->

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />

      <!-- Password Strength -->

      <div class="strength">

        Password Strength :

        <span :class="strength">

          {{ strength }}

        </span>

      </div>

      <!-- Terms -->

      <label class="terms">

        <input
          v-model="agree"
          type="checkbox"
        />

        I agree to the
        <NuxtLink to="/terms">
          Terms & Conditions
        </NuxtLink>

      </label>

      <!-- Signup -->

      <button
        class="signup-btn"
        @click="signup"
        :disabled="loading"
      >

        {{ loading ? "Creating Account..." : "Create Account" }}

      </button>

      <!-- Divider -->

      <div class="divider">

        <span>OR</span>

      </div>

      <!-- Google -->

<GoogleLogin :callback="googleLogin">
  <button class="google-btn" type="button">
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google"
    />
    Continue with Google
  </button>
</GoogleLogin>
     
      <!-- Login -->

      <p class="login-link">

        Already have an account?

        <NuxtLink to="/login">

          Login

        </NuxtLink>

      </p>

    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, computed } from "vue"

const username = ref("")
const fullName = ref("")
const email = ref("")
const phone = ref("")
const password = ref("")
const confirmPassword = ref("")

const avatar = ref<File | null>(null)

const agree = ref(false)

const error = ref("")
const loading = ref(false)

const showPassword = ref(false)

const strength = computed(() => {

  if (password.value.length < 6) {
    return "Weak"
  }

  if (password.value.length < 10) {
    return "Medium"
  }

  return "Strong"

})

const validateEmail = (email: string) => {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

}

const handleAvatar = (event: Event) => {

  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {

    avatar.value = target.files[0]

  }

}

const signup = async () => {

  error.value = ""

  if (
    !username.value.trim() ||
    !fullName.value.trim() ||
    !email.value.trim() ||
    !password.value ||
    !confirmPassword.value
  ) {

    error.value = "Please fill in all required fields"

    return

  }

  if (!validateEmail(email.value)) {

    error.value = "Please enter a valid email address"

    return

  }

  if (password.value.length < 6) {

    error.value = "Password must be at least 6 characters"

    return

  }

  if (password.value !== confirmPassword.value) {

    error.value = "Passwords do not match"

    return

  }

  if (!agree.value) {

    error.value = "Please accept the Terms & Conditions"

    return

  }

  loading.value = true

  try {

    const res = await fetch(
      "http://localhost:5000/api/auth/signup",
      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          username: username.value,

          name: fullName.value,

          email: email.value,

          password: password.value,

          phone: phone.value,

          avatar: null

        })

      }
    )

    const data = await res.json()

    if (!res.ok) {

      error.value = data.message || "Signup failed"

      return

    }

    if (data.token) {

      localStorage.setItem("token", data.token)

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      if (data.user.role?.trim() === "admin") {

        window.location.href = "/admin"

      } else {

        window.location.href = "/"

      }

    }

  }

  catch (err) {

    console.error(err)

    error.value = "Cannot connect to server"

  }

  finally {

    loading.value = false

  }

}
const googleLogin = async (response:any)=>{


  try {


    const res = await fetch(
      "http://localhost:5000/api/auth/google",
      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          token: response.credential

        })

      }
    )


    const data = await res.json()



    if(!res.ok){

      error.value =
        data.message ||
        "Google login failed"

      return

    }



    localStorage.setItem(
      "token",
      data.token
    )


    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    )



    if(data.user.role?.trim()==="admin"){

      window.location.href="/admin"

    }
    else{

      window.location.href="/"

    }


  }

  catch(err){

    console.error(err)

    error.value="Google login failed"

  }


}
</script>

<style scoped>


.auth-wrapper{

min-height:100vh;

display:flex;

justify-content:center;

align-items:center;

padding:100px 20px;

background:
linear-gradient(
rgba(15,23,42,.75),
rgba(15,23,42,.75)
),
url("/homepage.jpg");

background-size:cover;

background-position:center;

}



.auth-card{

width:450px;

background:white;

padding:35px;

border-radius:20px;

box-shadow:0 20px 50px rgba(0,0,0,.25);

}



.title{

text-align:center;

font-size:30px;

font-weight:900;

margin-bottom:8px;

}



.subtitle{

text-align:center;

color:#64748b;

margin-bottom:25px;

}



.error{

background:#fee2e2;

color:#b91c1c;

padding:12px;

border-radius:10px;

margin-bottom:20px;

font-size:14px;

}



input{

width:100%;

padding:13px;

margin-bottom:15px;

border:1px solid #cbd5e1;

border-radius:10px;

font-size:15px;

outline:none;

transition:.25s;

box-sizing:border-box;

}



input:focus{

border-color:#facc15;

box-shadow:0 0 0 3px rgba(250,204,21,.25);

}



.password-box{

position:relative;

}



.eye{

position:absolute;

right:10px;

top:8px;

border:none;

background:none;

cursor:pointer;

font-size:18px;

}



.upload-box{

margin-bottom:18px;

}



.upload-title{

display:block;

font-weight:700;

margin-bottom:8px;

color:#334155;

}



.strength{

margin-bottom:20px;

font-size:14px;

font-weight:600;

}



.Weak{

color:#ef4444;

}



.Medium{

color:#f59e0b;

}



.Strong{

color:#22c55e;

}



.terms{

display:flex;

align-items:flex-start;

gap:10px;

font-size:14px;

margin-bottom:20px;

}



.terms input{

width:18px;

margin-top:3px;

}



.terms a{

color:#2563eb;

font-weight:700;

text-decoration:none;

}



.signup-btn{

width:100%;

padding:14px;

border:none;

border-radius:10px;

background:#facc15;

font-weight:800;

font-size:15px;

cursor:pointer;

transition:.25s;

}



.signup-btn:hover{

background:#eab308;

}



.signup-btn:disabled{

opacity:.6;

cursor:not-allowed;

}



.divider{

margin:25px 0;

text-align:center;

position:relative;

color:#94a3b8;

font-weight:700;

}



.divider::before{

content:"";

position:absolute;

left:0;

top:50%;

width:40%;

height:1px;

background:#cbd5e1;

}



.divider::after{

content:"";

position:absolute;

right:0;

top:50%;

width:40%;

height:1px;

background:#cbd5e1;

}



.google-btn,


.google-btn{

background:white;

border:1px solid #d1d5db;

}



.google-btn:hover{

background:#f8fafc;

}










.login-link{

margin-top:25px;

text-align:center;

font-size:15px;

}



.login-link a{

color:#f59e0b;

font-weight:700;

text-decoration:none;

}



.login-link a:hover{

text-decoration:underline;

}
.google-btn{

display:flex;

align-items:center;

justify-content:center;

gap:10px;

}


.google-btn img{

width:22px;

height:22px;

}
</style>