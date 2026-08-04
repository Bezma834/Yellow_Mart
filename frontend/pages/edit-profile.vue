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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
      Edit Profile
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
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Profile updated successfully!
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
          {{ saving ? "Saving..." : "Save Changes" }}
        </button>

      </div>

    </form>

  </div>

</div>

</template>
<style scoped>

.page{
  min-height:100vh;
  background:var(--color-bg-secondary);
  display:flex;
  justify-content:center;
  align-items:center;
  padding:100px 20px;
}

.card{
  width:100%;
  max-width:650px;
  background:var(--color-surface);
  border-radius:30px;
  padding:40px;
  box-shadow:0 20px 40px rgba(0,0,0,.08);
}

h1{
  text-align:center;
  font-size:34px;
  color:var(--color-text-primary);
  margin-bottom:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}

h1 svg{
  color:var(--color-primary);
}

.subtitle{
  text-align:center;
  color:var(--color-text-tertiary);
  margin-bottom:35px;
}

.loading{
  text-align:center;
  font-size:20px;
  color:var(--color-text-tertiary);
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
  border:5px solid var(--color-primary);
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
  background:var(--color-primary);
  display:flex;
  justify-content:center;
  align-items:center;
  color:var(--color-text-primary);
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
  color:var(--color-text-secondary);
}

input,
textarea{
  width:100%;
  padding:14px 16px;
  border:1px solid var(--color-border);
  border-radius:14px;
  font-size:16px;
  font-family:inherit;
  transition:.3s;
  outline:none;
  box-sizing:border-box;
  background:var(--color-surface);
  color:var(--color-text-primary);
}

input:focus,
textarea:focus{
  border-color:var(--color-primary);
  box-shadow:0 0 0 4px var(--color-primary-glow);
}

textarea{
  resize:none;
}

.readonly{
  background:var(--color-bg-tertiary);
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
  font-family:inherit;
  cursor:pointer;
  transition:.3s;
}

.save{
  background:var(--color-primary);
  color:var(--color-text-primary);
}

.save:hover{
  background:var(--color-primary-hover);
  transform:translateY(-2px);
}

.cancel{
  background:var(--color-bg-tertiary);
  color:var(--color-text-secondary);
}

.cancel:hover{
  background:var(--color-border);
}

.success{
  margin-top:20px;
  background:#dcfce7;
  color:#166534;
  padding:14px;
  border-radius:12px;
  text-align:center;
  font-weight:600;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
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

<style>
:root.dark .page { background: var(--color-dark-bg); }
:root.dark .card { background: var(--color-dark-surface); }
:root.dark h1 { color: var(--color-text-primary); }
:root.dark .subtitle { color: var(--color-text-secondary); }
:root.dark .loading { color: var(--color-text-secondary); }
:root.dark .avatar { border-color: var(--color-primary); }
:root.dark .avatar-placeholder { background: var(--color-primary); }
:root.dark label { color: var(--color-text-secondary); }
:root.dark input,
:root.dark textarea { background: var(--color-dark-bg-secondary); border-color: var(--color-dark-border); color: var(--color-text-primary); }
:root.dark input:focus,
:root.dark textarea:focus { border-color: var(--color-primary); }
:root.dark .readonly { background: var(--color-dark-bg-tertiary); }
:root.dark .save { background: var(--color-primary); color: var(--color-text-primary); }
:root.dark .save:hover { background: var(--color-primary-hover); }
:root.dark .cancel { background: var(--color-dark-bg-secondary); color: var(--color-text-secondary); }
:root.dark .cancel:hover { background: var(--color-dark-border); }
:root.dark .success { background: var(--color-dark-surface); color: var(--color-text-primary); border: 1px solid var(--color-dark-border); }
:root.dark .error { background: var(--color-dark-surface); color: var(--color-text-primary); border: 1px solid var(--color-dark-border); }
</style>