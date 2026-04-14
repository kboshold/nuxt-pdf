<script setup lang="ts">
import type { FieldDefinition } from '~/composables/useExamples'

const props = defineProps<{
  fields: FieldDefinition[]
  defaults: Record<string, unknown>
  autoRefresh?: boolean
}>()

const emit = defineEmits<{
  'update:formData': [data: Record<string, unknown>]
  'generate': []
}>()

const formData = ref<Record<string, unknown>>({})

function resetToDefaults() {
  formData.value = { ...props.defaults }
}

watch(() => props.fields, () => {
  resetToDefaults()
}, { immediate: true })

watch(formData, (data) => {
  emit('update:formData', { ...data })
}, { deep: true })
</script>

<template>
  <div
    v-if="fields.length > 0"
    class="flex flex-col gap-3 p-4"
  >
    <UFormField
      v-for="field in fields"
      :key="field.key"
      :label="field.label"
    >
      <UTextarea
        v-if="field.type === 'textarea'"
        v-model="formData[field.key] as string"
        :placeholder="field.placeholder"
        :rows="3"
        class="w-full"
      />
      <UInputNumber
        v-else-if="field.type === 'number'"
        v-model="formData[field.key] as number"
        :placeholder="field.placeholder"
        class="w-full"
      />
      <USelect
        v-else-if="field.type === 'select'"
        v-model="formData[field.key] as string"
        :items="field.options ?? []"
        :placeholder="field.placeholder"
        class="w-full"
      />
      <UInput
        v-else
        v-model="formData[field.key] as string"
        :type="field.type === 'date' ? 'date' : 'text'"
        :placeholder="field.placeholder"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
