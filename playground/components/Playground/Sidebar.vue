<script setup lang="ts">
import type { ExampleDefinition } from '~/composables/useExamples'

const props = defineProps<{
  selectedId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const { featureExamples, realWorldExamples } = useExamples()

const categories: { label: string, examples: ExampleDefinition[] }[] = [
  { label: 'Feature Showcases', examples: featureExamples },
  { label: 'Real-World Templates', examples: realWorldExamples },
]

const openCategories = ref<Record<string, boolean>>(
  Object.fromEntries(categories.map(c => [c.label, true])),
)

function handleSelect(id: string) {
  emit('select', id)
}
</script>

<template>
  <div class="flex flex-col gap-1 p-2">
    <UCollapsible
      v-for="category in categories"
      :key="category.label"
      v-model:open="openCategories[category.label]"
    >
      <button
        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-muted uppercase tracking-wide hover:bg-elevated"
      >
        <UIcon
          name="i-lucide-chevron-right"
          class="size-4 shrink-0 transition-transform"
          :class="{ 'rotate-90': openCategories[category.label] }"
        />
        {{ category.label }}
      </button>

      <template #content>
        <div class="flex flex-col gap-0.5 py-1">
          <button
            v-for="example in category.examples"
            :key="example.id"
            class="flex flex-col rounded-md px-3 py-2 text-left transition-colors"
            :class="[
              props.selectedId === example.id
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-elevated text-default',
            ]"
            @click="handleSelect(example.id)"
          >
            <span class="text-sm font-medium">{{ example.name }}</span>
            <span class="text-xs text-muted">{{ example.description }}</span>
          </button>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
