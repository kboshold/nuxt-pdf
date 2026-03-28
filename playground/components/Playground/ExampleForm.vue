<script setup lang="ts">
import type { FieldDefinition } from '~/composables/useExamples'

const props = defineProps<{
  fields: FieldDefinition[]
  defaults: Record<string, unknown>
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

function handleGenerate() {
  emit('generate')
}
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
      />
      <UInputNumber
        v-else-if="field.type === 'number'"
        v-model="formData[field.key] as number"
        :placeholder="field.placeholder"
      />
      <USelect
        v-else-if="field.type === 'select'"
        v-model="formData[field.key] as string"
        :items="field.options ?? []"
        :placeholder="field.placeholder"
      />
      <UInput
        v-else
        v-model="formData[field.key] as string"
        :type="field.type === 'date' ? 'date' : 'text'"
        :placeholder="field.placeholder"
      />
    </UFormField>

    <UButton
      label="Generate"
      icon="i-lucide-file-output"
      block
      @click="handleGenerate"
    />
  </div>
</template>
