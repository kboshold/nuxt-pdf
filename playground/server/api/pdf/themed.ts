import ThemedTemplate from '../../components/pdf/ThemedTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { title: 'Custom Themed PDF' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, ThemedTemplate, props, { filename: 'themed.pdf' })
})
