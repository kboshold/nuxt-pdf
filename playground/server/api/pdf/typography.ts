import { usePDF } from '#pdf'
import TypographyTemplate from '../../components/pdf/TypographyTemplate.vue'

export default defineEventHandler(async (event) => {
  const { sendPDF } = usePDF()
  return sendPDF(event, TypographyTemplate, {}, { filename: 'typography.pdf' })
})
