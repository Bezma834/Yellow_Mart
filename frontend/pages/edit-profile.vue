<script setup lang="ts">
import { ref, onMounted } from "vue"
import { gql } from "@apollo/client"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"

const router = useRouter()

const { user } = useAuth()

const { $apollo } = useNuxtApp() as any

const loading = ref(true)
const saving = ref(false)
const success = ref(false)
const errorMessage = ref("")

const profile = ref({
  id: "",
  fullname: "",
  username: "",
  email: "",
  phone: "",
  bio: "",
  avatar: ""
})

const GET_USER = gql`
query GetUser($id: uuid!) {
  users_by_pk(id: $id) {
    id
    fullname
    username
    email
    phone
    bio
    avatar
  }
}
`

const UPDATE_USER = gql`
mutation UpdateUser(
  $id: uuid!,
  $fullname: String!,
  $username: String!,
  $phone: String,
  $bio: String,
  $avatar: String
) {
  update_users_by_pk(
    pk_columns: {
      id: $id
    }
    _set: {
      fullname: $fullname
      username: $username
      phone: $phone
      bio: $bio
      avatar: $avatar
    }
  ) {
    id
    fullname
    username
    email
    phone
    bio
    avatar
  }
}
`

const loadUser = async () => {

  if (!user.value) {
    router.push("/login")
    return
  }

  try {

    const result = await $apollo.query({

      query: GET_USER,

      variables: {

        id: user.value.id

      },

      fetchPolicy: "network-only"

    })

    profile.value = {

      ...result.data.users_by_pk

    }

  }

  catch (error) {

    console.error("LOAD USER ERROR:", error)

  }

  finally {

    loading.value = false

  }

}

const uploadImage = async (event: Event) => {

  const target = event.target as HTMLInputElement

  if (!target.files?.length) return

  const file = target.files[0]

  const formData = new FormData()

  formData.append("file", file)

  formData.append("upload_preset", "yellowmart")

  try {

    const response = await fetch(

      "https://api.cloudinary.com/v1_1/vqj4fvh0/image/upload",

      {

        method: "POST",

        body: formData

      }

    )

    const data = await response.json()

    profile.value.avatar = data.secure_url

  }

  catch (err) {

    console.error(err)

  }

}

const updateProfile = async () => {

  saving.value = true

  errorMessage.value = ""

  try {

    const result = await $apollo.mutate({

      mutation: UPDATE_USER,

      variables: {

        id: profile.value.id,

        fullname: profile.value.fullname,

        username: profile.value.username,

        phone: profile.value.phone,

        bio: profile.value.bio,

        avatar: profile.value.avatar

      }

    })

    const updatedUser = result.data.update_users_by_pk

    localStorage.setItem(

      "user",

      JSON.stringify(updatedUser)

    )

    success.value = true

    setTimeout(() => {

      router.push("/profile")

    }, 1500)

  }

  catch (error) {

    console.error(error)

    errorMessage.value = "Something went wrong."

  }

  finally {

    saving.value = false

  }

}

onMounted(() => {

  loadUser()

})
</script>
<template>

<div class="page">

  <div class="card">

    <h1>
      ✏️ Edit Profile
    </h1>

    <p class="subtitle">
      Update your personal information.
    </p>

    <div
      v-if="loading"
      class="loading"
    >
      Loading profile...
    </div>

    <form
      v-else
      @submit.prevent="updateProfile"
    >

      <!-- Avatar -->

      <div class="avatar-section">

        <img
          v-if="profile.avatar"
          :src="profile.avatar"
          class="avatar"
        />

        <div
          v-else
          class="avatar-placeholder"
        >
          👤
        </div>

        <input
          type="file"
          accept="image/*"
          @change="uploadImage"
        />

      </div>

      <!-- Full Name -->

      <label>
        Full Name
      </label>

      <input
        v-model="profile.fullname"
        type="text"
        placeholder="Enter your full name"
      />

      <!-- Username -->

      <label>
        Username
      </label>

      <input
        v-model="profile.username"
        type="text"
        placeholder="Enter username"
      />

      <!-- Email -->

      <label>
        Email
      </label>

      <input
        :value="profile.email"
        readonly
        class="readonly"
      />

      <!-- Phone -->

      <label>
        Phone Number
      </label>

      <input
        v-model="profile.phone"
        type="text"
        placeholder="+251..."
      />

      <!-- Bio -->

      <label>
        Bio
      </label>

      <textarea
        v-model="profile.bio"
        rows="4"
        placeholder="Tell people about yourself..."
      ></textarea>

      <!-- Error -->

      <div
        v-if="errorMessage"
        class="error"
      >
        {{ errorMessage }}
      </div>

      <!-- Success -->

      <div
        v-if="success"
        class="success"
      >
        ✅ Profile updated successfully!
      </div>

      <!-- Buttons -->

      <div class="buttons">

        <button
          type="button"
          class="cancel"
          @click="router.push('/profile')"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="save"
          :disabled="saving"
        >
          {{ saving ? "Saving..." : "💾 Save Changes" }}
        </button>

      </div>

    </form>

  </div>

</div>

</template>
<style scoped>

.page{
  min-height:100vh;
  background:#f8fafc;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:100px 20px;
}

.card{
  width:100%;
  max-width:650px;
  background:white;
  border-radius:30px;
  padding:40px;
  box-shadow:0 20px 40px rgba(0,0,0,.08);
}

h1{
  text-align:center;
  font-size:34px;
  color:#0f172a;
  margin-bottom:10px;
}

.subtitle{
  text-align:center;
  color:#64748b;
  margin-bottom:35px;
}

.loading{
  text-align:center;
  font-size:20px;
  color:#64748b;
}

.avatar-section{
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-bottom:35px;
}

.avatar{
  width:140px;
  height:140px;
  border-radius:50%;
  object-fit:cover;
  border:5px solid #f97316;
  margin-bottom:15px;
  transition:.3s;
}

.avatar:hover{
  transform:scale(1.05);
}

.avatar-placeholder{
  width:140px;
  height:140px;
  border-radius:50%;
  background:#f97316;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:60px;
  color:white;
  margin-bottom:15px;
}

input[type="file"]{
  font-size:14px;
}

label{
  display:block;
  margin-top:20px;
  margin-bottom:8px;
  font-weight:700;
  color:#334155;
}

input,
textarea{
  width:100%;
  padding:14px 16px;
  border:1px solid #d1d5db;
  border-radius:14px;
  font-size:16px;
  transition:.3s;
  outline:none;
  box-sizing:border-box;
}

input:focus,
textarea:focus{
  border-color:#f97316;
  box-shadow:0 0 0 4px rgba(249,115,22,.15);
}

textarea{
  resize:none;
}

.readonly{
  background:#f1f5f9;
  cursor:not-allowed;
}

.buttons{
  display:flex;
  gap:15px;
  margin-top:35px;
}

.buttons button{
  flex:1;
  border:none;
  border-radius:14px;
  padding:15px;
  font-size:16px;
  font-weight:700;
  cursor:pointer;
  transition:.3s;
}

.save{
  background:#f97316;
  color:white;
}

.save:hover{
  background:#ea580c;
  transform:translateY(-2px);
}

.cancel{
  background:#e2e8f0;
  color:#334155;
}

.cancel:hover{
  background:#cbd5e1;
}

.success{
  margin-top:20px;
  background:#dcfce7;
  color:#166534;
  padding:14px;
  border-radius:12px;
  text-align:center;
  font-weight:600;
}

.error{
  margin-top:20px;
  background:#fee2e2;
  color:#b91c1c;
  padding:14px;
  border-radius:12px;
  text-align:center;
  font-weight:600;
}

@media(max-width:768px){

  .card{
    padding:25px;
  }

  h1{
    font-size:28px;
  }

  .buttons{
    flex-direction:column;
  }

  .avatar,
  .avatar-placeholder{
    width:120px;
    height:120px;
  }

}

</style>