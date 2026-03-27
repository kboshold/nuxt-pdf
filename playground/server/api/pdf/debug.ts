import { usePDF } from '#pdf'
import DebugTemplate from '../../components/pdf/DebugTemplate.vue'

export default defineEventHandler(async (event) => {
  const { sendPDF } = usePDF()
  return sendPDF(event, DebugTemplate, {}, { filename: 'debug.pdf' })
})
