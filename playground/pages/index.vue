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
let skipFormWatch = 0

function handleFormUpdate(data: Record<string, unknown>) {
  formData.value = data
}

function handleSelect(id: string) {
  selectedId.value = id
}

// Debounced auto-refresh on form data change
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Fetch on example change (immediate for initial load)
// Skip next 2 form watches: the sync {} reset + the async ExampleForm defaults emit
watch(selectedId, () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  skipFormWatch = 2
  formData.value = {}
  triggerFetch()
}, { immediate: true })

watch(formData, () => {
  if (skipFormWatch > 0) {
    skipFormWatch--
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
  const data = Object.keys(formData.value).length > 0
    ? formData.value
    : example.defaults
  fetchPdf(example.endpoint, data)
}

function handleGenerate() {
  triggerFetch()
}

// Collapse sidebars — right collapsed by default on smaller screens
const leftCollapsed = ref(false)
const rightCollapsed = ref(false)

onMounted(() => {
  if (window.innerWidth < 1280) {
    rightCollapsed.value = true
  }
})
</script>

<template>
  <UDashboardGroup storage-key="playground-v2">
    <UDashboardSidebar
      v-model:collapsed="leftCollapsed"
      :default-size="20"
      :min-size="15"
      :max-size="25"
      resizable
      collapsible
      :ui="{ header: 'p-0' }"
    >
      <template #header>
        <UDashboardNavbar v-if="!leftCollapsed" title="NuxtPDF Playground" class="w-full">
          <template #right>
            <UColorModeButton />
          </template>
        </UDashboardNavbar>
      </template>

      <template #default>
        <PlaygroundSidebar
          v-if="!leftCollapsed"
          :selected-id="selectedId"
          @select="handleSelect"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :title="selectedExample?.name ?? 'Preview'">
          <template #left>
            <UButton
              :icon="leftCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="leftCollapsed = !leftCollapsed"
            />
          </template>
          <template #right>
            <PlaygroundMetrics
              :render-time-ms="renderTimeMs"
              :size-bytes="sizeBytes"
              :page-count="pageCount"
            />
            <UButton
              :icon="rightCollapsed ? 'i-lucide-panel-right-open' : 'i-lucide-panel-right-close'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="rightCollapsed = !rightCollapsed"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <PlaygroundViewer
          :pdf-data="pdfData"
          :loading="loading"
          :error="error"
          @loaded="onPdfLoaded"
        />
      </template>
    </UDashboardPanel>

    <UDashboardSidebar
      v-if="selectedExample"
      v-model:collapsed="rightCollapsed"
      side="right"
      :default-size="20"
      :min-size="15"
      :max-size="30"
      resizable
      collapsible
      :ui="{ header: 'p-0' }"
    >
      <template #header>
        <UDashboardNavbar title="Settings" class="w-full">
          <template #right>
            <UTooltip :text="autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'">
              <UButton
                :icon="autoRefresh ? 'i-lucide-refresh-cw' : 'i-lucide-refresh-cw-off'"
                :variant="autoRefresh ? 'soft' : 'ghost'"
                :color="autoRefresh ? 'primary' : 'neutral'"
                size="xs"
                @click="autoRefresh = !autoRefresh"
              />
            </UTooltip>
            <UButton
              icon="i-lucide-play"
              variant="soft"
              color="primary"
              size="xs"
              label="Render"
              :loading="loading"
              @click="handleGenerate"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <p
        v-if="selectedId === 'book'"
        class="px-4 pt-3 text-xs text-amber-500"
      >
        Auto-refresh disabled for book (~30-60s render).
      </p>

      <PlaygroundExampleForm
        :fields="selectedExample.fields"
        :defaults="selectedExample.defaults"
        :auto-refresh="autoRefresh"
        @update:form-data="handleFormUpdate"
        @generate="handleGenerate"
      />
    </UDashboardSidebar>
  </UDashboardGroup>
</template>
