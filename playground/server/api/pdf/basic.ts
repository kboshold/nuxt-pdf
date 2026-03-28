import BasicTemplate from '../../components/pdf/BasicTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { title: 'Hello NuxtPDF!' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, BasicTemplate, props, { filename: 'basic.pdf' })
})
