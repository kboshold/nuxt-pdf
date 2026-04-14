import { ref } from 'vue'

export function useExportPDF() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function download(url: string, filename?: string, fetchOptions?: Record<string, unknown>) {
    isLoading.value = true
    error.value = null
    try {
      const blob = await $fetch<Blob>(url, { responseType: 'blob', ...fetchOptions })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename ?? 'document.pdf'
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      isLoading.value = false
    }
  }

  return { download, isLoading, error }
}
