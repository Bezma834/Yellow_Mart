export default defineNuxtConfig({

  modules: [
    "@nuxt/ui",
    "@nuxtjs/google-fonts"
  ],

  css: [
    "@fortawesome/fontawesome-free/css/all.css",
    "~/assets/css/main.css"
  ],

  googleFonts: {

    families: {

      Inter: true,

      Poppins: [
        400,
        500,
        600,
        700,
        800
      ]

    }

  },

  devtools: {
    enabled: true
  },

  pages: true,

  layouts: true,

runtimeConfig: {

public:{

hasuraUrl:
"https://inviting-moray-87.hasura.app/v1/graphql",

googleClientId:
process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID

}

}

})