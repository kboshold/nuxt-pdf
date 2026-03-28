import InvoiceTemplate from '../../components/pdf/InvoiceTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    company: 'Sidebase GmbH',
    recipient: 'Acme Corp\n456 Oak Ave\n67890 Metropolis',
    items: [
      { description: 'Web Development', quantity: 40, unitPrice: 120 },
      { description: 'UI Design', quantity: 20, unitPrice: 95 },
      { description: 'Hosting (annual)', quantity: 1, unitPrice: 480 },
    ],
    taxRate: 19,
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, InvoiceTemplate, props, { filename: 'invoice.pdf' })
})
