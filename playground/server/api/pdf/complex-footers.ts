import ComplexFootersTemplate from '../../components/pdf/ComplexFootersTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { company: 'Sidebase GmbH', documentId: 'DOC-2026-001' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, ComplexFootersTemplate, props, { filename: 'complex-footers.pdf' })
})
