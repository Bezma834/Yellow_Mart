<template>
  <div class="auth-wrapper">

    <div class="auth-card">

      <h1 class="title">
        Welcome Back 👋
      </h1>

      <p class="subtitle">
        Login to your Yellow-Mart account
      </p>


      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>


      <input
        v-model="identifier"
        type="text"
        placeholder="Username or Email"
      />


      <div class="password-box">

        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
        />


        <button
          class="eye"
          type="button"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? "🙈" : "👁️" }}
        </button>

      </div>



      <button
        class="login-btn"
        :disabled="loading"
        @click="login"
      >

        {{ loading ? "Logging in..." : "Login" }}

      </button>



      <NuxtLink
        class="forgot"
        to="/forgot-password"
      >
        Forgot Password?
      </NuxtLink>



      <div class="divider">
        OR
      </div>



    <GoogleLogin :callback="googleLogin">
  <button class="google-btn" type="button">
    <img
  class="google-icon"
  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
  alt="Google"
/>
    Continue with Google
  </button>
</GoogleLogin>


      <p class="signup">

        Don't have an account?

        <NuxtLink to="/signup">
          Sign up
        </NuxtLink>

      </p>


    </div>

  </div>
</template>

<script setup lang="ts">

import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const identifier = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)
const showPassword = ref(false)


const validate = () => {

  if (!identifier.value) {
    error.value = "Please enter your email"
    return false
  }

  if (!password.value) {
    error.value = "Please enter your password"
    return false
  }

  if (password.value.length < 6) {
    error.value = "Password must contain at least 6 characters"
    return false
  }

  return true
}


const login = async () => {

  error.value = ""

  if (!validate()) return

  loading.value = true

  try {

    const res = await fetch(
      "https://yellow-mart-backend.onrender.com/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: identifier.value,
          password: password.value
        })
      }
    )


    const data = await res.json()


    if (!res.ok) {

      error.value =
        data.message || "Invalid email or password"

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


    if (data.user?.role?.trim() === "admin") {

      router.push("/admin")

    } else {

      router.push("/")

    }


  } catch (err) {

    console.error("LOGIN ERROR:", err)

    error.value =
      "Cannot connect to server. Please try again."

  } finally {

    loading.value = false

  }

}

</script>




<style scoped>

.auth-wrapper {

  min-height:100vh;

  display:flex;

  justify-content:center;

  align-items:center;

  background:
  linear-gradient(
    rgba(15,23,42,.75),
    rgba(15,23,42,.75)
  ),
  url("/homepage.jpg");

  background-size:cover;

  padding:80px 20px;

}



.auth-card {

  width:420px;

  padding:35px;

  background:white;

  border-radius:20px;

  box-shadow:
  0 20px 50px rgba(0,0,0,.25);

}



.title {

  text-align:center;

  font-size:30px;

  font-weight:900;

}



.subtitle {

  text-align:center;

  color:#64748b;

  margin-bottom:25px;

}



input {

  width:100%;

  padding:13px;

  margin-bottom:15px;

  border-radius:10px;

  border:1px solid #cbd5e1;

  outline:none;

}



input:focus {

  border-color:#facc15;

}



.password-box {

  position:relative;

}



.eye {

  position:absolute;

  right:10px;

  top:8px;

  border:none;

  background:none;

  cursor:pointer;

}



.login-btn {

  width:100%;

  padding:13px;

  background:#facc15;

  border:none;

  border-radius:10px;

  font-weight:800;

  cursor:pointer;

}



.login-btn:hover {

  background:#eab308;

}



.login-btn:disabled {

  opacity:.6;

}



.error {

  background:#fee2e2;

  color:#b91c1c;

  padding:10px;

  border-radius:10px;

  margin-bottom:15px;

}



.forgot {

  display:block;

  text-align:right;

  margin-top:15px;

  color:#2563eb;

}



.divider {

  text-align:center;

  margin:20px;

  color:#64748b;

}



.google,



.google {

  background:white;

  border:1px solid #ddd;

}





.signup {

  text-align:center;

  margin-top:20px;

}



.signup a {

  color:#eab308;

  font-weight:bold;

}
.google-btn{
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:12px;

  padding:12px;

  border:1px solid #d1d5db;
  border-radius:10px;

  background:white;

  cursor:pointer;

  font-weight:700;

  transition:.2s;
}

.google-btn:hover{
  background:#f8fafc;
}

.google-icon{
  width:22px;
  height:22px;
  object-fit:contain;
  flex-shrink:0;
}

</style>