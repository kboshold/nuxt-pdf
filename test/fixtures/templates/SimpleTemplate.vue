<script setup lang="ts">
defineProps<{
  title?: string
  content?: string
}>()
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">{{ title ?? 'Test Title' }}</h1>
    <p class="mt-2 text-gray-700">{{ content ?? 'Test content' }}</p>
  </div>
</template>
