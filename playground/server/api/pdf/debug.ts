import DebugTemplate from '../../components/pdf/DebugTemplate.vue'

export default defineEventHandler(async (event) => {
  return sendPDFWithMetrics(event, DebugTemplate, {}, { filename: 'debug.pdf' })
})
