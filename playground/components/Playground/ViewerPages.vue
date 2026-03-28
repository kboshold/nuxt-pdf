<script setup lang="ts">
import { usePDF, VuePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'

const props = defineProps<{
  pdfData: Uint8Array
  scale: number
  fitWidth: boolean
}>()

const emit = defineEmits<{
  loaded: [payload: { pageCount: number }]
  pageVisible: [page: number]
}>()

const pdfSrc = computed(() => ({ data: props.pdfData }))
const { pdf, pages } = usePDF(pdfSrc)
const scrollContainer = ref<HTMLElement | null>(null)

watch(pages, (count) => {
  if (count > 0) {
    emit('loaded', { pageCount: count })
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
          :scale="fitWidth ? undefined : scale"
          :fit-parent="fitWidth"
        />
      </div>
    </div>
  </div>
</template>
