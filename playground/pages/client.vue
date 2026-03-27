<script setup lang="ts">
const { download, isLoading, error } = useExportPDF()
</script>

<template>
  <div style="margin: 75px">
    <h1>Client-side PDF Download</h1>
    <p>Click a button to trigger a PDF download using the <code>useExportPDF()</code> composable.</p>

    <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap">
      <button
        :disabled="isLoading"
        style="padding: 8px 16px; cursor: pointer"
        @click="download('/api/pdf/basic', 'basic.pdf')"
      >
        Basic PDF
      </button>
      <button
        :disabled="isLoading"
        style="padding: 8px 16px; cursor: pointer"
        @click="download('/api/pdf/letter', 'letter.pdf')"
      >
        Letter PDF
      </button>
      <button
        :disabled="isLoading"
        style="padding: 8px 16px; cursor: pointer"
        @click="download('/api/pdf/themed', 'themed.pdf')"
      >
        Themed PDF
      </button>
    </div>

    <p v-if="isLoading" style="margin-top: 15px; color: #666">
      Generating PDF...
    </p>
    <p v-if="error" style="margin-top: 15px; color: red">
      Error: {{ error.message }}
    </p>

    <p style="margin-top: 30px">
      <a href="/">← Back to examples</a>
    </p>
  </div>
</template>
