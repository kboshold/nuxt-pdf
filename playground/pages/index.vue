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

function handleSelect(id: string) {
  selectedId.value = id
}

watch(selectedId, (id) => {
  const example = getExample(id)
  if (example) {
    fetchPdf(example.endpoint)
  }
}, { immediate: true })
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      :default-size="320"
      :min-size="280"
      :max-size="400"
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
