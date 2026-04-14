<script lang="ts" setup>
const props = withDefaults(defineProps<{
  width?: number
  height?: number
}>(), {
  width: 210,
  height: 297,
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none">
    <!-- Grid matrix -->
    <svg class="fixed" style="top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1; z-index: 100;">
      <line
        v-for="i in Math.floor(props.width / 10)"
        :key="`grid-v-${i}`"
        :x1="`${i * 10}mm`"
        y1="0"
        :x2="`${i * 10}mm`"
        :y2="`${props.height}mm`"
        stroke="black"
        stroke-width="0.25"
      />
      <line
        v-for="i in Math.floor(props.height / 10)"
        :key="`grid-h-${i}`"
        x1="0"
        :y1="`${i * 10}mm`"
        :x2="`${props.width}mm`"
        :y2="`${i * 10}mm`"
        stroke="black"
        stroke-width="0.25"
      />
    </svg>

    <!-- Top ruler -->
    <svg class="fixed" :style="`top: 0; left: 0; width: ${props.width}mm; height: 5mm; z-index: 101;`">
      <line
        v-for="i in props.width"
        :key="`top-${i}`"
        :x1="`${i}mm`"
        y1="0"
        :x2="`${i}mm`"
        :y2="i % 10 === 0 ? '5mm' : '2.5mm'"
        stroke="black"
        stroke-width="0.5"
      />
      <text
        v-for="i in Math.floor(props.width / 10)"
        :key="`top-label-${i}`"
        :x="`${i * 10}mm`"
        y="4.7mm"
        font-size="2mm"
        text-anchor="middle"
        fill="black"
      >{{ i * 10 }}</text>
    </svg>

    <!-- Bottom ruler -->
    <svg class="fixed" :style="`bottom: 0; left: 0; width: ${props.width}mm; height: 5mm; z-index: 102;`">
      <line
        v-for="i in props.width"
        :key="`bottom-${i}`"
        :x1="`${i}mm`"
        y1="5mm"
        :x2="`${i}mm`"
        :y2="i % 10 === 0 ? '0mm' : '2.5mm'"
        stroke="black"
        stroke-width="0.5"
      />
      <text
        v-for="i in Math.floor(props.width / 10)"
        :key="`bottom-label-${i}`"
        :x="`${i * 10}mm`"
        y="1.7mm"
        font-size="2mm"
        text-anchor="middle"
        fill="black"
      >{{ i * 10 }}</text>
    </svg>

    <!-- Left ruler -->
    <svg class="fixed" :style="`top: 0; left: 0; width: 5mm; height: ${props.height}mm; z-index: 103;`">
      <line
        v-for="i in props.height"
        :key="`left-${i}`"
        x1="0"
        :y1="`${i}mm`"
        :x2="i % 10 === 0 ? '5mm' : '2.5mm'"
        :y2="`${i}mm`"
        stroke="black"
        stroke-width="0.5"
      />
      <text
        v-for="i in Math.floor(props.height / 10)"
        :key="`left-label-${i}`"
        x="4.7mm"
        :y="`${i * 10}mm`"
        font-size="2mm"
        text-anchor="end"
        fill="black"
        dominant-baseline="middle"
      >{{ i * 10 }}</text>
    </svg>

    <!-- Right ruler -->
    <svg class="fixed" :style="`top: 0; right: 0; width: 5mm; height: ${props.height}mm; z-index: 104;`">
      <line
        v-for="i in props.height"
        :key="`right-${i}`"
        x1="5mm"
        :y1="`${i}mm`"
        :x2="i % 10 === 0 ? '0mm' : '2.5mm'"
        :y2="`${i}mm`"
        stroke="black"
        stroke-width="0.5"
      />
      <text
        v-for="i in Math.floor(props.height / 10)"
        :key="`right-label-${i}`"
        x="4.7mm"
        :y="`${i * 10}mm`"
        font-size="2mm"
        text-anchor="end"
        fill="black"
        dominant-baseline="middle"
      >{{ i * 10 }}</text>
    </svg>
  </div>
</template>
