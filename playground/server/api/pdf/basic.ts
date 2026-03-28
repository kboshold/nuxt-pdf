import BasicTemplate from '../../components/pdf/BasicTemplate.vue'

export default defineEventHandler(async (event) => {
  return sendPDFWithMetrics(event, BasicTemplate, { title: 'Hello NuxtPDF!' }, { filename: 'basic.pdf' })
})
