import LabelTemplate from '../../components/pdf/LabelTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    senderName: 'Sidebase GmbH',
    senderAddress: '123 Main Street\n10115 Berlin, Germany',
    recipientName: 'John Doe',
    recipientAddress: '456 Oak Avenue\nSuite 200\n67890 Metropolis, USA',
    trackingNumber: '1Z 999 AA1 01 2345 6784',
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, LabelTemplate, props, {
    filename: 'label.pdf',
    usePagedJS: false,
    pdfOptions: { width: '4in', height: '6in' },
  })
})
