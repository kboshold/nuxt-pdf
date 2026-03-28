<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getExample } = useExamples()

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
        <UDashboardNavbar :title="selectedExample?.name ?? 'Preview'" />
      </template>

      <div class="flex flex-1 items-center justify-center p-8">
        <p class="text-lg text-muted">
          {{ selectedExample?.description ?? 'Select an example to get started.' }}
        </p>
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
