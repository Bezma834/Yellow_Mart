export default defineNuxtConfig({

  modules: [
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n"
  ],

  css: [
    "~/assets/css/main.css"
  ],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Poppins: [400, 500, 600, 700, 800]
    }
  },

  devtools: {
    enabled: true
  },

  pages: true,

  layouts: true,

  runtimeConfig: {
    public: {
      backendUrl: "https://yellow-mart-backend.onrender.com/api",
      googleClientId: "",
      googleMapsKey: ""
    }
  }

})