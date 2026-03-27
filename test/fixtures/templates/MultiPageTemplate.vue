<script setup lang="ts">
import PDFWrapper from '../../../src/runtime/components/PDFWrapper.vue'
</script>

<template>
  <PDFWrapper>
    <div>
      <h1 class="text-xl font-bold">Page 1</h1>
      <p class="text-gray-700">First page content.</p>
    </div>
    <div class="page-break" />
    <div>
      <h1 class="text-xl font-bold">Page 2</h1>
      <p class="text-gray-700">Second page content.</p>
    </div>
  </PDFWrapper>
</template>
