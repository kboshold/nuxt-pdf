import LandscapeTemplate from '../../components/pdf/LandscapeTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { title: 'Landscape Demo' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, LandscapeTemplate, props, {
    filename: 'landscape.pdf',
    pdfOptions: { landscape: true },
  })
})
