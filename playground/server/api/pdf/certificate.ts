import CertificateTemplate from '../../components/pdf/CertificateTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    recipientName: 'Jane Smith',
    courseName: 'Advanced Vue.js Development',
    completionDate: '2024-12-15',
    issuerName: 'Vue Academy',
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, CertificateTemplate, props, {
    filename: 'certificate.pdf',
    pdfOptions: { landscape: true },
  })
})
