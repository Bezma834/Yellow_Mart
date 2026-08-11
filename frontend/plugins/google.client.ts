import Vue3GoogleLogin from "vue3-google-login"

export default defineNuxtPlugin((nuxtApp) => {

  const config = useRuntimeConfig()

  if (!config.public.googleClientId) {
    console.error(
      "Google Client ID is missing"
    )
    return
  }

  // Register the component only - each <GoogleLogin> passes its own client-id
  // prop. Initializing GSI here would also run at app load and again per
  // component mount ("google.accounts.id.initialize() is called multiple
  // times"), which can open duplicate popups on click.
  nuxtApp.vueApp.use(Vue3GoogleLogin)

})