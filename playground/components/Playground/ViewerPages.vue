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
}>()

const pdfSrc = computed(() => ({ data: props.pdfData }))
const { pdf, pages } = usePDF(pdfSrc)

watch(pages, (count) => {
  if (count > 0) {
    emit('loaded', { pageCount: count })
  }
})
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900">
    <div class="mx-auto flex flex-col items-center gap-4">
      <VuePDF
        v-for="page in pages"
        :key="page"
        :pdf="pdf"
        :page="page"
        :scale="fitWidth ? undefined : scale"
        :fit-parent="fitWidth"
      />
    </div>
  </div>
</template>
