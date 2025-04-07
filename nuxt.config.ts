export default defineNuxtConfig({
  modules: [
    '@nuxthq/ui',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: ['@/assets/css/tailwind.css'],
  devtools: { enabled: true },
  compatibilityDate: '2025-04-07'
})