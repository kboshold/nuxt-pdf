<script setup lang="ts">
defineProps<{ labelText: string }>()
</script>

<template>
  <div class="label">
    <p class="text-center text-[7pt] text-gray-400">
      Custom Size: 4 × 6 inches
    </p>

    <!-- Sender -->
    <div class="mt-2 border-b border-gray-300 pb-2">
      <p class="text-[7pt] uppercase text-gray-400">
        From
      </p>
      <p class="text-[9pt] font-medium text-gray-800">
        Sidebase GmbH
      </p>
      <p class="text-[8pt] text-gray-600">
        123 Main Street<br>10115 Berlin, Germany
      </p>
    </div>

    <!-- Recipient -->
    <div class="mt-3">
      <p class="text-[7pt] uppercase text-gray-400">
        To
      </p>
      <p class="text-[11pt] font-bold text-gray-900">
        John Doe
      </p>
      <p class="text-[9pt] text-gray-700">
        456 Oak Avenue, Suite 200<br>67890 Metropolis, USA
      </p>
    </div>

    <!-- Barcode placeholder -->
    <div class="mt-4 flex items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 py-3">
      <div class="text-center">
        <div class="font-mono text-[10pt] tracking-[0.3em] text-gray-800">
          ||||| |||| ||||| |||| |||||
        </div>
        <p class="mt-1 font-mono text-[8pt] text-gray-500">
          1Z 999 AA1 01 2345 6784
        </p>
      </div>
    </div>

    <!-- Label text -->
    <div class="mt-4 rounded bg-red-50 py-2 text-center">
      <p class="text-[11pt] font-bold uppercase tracking-wide text-red-600">
        {{ labelText }}
      </p>
    </div>

    <!-- Weight / dimensions -->
    <div class="mt-3 flex justify-between text-[7pt] text-gray-400">
      <span>Weight: 2.5 kg</span>
      <span>30 × 20 × 15 cm</span>
    </div>

    <!-- eslint-disable-next-line vue/no-useless-v-bind -->
    <component :is="'style'">
      .label {
      padding: 12px 14px;
      font-family: system-ui, sans-serif;
      }
    </component>
  </div>
</template>
