export default defineNuxtConfig({
  modules: ['@nuxt/ui', '../src/module'],
  css: ['~/assets/main.css'],
  pdf: {
    cssFile: '~/assets/pdf.css',
  },
})
