import { usePDF } from '#pdf'
import ThemedTemplate from '../../components/pdf/ThemedTemplate.vue'

export default defineEventHandler(async (event) => {
  const { sendPDF } = usePDF()
  return sendPDF(event, ThemedTemplate, { title: 'Custom Themed PDF' }, { filename: 'themed.pdf' })
})
