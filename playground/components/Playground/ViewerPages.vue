<script setup lang="ts">
import { usePDF, VuePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'

const props = defineProps<{
  pdfData: Uint8Array
  scale: number
  fitWidth: boolean
  fitPage: boolean
}>()

const emit = defineEmits<{
  loaded: [payload: { pageCount: number }]
  pageVisible: [page: number]
}>()

const pdfSrc = computed(() => ({ data: new Uint8Array(props.pdfData) }))
const { pdf, pages } = usePDF(pdfSrc)
const scrollContainer = ref<HTMLElement | null>(null)
const autoScale = ref(1)

// Calculate scale for fit-width or fit-page based on container dimensions
function recalculateAutoScale() {
  if (!scrollContainer.value || !pdf.value) {
    return
  }
  if (!props.fitWidth && !props.fitPage) {
    return
  }
  const container = scrollContainer.value
  const availableWidth = container.clientWidth - 32 // padding
  const availableHeight = container.clientHeight - 32
  // pdf from usePDF is a loading task — resolve via .promise to get the document proxy
  pdf.value.promise.then((doc: { getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { height: number, width: number } }> }) => {
    return doc.getPage(1)
  }).then((page) => {
    const viewport = page.getViewport({ scale: 1 })
    if (props.fitWidth) {
      autoScale.value = availableWidth / viewport.width
    } else if (props.fitPage) {
      autoScale.value = Math.min(availableWidth / viewport.width, availableHeight / viewport.height)
    }
  })
}

watch([() => props.fitWidth, () => props.fitPage], () => recalculateAutoScale())
watch(pdf, () => recalculateAutoScale())

const effectiveScale = computed(() => {
  if (props.fitWidth || props.fitPage) {
    return autoScale.value
  }
  return props.scale
})

watch(pages, (count) => {
  if (count > 0) {
    emit('loaded', { pageCount: count })
  }
})

// Recalculate auto scale on resize
onMounted(() => {
  recalculateAutoScale()
  if (scrollContainer.value) {
    const resizeObserver = new ResizeObserver(() => {
      if (props.fitWidth || props.fitPage) {
        recalculateAutoScale()
      }
    })
    resizeObserver.observe(scrollContainer.value)
    onUnmounted(() => resizeObserver.disconnect())
  }
})

// Track visible page via IntersectionObserver
onMounted(() => {
  const container = scrollContainer.value
  if (!container) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const page = Number((entry.target as HTMLElement).dataset.page)
          if (page > 0) {
            emit('pageVisible', page)
          }
        }
      }
    },
    { root: container, threshold: 0.5 },
  )

  const watchStop = watch(pages, () => {
    nextTick(() => {
      container.querySelectorAll('[data-page]').forEach((el) => {
        observer.observe(el)
      })
    })
  })

  onUnmounted(() => {
    observer.disconnect()
    watchStop()
  })
})
</script>

<template>
  <div
    ref="scrollContainer"
    data-pdf-scroll
    class="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900"
  >
    <div class="mx-auto flex flex-col items-center gap-4">
      <div
        v-for="page in pages"
        :key="page"
        :data-page="page"
      >
        <VuePDF
          :pdf="pdf"
          :page="page"
          :scale="effectiveScale"
        />
      </div>
    </div>
  </div>
</template>
