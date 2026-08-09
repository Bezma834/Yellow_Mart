<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "~/composables/useAuth"
import { useTheme } from "~/composables/useTheme"
import { DELETE_ACCOUNT_MUTATION } from "~/graphql/mutations"
const router = useRouter()

const { user, logout } = useAuth()


const { darkMode, toggleTheme } = useTheme()

const notifications = ref(true)

const message = ref("")

const showLogoutModal = ref(false)

const showDeleteModal = ref(false)

const deletePassword = ref("")

const deleting = ref(false)

const deleteError = ref("")


// NOTIFICATIONS

const toggleNotifications = async ()=>{


  if(!import.meta.client) return


  // Turning OFF: just persist the choice.

  if(!notifications.value){

    localStorage.setItem(
      "notifications",
      "false"
    )

    return

  }


  // Turning ON: the browser must ask for permission FIRST.

  if(
    typeof window === "undefined" ||
    !("Notification" in window)
  ){

    notifications.value = false

    message.value =
      "Notifications are not supported in this browser."

    return

  }


  try {

    const permission =
      await Notification.requestPermission()


    if(permission === "granted"){

      localStorage.setItem(
        "notifications",
        "true"
      )

      message.value = ""
      return

    }


    // Permission not granted -> keep the toggle OFF.

    notifications.value = false

    localStorage.setItem(
      "notifications",
      "false"
    )

    message.value =
      permission === "denied"
        ? "Notifications are blocked. Allow them in your browser settings, then try again."
        : "Permission request was dismissed. Toggle notifications on again to retry."

  }

  catch (err){

    console.error(err)

    notifications.value = false

    message.value =
      "Could not request notification permission."

  }

}



// DELETE ACCOUNT

const deleteAccount = ()=>{

  deletePassword.value = ""

  deleteError.value = ""

  showDeleteModal.value = true

}


const cancelDelete = ()=>{

  showDeleteModal.value = false

  deletePassword.value = ""

  deleteError.value = ""

}


const confirmDelete = async ()=>{

  if(deleting.value) return

  deleting.value = true

  deleteError.value = ""

  try {

    const { $apollo } = useNuxtApp() as any

    await $apollo.mutate({
      mutation: DELETE_ACCOUNT_MUTATION,
      variables: {
        password: deletePassword.value
      }
    })

    showDeleteModal.value = false

    deletePassword.value = ""

    logout()

    router.push("/")

  }

  catch (err:any) {

    deleteError.value =

      err?.message ||

      "Failed to delete account. Please try again."

  }

  finally {

    deleting.value = false

  }

}




// LOGOUT

const logoutUser = ()=>{

  showLogoutModal.value = true

}

const confirmLogout = ()=>{

  showLogoutModal.value = false

  logout()


  router.push("/login")


}

const cancelLogout = ()=>{

  showLogoutModal.value = false

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



    <div class="settings-header">

      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </div>

      <h1>
        Settings
      </h1>

      <p>
        Manage your preferences
      </p>

    </div>



    <p v-if="message" class="status-message status-error">
      {{ message }}
    </p>



    <div class="settings-body">



      <!-- Notifications -->

      <section class="setting-section">


        <h2>
          <span class="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></span>
          Notifications
        </h2>

        <div class="setting-row">

          <span class="row-label">
            Receive notifications
          </span>

          <label class="switch">
            <input
              type="checkbox"
              v-model="notifications"
              @change="toggleNotifications"
            />
            <span class="slider"></span>
          </label>

        </div>


      </section>



      <!-- Appearance -->

      <section class="setting-section">


        <h2>
          <span class="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
          Appearance
        </h2>

        <div class="setting-row">

          <span class="row-label">
            Dark Mode
          </span>

          <label class="switch">
            <input
              type="checkbox"
              :checked="darkMode"
              @change="toggleTheme"
            />
            <span class="slider"></span>
          </label>

        </div>


      </section>



      <!-- Danger -->

      <section class="setting-section danger">


        <h2>
          <span class="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></span>
          Danger Zone
        </h2>

        <div class="setting-row">

          <span class="row-label">
            Delete your account
          </span>

          <button
            class="row-btn danger-btn"
            @click="deleteAccount"
          >
            Delete Account
          </button>

        </div>


      </section>



    </div>



    <button

      class="logout"

      @click="logoutUser"

    >

      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Logout

    </button>




  </div>



  <!-- Logout Confirm Modal -->

  <div
    v-if="showLogoutModal"
    class="modal-overlay"
    @click.self="cancelLogout"
  >

    <div class="modal-box">

      <div class="modal-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>

      <h3>Log out?</h3>

      <p>Are you sure you want to log out of your account?</p>

      <div class="modal-actions">

        <button class="modal-cancel" @click="cancelLogout">
          Cancel
        </button>

        <button class="modal-confirm" @click="confirmLogout">
          Log Out
        </button>

      </div>

    </div>

  </div>



  <!-- Delete Account Confirm Modal -->

  <div
    v-if="showDeleteModal"
    class="modal-overlay"
    @click.self="cancelDelete"
  >

    <div class="modal-box">

      <div class="modal-icon danger-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </div>

      <h3>Delete your account?</h3>

      <p>
        This will permanently remove your account, your businesses,
        and your favorites. Enter your password to confirm.
      </p>

      <input
        v-model="deletePassword"
        type="password"
        class="delete-input"
        :class="{ 'delete-input-error': deleteError }"
        placeholder="Enter your password"
        :disabled="deleting"
        @keyup.enter="confirmDelete"
      />

      <p v-if="deleteError" class="delete-error">
        {{ deleteError }}
      </p>

      <div class="modal-actions">

        <button class="modal-cancel" :disabled="deleting" @click="cancelDelete">
          Cancel
        </button>

        <button class="modal-confirm delete-confirm" :disabled="deleting" @click="confirmDelete">
          {{ deleting ? "Deleting..." : "Delete Account" }}
        </button>

      </div>

    </div>

  </div>



</div>



</template>




<style scoped>


.settings-page{


min-height:100vh;

background:var(--color-bg-secondary);

padding:100px 20px;

transition:.3s;

}




.settings-card{


max-width:640px;

margin:auto;

background:var(--color-surface);

padding:40px;

border-radius:var(--radius-3xl);

box-shadow:var(--shadow-elevated);

transition:.3s;

}




.settings-header{

text-align:center;

margin-bottom:36px;

}

.header-icon{

width:56px;

height:56px;

margin:0 auto 16px;

border-radius:var(--radius-2xl);

background:linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);

color:var(--color-text-primary);

display:flex;

align-items:center;

justify-content:center;

box-shadow:var(--shadow-glow);

}

.settings-header h1{

font-size:30px;

font-weight:900;

margin-bottom:6px;

}

.settings-header p{

color:var(--color-text-secondary);

font-size:15px;

}




.setting-section{

padding:24px 0;

border-bottom:1px solid var(--color-border-light);

}

.setting-section:last-of-type{

border-bottom:none;

}




.setting-section h2{

font-size:18px;

font-weight:800;

margin-bottom:18px;

display:flex;

align-items:center;

gap:10px;

}

.section-icon{

display:inline-flex;

align-items:center;

justify-content:center;

width:34px;

height:34px;

border-radius:10px;

background:var(--color-primary-light);

color:var(--color-primary-hover);

flex-shrink:0;

}

.setting-row{

display:flex;

justify-content:space-between;

align-items:center;

gap:16px;

}

.row-label{

font-size:15px;

color:var(--color-text-secondary);

font-weight:600;

}


/* Toggle switch */

.switch{

position:relative;

display:inline-block;

width:48px;

height:26px;

flex-shrink:0;

}

.switch input{

opacity:0;

width:0;

height:0;

}

.slider{

position:absolute;

cursor:pointer;

inset:0;

background:var(--color-border);

border-radius:999px;

transition:.3s;

}

.slider::before{

content:"";

position:absolute;

height:20px;

width:20px;

left:3px;

top:3px;

background:var(--color-surface);

border-radius:50%;

transition:.3s;

box-shadow:0 2px 6px rgba(0,0,0,.2);

}

.switch input:checked + .slider{

background:var(--color-primary);

}

.switch input:checked + .slider::before{

transform:translateX(22px);

}


/* Row buttons */

.row-btn{

display:inline-flex;

align-items:center;

gap:8px;

padding:10px 18px;

border:none;

border-radius:var(--radius-lg);

background:var(--color-primary-light);

color:var(--color-primary-hover);

font-weight:700;

font-size:14px;

cursor:pointer;

transition:.2s;

white-space:nowrap;

}

.row-btn:hover{

background:var(--color-primary);

color:var(--color-text-primary);

transform:translateY(-1px);

}

.danger-btn{

background:#fee2e2;

color:#dc2626;

}

.danger-btn:hover{

background:#ef4444;

color:white;

}




.logout{

width:100%;

margin-top:28px;

padding:14px 20px;

border:none;

border-radius:var(--radius-xl);

background:#111827;

color:white;

font-weight:700;

font-size:15px;

cursor:pointer;

transition:.2s;

display:inline-flex;

align-items:center;

justify-content:center;

gap:8px;

}

.logout:hover{

background:var(--color-primary);

color:var(--color-text-primary);

transform:translateY(-1px);

box-shadow:var(--shadow-glow);

}


/* Logout confirm modal */

.modal-overlay{

position:fixed;

inset:0;

background:rgba(0,0,0,.5);

backdrop-filter:blur(4px);

display:flex;

align-items:center;

justify-content:center;

z-index:9999;

padding:20px;

animation:fadeIn .2s ease;

}

.modal-box{

background:var(--color-surface);

border-radius:var(--radius-2xl);

padding:36px 32px;

width:400px;

max-width:100%;

text-align:center;

box-shadow:var(--shadow-2xl);

animation:popIn .25s ease;

}

.modal-icon{

width:60px;

height:60px;

margin:0 auto 18px;

border-radius:50%;

background:var(--color-primary-light);

color:var(--color-primary-hover);

display:flex;

align-items:center;

justify-content:center;

}

.modal-box h3{

font-size:22px;

font-weight:900;

margin-bottom:8px;

}

.modal-box p{

color:var(--color-text-secondary);

font-size:15px;

margin-bottom:26px;

}

.modal-actions{

display:flex;

gap:12px;

}

.modal-cancel{

flex:1;

padding:12px;

border:none;

border-radius:var(--radius-lg);

background:var(--color-bg-tertiary);

color:var(--color-text-secondary);

font-weight:700;

font-size:15px;

cursor:pointer;

transition:.2s;

}

.modal-cancel:hover{

background:var(--color-border);

}

.modal-confirm{

flex:1;

padding:12px;

border:none;

border-radius:var(--radius-lg);

background:#111827;

color:white;

font-weight:700;

font-size:15px;

cursor:pointer;

transition:.2s;

}

.modal-confirm:hover{

background:#dc2626;

}

.modal-icon.danger-icon{

background:#fee2e2;

color:#dc2626;

}

.delete-input{

width:100%;

padding:12px 16px;

margin-bottom:24px;

border:2px solid var(--color-border);

border-radius:var(--radius-lg);

background:var(--color-bg-tertiary);

color:var(--color-text-primary);

font-size:15px;

font-weight:600;

outline:none;

transition:.2s;

box-sizing:border-box;

}

.delete-input:focus{

  border-color:#ef4444;

}

.delete-input-error,
.delete-input-error:focus{

  border-color:#ef4444;

  background:rgba(239,68,68,.05);

}

.delete-error{

  color:#dc2626;

  font-size:13px;

  font-weight:600;

  margin:-14px 0 20px;

  text-align:left;

}

:root.dark .delete-error {

  color: #f87171;

}

.delete-confirm{

background:#dc2626;

}

.delete-confirm:hover{

background:#b91c1c;

}

.delete-confirm:disabled,

.modal-cancel:disabled{

opacity:.6;

cursor:not-allowed;

}

@keyframes fadeIn{

from{opacity:0}

to{opacity:1}

}

@keyframes popIn{

from{opacity:0;transform:scale(.92) translateY(8px)}

to{opacity:1;transform:scale(1) translateY(0)}

}




@media(max-width:600px){


.settings-page{

padding:80px 16px;

}

.settings-card{

padding:28px;

}

.setting-section{

padding:20px 0;

}

}

</style>

<style>
:root.dark .settings-page {
  background: var(--color-dark-bg-secondary);
}

:root.dark .settings-card {
  background: var(--color-dark-surface);
}

:root.dark .settings-header h1,
:root.dark .settings-header p {
  color: var(--color-text-primary);
}

:root.dark .setting-section h2 {
  color: var(--color-text-primary);
}

:root.dark .setting-section {
  border-color: var(--color-dark-border);
}

:root.dark .row-label {
  color: var(--color-text-secondary);
}

:root.dark .row-btn {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .row-btn:hover {
  background: var(--color-primary);
}

:root.dark .danger-btn {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

:root.dark .danger-btn:hover {
  background: #dc2626;
  color: white;
}

:root.dark .logout {
  background: var(--color-dark-surface-hover);
}

:root.dark .logout:hover {
  background: var(--color-primary);
}

:root.dark .modal-box {
  background: var(--color-dark-surface);
}

:root.dark .modal-box h3 {
  color: var(--color-text-primary);
}

:root.dark .modal-box p {
  color: var(--color-text-secondary);
}

:root.dark .modal-cancel {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}

:root.dark .modal-cancel:hover {
  background: var(--color-dark-border);
}

:root.dark .modal-confirm {
  background: var(--color-dark-surface-hover);
  color: var(--color-text-primary);
}

:root.dark .modal-confirm:hover {
  background: #dc2626;
  color: white;
}

:root.dark .modal-icon.danger-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

:root.dark .delete-input {
  background: var(--color-dark-bg-tertiary);
  border-color: var(--color-dark-border);
  color: var(--color-text-primary);
}

:root.dark .delete-input:focus {
  border-color: #ef4444;
}

:root.dark .delete-confirm {
  background: #dc2626;
  color: white;
}

:root.dark .delete-confirm:hover {
  background: #b91c1c;
}
</style>
