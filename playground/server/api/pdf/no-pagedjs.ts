import { usePDF } from '#pdf'
import NoPagedJsTemplate from '../../components/pdf/NoPagedJsTemplate.vue'

export default defineEventHandler(async (event) => {
  const { sendPDF } = usePDF()
  return sendPDF(event, NoPagedJsTemplate, {}, {
    usePagedJS: false,
    filename: 'no-pagedjs.pdf',
  })
})
