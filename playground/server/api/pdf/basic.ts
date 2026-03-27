import { usePDF } from '#pdf'
import BasicTemplate from '../../components/pdf/BasicTemplate.vue'

export default defineEventHandler(async (event) => {
  const { sendPDF } = usePDF()
  return sendPDF(event, BasicTemplate, { title: 'Hello NuxtPDF!' }, { filename: 'basic.pdf' })
})
