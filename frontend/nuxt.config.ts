export default defineNuxtConfig({

  modules: [
    "@nuxt/ui",
    "@nuxtjs/google-fonts"
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

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }
      ]
    }
  },

  pages: true,

  layouts: true,

  runtimeConfig: {
    public: {
      backendUrl: "https://yellow-mart-backend.onrender.com/api",
      googleClientId: ""
    }
  }

})