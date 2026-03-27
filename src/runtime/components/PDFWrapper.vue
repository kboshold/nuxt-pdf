<script lang="ts" setup>
import type { PDFWrapperProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<PDFWrapperProps>(), {
  debug: false,
  foldMark: false,
  size: 'A4',
  marginTop: 20,
  marginRight: 20,
  marginBottom: 20,
  marginLeft: 20,
})

const debugModes = computed(() => {
  if (!props.debug) {
    return []
  }
  return Array.isArray(props.debug) ? props.debug : [props.debug]
})

const pagedStyle = `
@page {
  size: ${props.size};
  margin: ${props.marginTop}mm ${props.marginRight}mm ${props.marginBottom}mm ${props.marginLeft}mm;
  @bottom-center {
    content: element(footerRunning);
  }
}
.footerRunning {
  position: running(footerRunning);
}
.page-break {
  page-break-before: always;
}
.avoid-break {
  page-break-inside: avoid;
}
body {
  margin: 0;
  padding: 0;
}
`
</script>

<template>
  <div class="text-gray-800 bg-white">
    <slot />

    <!-- Fold marks (components added in P03-T03) -->
    <template v-if="props.foldMark === 'letterA'" />
    <template v-if="props.foldMark === 'letterB'" />

    <!-- Debug overlays (components added in P03-T05) -->
    <template v-if="debugModes.includes('margin')" />
    <template v-if="debugModes.includes('letterA')" />
    <template v-if="debugModes.includes('letterB')" />
    <template v-if="debugModes.includes('ruler')" />
  </div>

  <div class="hidden custom-style">
    {{ pagedStyle }}
  </div>
</template>
