import ReportTemplate from '../../components/pdf/ReportTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    title: 'Q4 2026 Performance Report',
    author: 'Analytics Team',
    sections: 5,
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, ReportTemplate, props, { filename: 'report.pdf' })
})
