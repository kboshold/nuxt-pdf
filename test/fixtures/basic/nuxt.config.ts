import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  pdf: {
    usePagedJS: false,
  },
})
