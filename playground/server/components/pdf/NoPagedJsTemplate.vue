<script lang="ts" setup>
import { PDFWrapper } from '../../../../src/runtime/index'
</script>

<template>
  <PDFWrapper>
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-blue-600">Page 1 — No Paged.js</h1>
      <p class="text-gray-700">This PDF was generated without paged.js polyfill. Chrome-native @page rules handle page size and margins.</p>
      <p class="text-gray-700">Page breaks use the standard CSS <code class="bg-gray-100 px-1 rounded">page-break-before: always</code> property.</p>
    </div>

    <div class="page-break" />

    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-green-600">Page 2 — Chrome Native</h1>
      <p class="text-gray-700">This is the second page, separated by a CSS page break.</p>
      <p class="text-gray-700">Note: The Footer component's running header/footer feature requires paged.js and will not work in this mode.</p>
    </div>
  </PDFWrapper>
</template>
