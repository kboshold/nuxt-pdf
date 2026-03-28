export function usePdfPreview() {
  const pdfData = ref<Uint8Array | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const renderTimeMs = ref<number | null>(null)
  const sizeBytes = ref<number | null>(null)
  const pageCount = ref<number | null>(null)

  async function fetchPdf(endpoint: string, props?: Record<string, unknown>) {
    loading.value = true
    error.value = null
    pdfData.value = null
    renderTimeMs.value = null
    sizeBytes.value = null
    pageCount.value = null

    try {
      const response = await $fetch.raw(endpoint, {
        method: props ? 'POST' : 'GET',
        body: props,
        responseType: 'arrayBuffer',
      })

      const buffer = response._data as ArrayBuffer
      pdfData.value = new Uint8Array(buffer)
      sizeBytes.value = buffer.byteLength

      const timeHeader = response.headers.get('x-render-time-ms')
      if (timeHeader) {
        renderTimeMs.value = Number(timeHeader)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch PDF'
    } finally {
      loading.value = false
    }
  }

  function onPdfLoaded(info: { pageCount: number }) {
    pageCount.value = info.pageCount
  }

  return { pdfData, loading, error, renderTimeMs, sizeBytes, pageCount, fetchPdf, onPdfLoaded }
}
