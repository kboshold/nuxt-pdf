import TypographyTemplate from '../../components/pdf/TypographyTemplate.vue'

export default defineEventHandler(async (event) => {
  return sendPDFWithMetrics(event, TypographyTemplate, {}, { filename: 'typography.pdf' })
})
