import Vue3GoogleLogin from "vue3-google-login"

export default defineNuxtPlugin((nuxtApp) => {

  const config = useRuntimeConfig()

  if (!config.public.googleClientId) {
    console.error(
      "Google Client ID is missing"
    )
    return
  }

  nuxtApp.vueApp.use(
    Vue3GoogleLogin,
    {
      clientId: config.public.googleClientId
    }
  )

})