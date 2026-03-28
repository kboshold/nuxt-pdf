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

// Zoom controls
const scale = ref(1)
const fitWidth = ref(true)
const pageCount = ref(0)
const currentPage = ref(1)

const ZOOM_STEP = 0.25
const MIN_ZOOM = 0.25
const MAX_ZOOM = 3

function zoomIn() {
  fitWidth.value = false
  scale.value = Math.min(scale.value + ZOOM_STEP, MAX_ZOOM)
}

function zoomOut() {
  fitWidth.value = false
  scale.value = Math.max(scale.value - ZOOM_STEP, MIN_ZOOM)
}

function resetZoom() {
  fitWidth.value = true
  scale.value = 1
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToPage(currentPage.value)
  }
}

function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++
    scrollToPage(currentPage.value)
  }
}

function scrollToPage(page: number) {
  const container = document.querySelector('[data-pdf-scroll]')
  const target = container?.querySelector(`[data-page="${page}"]`)
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleLoaded(info: { pageCount: number }) {
  pageCount.value = info.pageCount
  currentPage.value = 1
  emit('loaded', info)
}

function handlePageVisible(page: number) {
  currentPage.value = page
}

function handleDownload() {
  if (!props.pdfData) {
    return
  }
  const blob = new Blob([toRaw(props.pdfData) as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.pdf'
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Reset zoom when PDF changes
watch(() => props.pdfData, () => {
  resetZoom()
  pageCount.value = 0
  currentPage.value = 1
})
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
      <!-- Toolbar -->
      <div class="flex items-center justify-between border-b border-default px-4 py-2">
        <!-- Zoom controls -->
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-zoom-out"
            variant="ghost"
            color="neutral"
            size="xs"
            :disabled="!fitWidth && scale <= MIN_ZOOM"
            @click="zoomOut"
          />
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            :label="fitWidth ? 'Fit' : `${Math.round(scale * 100)}%`"
            @click="resetZoom"
          />
          <UButton
            icon="i-lucide-zoom-in"
            variant="ghost"
            color="neutral"
            size="xs"
            :disabled="!fitWidth && scale >= MAX_ZOOM"
            @click="zoomIn"
          />
        </div>

        <!-- Page navigation -->
        <div
          v-if="pageCount > 0"
          class="flex items-center gap-1"
        >
          <UButton
            icon="i-lucide-chevron-left"
            variant="ghost"
            color="neutral"
            size="xs"
            :disabled="currentPage <= 1"
            @click="prevPage"
          />
          <span class="min-w-20 text-center text-xs text-muted">
            Page {{ currentPage }} of {{ pageCount }}
          </span>
          <UButton
            icon="i-lucide-chevron-right"
            variant="ghost"
            color="neutral"
            size="xs"
            :disabled="currentPage >= pageCount"
            @click="nextPage"
          />
        </div>

        <!-- Download -->
        <UButton
          icon="i-lucide-download"
          variant="ghost"
          color="neutral"
          size="xs"
          label="Download"
          @click="handleDownload"
        />
      </div>

      <ClientOnly>
        <PlaygroundViewerPages
          :pdf-data="pdfData"
          :scale="scale"
          :fit-width="fitWidth"
          @loaded="handleLoaded"
          @page-visible="handlePageVisible"
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
