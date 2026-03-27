<script lang="ts" setup>
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="footerRunning" :class="$props.class">
    <slot />
  </div>
</template>
