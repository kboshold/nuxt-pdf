<script setup lang="ts">
const props = defineProps<{
  pdfData: Uint8Array | null
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  loaded: [payload: { pageCount: number }]
}>()

const elapsedSeconds = ref(0)
let elapsedTimer: ReturnType<typeof setInterval> | null = null

watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    elapsedSeconds.value = 0
    elapsedTimer = setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  } else if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
})

onUnmounted(() => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
  }
})

function handleDownload() {
  if (!props.pdfData) {
    return
  }
  const blob = new Blob([props.pdfData as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.pdf'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="flex flex-1 flex-col items-center justify-center gap-3"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-primary"
      />
      <p class="text-sm text-muted">
        Generating PDF...
        <span v-if="elapsedSeconds > 0">({{ elapsedSeconds }}s)</span>
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex flex-1 flex-col items-center justify-center gap-3"
    >
      <UIcon
        name="i-lucide-circle-x"
        class="size-8 text-red-500"
      />
      <p class="text-sm text-red-500">
        {{ error }}
      </p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!pdfData"
      class="flex flex-1 items-center justify-center"
    >
      <p class="text-lg text-muted">
        Select an example to get started.
      </p>
    </div>

    <!-- PDF viewer -->
    <template v-else>
      <div class="flex items-center justify-end border-b border-default px-4 py-2">
        <UButton
          icon="i-lucide-download"
          variant="ghost"
          color="neutral"
          size="sm"
          label="Download"
          @click="handleDownload"
        />
      </div>

      <ClientOnly>
        <PlaygroundViewerPages
          :pdf-data="pdfData"
          @loaded="emit('loaded', $event)"
        />
        <template #fallback>
          <div class="flex flex-1 items-center justify-center">
            <UIcon
              name="i-lucide-loader-circle"
              class="size-6 animate-spin text-muted"
            />
          </div>
        </template>
      </ClientOnly>
    </template>
  </div>
</template>
