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
const fitWidth = ref(false)
const fitPage = ref(true)
const pageCount = ref(0)
const currentPage = ref(1)

const ZOOM_STEP = 0.25
const MIN_ZOOM = 0.25
const MAX_ZOOM = 3

type ZoomPreset = 'page-width' | 'page-fit' | 'actual-size' | number

const zoomOptions: { label: string, value: ZoomPreset }[] = [
  { label: 'Page Width', value: 'page-width' },
  { label: 'Page Fit', value: 'page-fit' },
  { label: 'Actual Size', value: 'actual-size' },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
  { label: '300%', value: 3 },
]

const zoomLabel = computed(() => {
  if (fitWidth.value) return 'Page Width'
  if (fitPage.value) return 'Page Fit'
  return `${Math.round(scale.value * 100)}%`
})

function setZoom(preset: ZoomPreset) {
  fitWidth.value = false
  fitPage.value = false
  if (preset === 'page-width') {
    fitWidth.value = true
    scale.value = 1
  }
  else if (preset === 'page-fit') {
    fitPage.value = true
    scale.value = 1
  }
  else if (preset === 'actual-size') {
    scale.value = 1
  }
  else {
    scale.value = preset
  }
}

function zoomIn() {
  fitWidth.value = false
  fitPage.value = false
  const current = scale.value
  // Snap to next preset percentage
  const next = zoomOptions
    .map(o => o.value)
    .filter((v): v is number => typeof v === 'number' && v > current)
    .sort((a, b) => a - b)[0]
  scale.value = next ?? Math.min(current + ZOOM_STEP, MAX_ZOOM)
}

function zoomOut() {
  fitWidth.value = false
  fitPage.value = false
  const current = scale.value
  const prev = zoomOptions
    .map(o => o.value)
    .filter((v): v is number => typeof v === 'number' && v < current)
    .sort((a, b) => b - a)[0]
  scale.value = prev ?? Math.max(current - ZOOM_STEP, MIN_ZOOM)
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
  fitWidth.value = false
  fitPage.value = true
  scale.value = 1
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
            :disabled="!fitWidth && !fitPage && scale <= MIN_ZOOM"
            @click="zoomOut"
          />
          <UDropdownMenu
            :items="zoomOptions.map(o => ({ label: o.label, onSelect: () => setZoom(o.value) }))"
          >
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              :label="zoomLabel"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
          <UButton
            icon="i-lucide-zoom-in"
            variant="ghost"
            color="neutral"
            size="xs"
            :disabled="!fitWidth && !fitPage && scale >= MAX_ZOOM"
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
          :fit-page="fitPage"
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
