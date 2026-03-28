<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getExample } = useExamples()
const { pdfData, loading, error, renderTimeMs, sizeBytes, pageCount, fetchPdf, onPdfLoaded } = usePdfPreview()

const selectedId = computed({
  get: () => {
    const id = route.query.example as string
    return getExample(id) ? id : 'basic'
  },
  set: (id: string) => {
    router.replace({ query: { ...route.query, example: id } })
  },
})

const selectedExample = computed(() => getExample(selectedId.value))

// Auto-refresh state persisted in localStorage
const autoRefresh = ref(true)

onMounted(() => {
  const stored = localStorage.getItem('nuxt-pdf-auto-refresh')
  if (stored !== null) {
    autoRefresh.value = stored === 'true'
  }
})

watch(autoRefresh, (val) => {
  localStorage.setItem('nuxt-pdf-auto-refresh', String(val))
})

// Auto-disable for book example
watch(selectedId, (id) => {
  if (id === 'book') {
    autoRefresh.value = false
  }
})

// Form data
const formData = ref<Record<string, unknown>>({})
let skipFormWatch = false

function handleFormUpdate(data: Record<string, unknown>) {
  formData.value = data
}

function handleSelect(id: string) {
  selectedId.value = id
}

// Debounced auto-refresh on form data change
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Fetch on example change (immediate for initial load)
// Reset formData and skip the next form watcher to prevent double-fetch
watch(selectedId, () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  skipFormWatch = true
  formData.value = {}
  triggerFetch()
}, { immediate: true })

watch(formData, () => {
  if (skipFormWatch) {
    skipFormWatch = false
    return
  }
  if (!autoRefresh.value || selectedId.value === 'book') {
    return
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    triggerFetch()
  }, 800)
}, { deep: true })

function triggerFetch() {
  const example = selectedExample.value
  if (!example) {
    return
  }
  const props = Object.keys(formData.value).length > 0
    ? formData.value
    : undefined
  fetchPdf(example.endpoint, props)
}

function handleGenerate() {
  triggerFetch()
}
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      :default-size="20"
      :min-size="15"
      :max-size="25"
      collapsible
    >
      <template #header>
        <UDashboardNavbar title="NuxtPDF Playground">
          <template #right>
            <UColorModeButton />
          </template>
        </UDashboardNavbar>
      </template>

      <PlaygroundSidebar
        :selected-id="selectedId"
        @select="handleSelect"
      />

      <template v-if="selectedExample">
        <USeparator />

        <PlaygroundExampleForm
          :fields="selectedExample.fields"
          :defaults="selectedExample.defaults"
          :auto-refresh="autoRefresh"
          @update:form-data="handleFormUpdate"
          @generate="handleGenerate"
        />

        <div class="flex items-center justify-between px-4 py-3">
          <label
            class="text-sm text-muted"
            for="auto-refresh-toggle"
          >Auto-refresh</label>
          <USwitch
            id="auto-refresh-toggle"
            v-model="autoRefresh"
          />
        </div>

        <p
          v-if="selectedId === 'book'"
          class="px-4 pb-3 text-xs text-amber-500"
        >
          Auto-refresh disabled for book example (~30-60s render).
        </p>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :title="selectedExample?.name ?? 'Preview'">
          <template #right>
            <PlaygroundMetrics
              :render-time-ms="renderTimeMs"
              :size-bytes="sizeBytes"
              :page-count="pageCount"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <PlaygroundViewer
        :pdf-data="pdfData"
        :loading="loading"
        :error="error"
        @loaded="onPdfLoaded"
      />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
