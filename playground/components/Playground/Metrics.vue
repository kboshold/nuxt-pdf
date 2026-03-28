<script setup lang="ts">
const props = defineProps<{
  renderTimeMs: number | null
  sizeBytes: number | null
  pageCount: number | null
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const metrics = computed(() => [
  {
    icon: 'i-lucide-timer',
    label: props.renderTimeMs === null ? null : `${props.renderTimeMs}ms`,
  },
  {
    icon: 'i-lucide-hard-drive',
    label: props.sizeBytes === null ? null : formatSize(props.sizeBytes),
  },
  {
    icon: 'i-lucide-file-text',
    label: props.pageCount === null ? null : `${props.pageCount} ${props.pageCount === 1 ? 'page' : 'pages'}`,
  },
])
</script>

<template>
  <div class="flex items-center gap-2">
    <UBadge
      v-for="(metric, i) in metrics"
      :key="i"
      variant="subtle"
      color="neutral"
      size="sm"
    >
      <UIcon
        :name="metric.icon"
        class="size-3.5"
      />
      <template v-if="metric.label">
        {{ metric.label }}
      </template>
      <template v-else>
        <span class="inline-block h-3 w-8 animate-pulse rounded bg-current opacity-20" />
      </template>
    </UBadge>
  </div>
</template>
