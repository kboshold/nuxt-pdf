<script setup lang="ts">
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

      <div class="p-4">
        <p class="text-sm text-muted">
          Select an example from the sidebar to preview a PDF.
        </p>
      </div>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Preview" />
      </template>

      <div class="flex flex-1 items-center justify-center p-8">
        <p class="text-lg text-muted">
          Select an example to get started.
        </p>
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
