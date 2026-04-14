<script lang="ts" setup>
import { LetterB } from '../../../../src/runtime/index'

defineProps<{
  company: string
  recipient: string
  subject: string
  body: string
}>()
</script>

<template>
  <LetterB :fold-mark="true">
    <template #letterhead>
      <div class="w-full h-full bg-primary/5" />
    </template>

    <template #logo>
      <div class="flex items-end justify-end h-full p-2">
        <span class="text-xl font-bold text-primary">{{ company }}</span>
      </div>
    </template>

    <template #address-note>
      <div class="px-1 pt-2">
        <p class="text-[6pt] text-gray-400">
          {{ company }} · Example Street 1 · 12345 City
        </p>
      </div>
    </template>

    <template #address>
      <div class="px-1 pt-1">
        <p class="text-sm whitespace-pre-line">
          {{ recipient }}
        </p>
      </div>
    </template>

    <template #reference>
      <div class="pt-2 text-sm text-gray-600 space-y-1">
        <p><span class="font-semibold">Date:</span> {{ new Date().toLocaleDateString('en-GB') }}</p>
        <p><span class="font-semibold">Ref:</span> INV-2024-001</p>
      </div>
    </template>

    <template #content>
      <div class="space-y-4">
        <h2 class="text-lg font-bold">
          {{ subject }}
        </h2>
        <p class="text-sm leading-relaxed whitespace-pre-line">
          {{ body }}
        </p>
        <div class="mt-12">
          <p class="text-sm text-gray-600">
            Best regards,
          </p>
          <p class="mt-8 text-sm font-semibold">
            {{ company }}
          </p>
        </div>
      </div>
    </template>
  </LetterB>
</template>
