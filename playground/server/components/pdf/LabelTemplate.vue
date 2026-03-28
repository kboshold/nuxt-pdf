<script setup lang="ts">
defineProps<{
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  trackingNumber: string
}>()
</script>

<template>
  <div class="p-4 text-gray-800" style="font-family: system-ui, sans-serif;">
    <!-- Sender -->
    <div class="pb-3">
      <p class="text-[7pt] font-semibold uppercase text-gray-400">
        From
      </p>
      <p class="mt-0.5 text-[9pt] font-medium">
        {{ senderName }}
      </p>
      <p class="whitespace-pre-line text-[8pt] text-gray-600">
        {{ senderAddress }}
      </p>
    </div>

    <!-- Divider -->
    <div class="border-t-2 border-dashed border-gray-400" />

    <!-- Recipient -->
    <div class="py-4 text-center">
      <p class="text-[7pt] font-semibold uppercase text-gray-400">
        To
      </p>
      <p class="mt-1 text-[14pt] font-bold">
        {{ recipientName }}
      </p>
      <p class="mt-1 whitespace-pre-line text-[10pt] text-gray-700">
        {{ recipientAddress }}
      </p>
    </div>

    <!-- Barcode placeholder -->
    <div class="mt-2 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-center">
      <div class="font-mono text-[11pt] tracking-[0.3em] text-gray-800">
        ||||| |||| ||||| |||| |||||
      </div>
      <p class="mt-1 font-mono text-[8pt] tracking-wider text-gray-600">
        {{ trackingNumber }}
      </p>
    </div>

    <!-- Service type -->
    <div class="mt-3 flex items-center justify-between text-[7pt] text-gray-400">
      <span>PRIORITY MAIL</span>
      <span>4×6 LABEL</span>
    </div>
  </div>
</template>
