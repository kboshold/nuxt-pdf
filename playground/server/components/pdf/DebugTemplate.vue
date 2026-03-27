<script lang="ts" setup>
import { PDFWrapper } from '../../../../src/runtime/index'
</script>

<template>
  <PDFWrapper :debug="['ruler', 'margin']" :margin-top="25" :margin-right="20" :margin-bottom="20" :margin-left="25">
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-blue-600">Debug Overlay Demo</h1>
      <p class="text-gray-700">This PDF has ruler and margin debug overlays enabled.</p>
      <p class="text-gray-700">The gray areas show the page margins, red areas show non-printable zones, and the rulers show millimeter measurements on all four sides.</p>
      <div class="mt-8 p-4 rounded bg-blue-50">
        <p class="text-sm text-blue-800">Try changing the debug prop to <code class="bg-blue-100 px-1 rounded">['letterA']</code> or <code class="bg-blue-100 px-1 rounded">['letterB']</code> to see DIN 676 zone overlays.</p>
      </div>
    </div>
  </PDFWrapper>
</template>
