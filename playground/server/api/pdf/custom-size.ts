import CustomSizeTemplate from '../../components/pdf/CustomSizeTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { labelText: 'FRAGILE - Handle with care' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, CustomSizeTemplate, props, {
    filename: 'custom-size.pdf',
    usePagedJS: false,
    pdfOptions: { width: '4in', height: '6in' },
  })
})
