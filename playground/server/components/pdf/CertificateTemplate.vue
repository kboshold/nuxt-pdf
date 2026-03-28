<script setup lang="ts">
import { computed } from 'vue'
import { PDFWrapper } from '../../../../src/runtime/index'

const props = defineProps<{
  recipientName: string
  courseName: string
  completionDate: string
  issuerName: string
}>()

const formattedDate = computed(() => {
  const d = new Date(props.completionDate)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<template>
  <PDFWrapper size="A4 landscape" :margin-top="0" :margin-right="0" :margin-bottom="0" :margin-left="0">
    <div class="flex h-[210mm] w-[297mm] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50 p-12">
      <!-- Outer decorative border -->
      <div class="flex h-full w-full items-center justify-center rounded border-4 border-double border-amber-600 p-6">
        <!-- Inner border -->
        <div class="flex h-full w-full flex-col items-center justify-center rounded border border-amber-300 px-16 py-10 text-center">
          <!-- Ornamental top -->
          <p class="text-2xl tracking-[0.5em] text-amber-600">
            ✦ ✦ ✦
          </p>

          <!-- Title -->
          <h1 class="mt-4 text-4xl font-light uppercase tracking-[0.2em] text-gray-800">
            Certificate of Completion
          </h1>

          <div class="mt-4 h-px w-48 bg-amber-400" />

          <!-- Preamble -->
          <p class="mt-6 text-sm text-gray-500">
            This certifies that
          </p>

          <!-- Recipient -->
          <p class="mt-2 text-3xl font-bold text-blue-800">
            {{ recipientName }}
          </p>

          <!-- Course -->
          <p class="mt-4 text-sm text-gray-500">
            has successfully completed
          </p>
          <p class="mt-2 text-xl font-semibold text-gray-700">
            {{ courseName }}
          </p>

          <!-- Date -->
          <p class="mt-6 text-sm text-gray-500">
            on {{ formattedDate }}
          </p>

          <!-- Issuer + signature -->
          <div class="mt-auto pt-8">
            <div class="mx-auto w-56 border-t border-gray-400 pt-2">
              <p class="text-sm font-medium text-gray-700">
                {{ issuerName }}
              </p>
              <p class="text-xs text-gray-400">
                Authorized Signatory
              </p>
            </div>
          </div>

          <!-- Ornamental bottom -->
          <p class="mt-4 text-2xl tracking-[0.5em] text-amber-600">
            ✦ ✦ ✦
          </p>
        </div>
      </div>
    </div>
  </PDFWrapper>
</template>
