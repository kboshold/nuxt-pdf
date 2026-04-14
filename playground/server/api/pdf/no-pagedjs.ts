import NoPagedJsTemplate from '../../components/pdf/NoPagedJsTemplate.vue'

export default defineEventHandler(async (event) => {
  return sendPDFWithMetrics(event, NoPagedJsTemplate, {}, {
    usePagedJS: false,
    filename: 'no-pagedjs.pdf',
  })
})
