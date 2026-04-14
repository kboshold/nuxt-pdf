import PagedHeadersTemplate from '../../components/pdf/PagedHeadersTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { title: 'Running Headers Demo', author: 'NuxtPDF' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, PagedHeadersTemplate, props, { filename: 'paged-headers.pdf' })
})
