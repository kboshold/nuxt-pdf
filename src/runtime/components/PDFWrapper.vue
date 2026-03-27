<script lang="ts" setup>
import type { PDFWrapperProps } from './types'
import { computed } from 'vue'
import LetterFormA from './debug/LetterFormA.vue'
import LetterFormB from './debug/LetterFormB.vue'
import Margin from './debug/Margin.vue'
import Ruler from './debug/Ruler.vue'
import FoldMarksA from './utils/FoldMarksA.vue'
import FoldMarksB from './utils/FoldMarksB.vue'

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

const pagedStyle = computed(() => `
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
`)
</script>

<template>
  <div class="text-gray-800 bg-white">
    <slot />

    <FoldMarksA v-if="props.foldMark === 'letterA'" :margin-left="props.marginLeft" :margin-right="props.marginRight" />
    <FoldMarksB v-if="props.foldMark === 'letterB'" :margin-left="props.marginLeft" :margin-right="props.marginRight" />

    <Margin
      v-if="debugModes.includes('margin')"
      :margin-top="props.marginTop"
      :margin-right="props.marginRight"
      :margin-bottom="props.marginBottom"
      :margin-left="props.marginLeft"
    />
    <LetterFormA
      v-if="debugModes.includes('letterA')"
      :margin-top="props.marginTop"
      :margin-right="props.marginRight"
      :margin-bottom="props.marginBottom"
      :margin-left="props.marginLeft"
    />
    <LetterFormB
      v-if="debugModes.includes('letterB')"
      :margin-top="props.marginTop"
      :margin-right="props.marginRight"
      :margin-bottom="props.marginBottom"
      :margin-left="props.marginLeft"
    />
    <Ruler v-if="debugModes.includes('ruler')" />
  </div>

  <div style="display:none" class="custom-style">
    {{ pagedStyle }}
  </div>
</template>
