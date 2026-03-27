<script lang="ts" setup>
const props = withDefaults(defineProps<{
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  nonPrintableArea?: number
}>(), {
  marginTop: 20,
  marginRight: 15,
  marginBottom: 20,
  marginLeft: 15,
  nonPrintableArea: 10,
})
</script>

<template>
  <svg class="fixed inset-0 z-20 w-full h-full">
    <!-- Non-printable area -->
    <rect x="0" y="0" width="100%" :height="`${props.nonPrintableArea}mm`" fill="rgb(254 202 202)" opacity="0.5" />
    <rect x="0" :y="`calc(100% - ${props.nonPrintableArea}mm)`" width="100%" :height="`${props.nonPrintableArea}mm`" fill="rgb(254 202 202)" opacity="0.5" />
    <rect x="0" :y="`${props.nonPrintableArea}mm`" :width="`${props.nonPrintableArea}mm`" :height="`calc(100% - ${props.nonPrintableArea * 2}mm)`" fill="rgb(254 202 202)" opacity="0.5" />
    <rect :x="`calc(100% - ${props.nonPrintableArea}mm)`" :y="`${props.nonPrintableArea}mm`" :width="`${props.nonPrintableArea}mm`" :height="`calc(100% - ${props.nonPrintableArea * 2}mm)`" fill="rgb(254 202 202)" opacity="0.5" />

    <!-- Top margin -->
    <rect x="0" y="0" width="100%" :height="`${props.marginTop}mm`" fill="rgb(243 244 246)" opacity="0.5" />
    <text x="50%" :y="`${props.marginTop / 2}mm`" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-gray-700 font-mono">↕ {{ props.marginTop }}mm</text>

    <!-- Bottom margin -->
    <rect x="0" :y="`calc(100% - ${props.marginBottom}mm)`" width="100%" :height="`${props.marginBottom}mm`" fill="rgb(243 244 246)" opacity="0.5" />
    <text x="50%" :y="`calc(100% - ${props.marginBottom / 2}mm)`" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-gray-700 font-mono">↕ {{ props.marginBottom }}mm</text>

    <!-- Left margin -->
    <rect x="0" :y="`${props.marginTop}mm`" :width="`${props.marginLeft}mm`" :height="`calc(100% - ${props.marginTop + props.marginBottom}mm)`" fill="rgb(243 244 246)" opacity="0.5" />
    <text :x="`${props.marginLeft / 2}mm`" :y="`calc(50% + ${(props.marginTop - props.marginBottom) / 2}mm)`" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-gray-700 font-mono">↔ {{ props.marginLeft }}mm</text>

    <!-- Right margin -->
    <rect :x="`calc(100% - ${props.marginRight}mm)`" :y="`${props.marginTop}mm`" :width="`${props.marginRight}mm`" :height="`calc(100% - ${props.marginTop + props.marginBottom}mm)`" fill="rgb(243 244 246)" opacity="0.5" />
    <text :x="`calc(100% - ${props.marginRight / 2}mm)`" :y="`calc(50% + ${(props.marginTop - props.marginBottom) / 2}mm)`" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-gray-700 font-mono">↔ {{ props.marginRight }}mm</text>

    <!-- Content area border -->
    <rect :x="`${props.marginLeft}mm`" :y="`${props.marginTop}mm`" :width="`calc(100% - ${props.marginLeft + props.marginRight}mm)`" :height="`calc(100% - ${props.marginTop + props.marginBottom}mm)`" fill="none" stroke="rgb(209 213 219)" stroke-width="1" />
  </svg>
</template>
