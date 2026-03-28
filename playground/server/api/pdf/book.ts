import BookTemplate from '../../components/pdf/BookTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    title: 'The Art of PDF Generation',
    authorName: 'NuxtPDF',
    chapterCount: 20,
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, BookTemplate, props, {
    filename: 'book.pdf',
    timeout: 120000,
  })
})
