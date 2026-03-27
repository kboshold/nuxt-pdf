<script lang="ts" setup>
const props = withDefaults(defineProps<{
  marginLeft?: number
  marginRight?: number
}>(), {
  marginLeft: 0,
  marginRight: 0,
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-40">
    <!-- Left side marks -->
    <div
      class="absolute bg-gray-300 h-px"
      :style="{
        top: '105mm',
        left: `-${props.marginLeft}mm`,
        width: '5mm',
      }"
    />
    <div
      class="absolute bg-gray-300 h-px"
      :style="{
        top: '210mm',
        left: `-${props.marginLeft}mm`,
        width: '5mm',
      }"
    />
    <div
      class="absolute bg-gray-300"
      :style="{
        top: '148.5mm',
        left: `-${props.marginLeft}mm`,
        width: '8mm',
        height: '2px',
      }"
    />

    <!-- Right side marks -->
    <div
      class="absolute bg-gray-300 h-px"
      :style="{
        top: '105mm',
        right: `-${props.marginRight}mm`,
        width: '5mm',
      }"
    />
    <div
      class="absolute bg-gray-300 h-px"
      :style="{
        top: '210mm',
        right: `-${props.marginRight}mm`,
        width: '5mm',
      }"
    />
    <div
      class="absolute bg-gray-300"
      :style="{
        top: '148.5mm',
        right: `-${props.marginRight}mm`,
        width: '8mm',
        height: '2px',
      }"
    />
  </div>
</template>
