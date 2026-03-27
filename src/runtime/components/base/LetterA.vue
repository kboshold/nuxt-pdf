<script lang="ts" setup>
import type { PDFWrapperProps } from '../types'
import { computed } from 'vue'
import PDFWrapper from '../PDFWrapper.vue'

interface LetterAProps extends Omit<PDFWrapperProps, 'foldMark'> {
  foldMark?: boolean
}

const props = withDefaults(defineProps<LetterAProps>(), {
  size: 'A4',
  marginLeft: 25,
  marginRight: 20,
  marginBottom: 20,
  marginTop: 20,
  foldMark: false,
})

const wrapperProps = computed<PDFWrapperProps>(() => ({
  ...props,
  foldMark: props.foldMark ? 'letterA' : false,
}))
</script>

<template>
  <PDFWrapper v-bind="wrapperProps">
    <div class="w-full h-full z-20">
      <!-- Letterhead: 27mm (DIN 676 Form A) -->
      <div class="relative" :style="`height: 27mm; margin-top: ${-props.marginTop}mm; margin-left: ${-props.marginLeft}mm; margin-right: ${-props.marginRight}mm`">
        <slot name="letterhead" />
        <div class="absolute w-[55mm] h-[20mm] bottom-0" :style="`right: ${props.marginRight - 10}mm;`">
          <slot name="logo" />
        </div>
      </div>

      <div class="relative flex flex-row w-full min-h-[45mm]">
        <!-- Recipient area: 85mm wide, 45mm tall -->
        <div class="relative w-[85mm] h-[45mm]">
          <div class="relative w-full h-[17.7mm]">
            <slot name="address-note" />
          </div>
          <div class="relative w-full h-[27.3mm]">
            <slot name="address" />
          </div>
        </div>

        <!-- Reference area -->
        <div class="absolute min-h-[40mm] top-[5mm]" :style="`right: -10mm; width: 75mm`">
          <slot name="reference" />
        </div>
      </div>

      <!-- Spacer -->
      <div class="relative h-[8.46mm]" />

      <!-- Content area -->
      <div class="relative w-full">
        <slot name="content" />
      </div>
    </div>
  </PDFWrapper>
</template>
