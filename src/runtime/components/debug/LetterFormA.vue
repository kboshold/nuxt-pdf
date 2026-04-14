<script lang="ts" setup>
const props = withDefaults(defineProps<{
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}>(), {
  marginTop: 20,
  marginRight: 20,
  marginBottom: 20,
  marginLeft: 25,
})
</script>

<template>
  <svg class="fixed inset-0 z-50" style="width: 210mm; height: 297mm;">
    <!-- Letter Head Area (27mm) -->
    <rect :x="`${props.marginLeft - 25}mm`" :y="`${props.marginTop - 20}mm`" :width="`${210 - (props.marginLeft - 25) - (props.marginRight - 20)}mm`" height="27mm" fill="rgba(254, 249, 195, 0.3)" stroke="#eab308" stroke-width="1" />
    <text :x="`${props.marginLeft - 25}mm`" :y="`${props.marginTop - 20 - 1}mm`" font-size="3mm" fill="#ca8a04" font-weight="bold">Letter Head (27mm)</text>

    <!-- Logo Area (55x20mm) -->
    <rect :x="`${210 - props.marginRight - 55 + (props.marginRight - 10)}mm`" :y="`${props.marginTop - 20 + 27 - 20}mm`" width="55mm" height="20mm" fill="rgba(255, 237, 213, 0.3)" stroke="#f97316" stroke-width="1" />
    <text :x="`${210 - props.marginRight - 55 + (props.marginRight - 10)}mm`" :y="`${props.marginTop - 20 + 27 - 20 - 1}mm`" font-size="3mm" fill="#ea580c" font-weight="bold">Logo (55x20mm)</text>

    <!-- Recipient Container (85x45mm) -->
    <rect :x="`${props.marginLeft}mm`" :y="`${props.marginTop + 7}mm`" width="85mm" height="45mm" fill="rgba(219, 234, 254, 0.2)" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2,2" />
    <text :x="`${props.marginLeft}mm`" :y="`${props.marginTop + 7 - 1}mm`" font-size="3mm" fill="#2563eb" font-weight="bold">Recipient Container (85x45mm)</text>

    <!-- Address Note (17.7mm) -->
    <rect :x="`${props.marginLeft}mm`" :y="`${props.marginTop + 7}mm`" width="85mm" height="17.7mm" fill="rgba(254, 226, 226, 0.3)" stroke="#ef4444" stroke-width="1" />
    <text :x="`${props.marginLeft + 85 - 1}mm`" :y="`${props.marginTop + 7 + 17.7 - 1}mm`" font-size="2.5mm" fill="#dc2626" font-weight="bold" text-anchor="end">Address Note (17.7mm)</text>

    <!-- Address (27.3mm) -->
    <rect :x="`${props.marginLeft}mm`" :y="`${props.marginTop + 7 + 17.7}mm`" width="85mm" height="27.3mm" fill="rgba(219, 234, 254, 0.3)" stroke="#3b82f6" stroke-width="1" />
    <text :x="`${props.marginLeft + 85 - 1}mm`" :y="`${props.marginTop + 7 + 17.7 + 27.3 - 1}mm`" font-size="2.5mm" fill="#2563eb" font-weight="bold" text-anchor="end">Address (27.3mm)</text>

    <!-- Reference (75x40mm) -->
    <rect :x="`${210 - props.marginRight - 75 + 10}mm`" :y="`${props.marginTop + 7 + 5}mm`" width="75mm" height="40mm" fill="rgba(220, 252, 231, 0.3)" stroke="#10b981" stroke-width="1" />
    <text :x="`${210 - props.marginRight - 75 + 10}mm`" :y="`${props.marginTop + 7 + 5 - 1}mm`" font-size="3mm" fill="#059669" font-weight="bold">Reference (75x40mm)</text>

    <!-- Content Area -->
    <rect :x="`${props.marginLeft}mm`" :y="`${props.marginTop + 7 + 45 + 8.46}mm`" :width="`${210 - props.marginLeft - props.marginRight}mm`" :height="`${297 - props.marginBottom - (props.marginTop + 7 + 45 + 8.46)}mm`" fill="rgba(243, 244, 246, 0.3)" stroke="#6b7280" stroke-width="1" />
    <text :x="`${props.marginLeft}mm`" :y="`${props.marginTop + 7 + 45 + 8.46 - 1}mm`" font-size="3mm" fill="#4b5563" font-weight="bold">Content Area</text>
  </svg>
</template>
