import UnicodeTemplate from '../../components/pdf/UnicodeTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = { customText: '🎉 Type your own emojis / 文字 / نص / שלום here!' }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, UnicodeTemplate, props, { filename: 'unicode.pdf' })
})
