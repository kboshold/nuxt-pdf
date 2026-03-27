<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-primary">{{ title }}</h1>
    <div class="mt-6 space-y-4">
      <p class="text-lg text-gray-700">This PDF uses a custom theme with <span class="font-semibold text-primary">primary color</span> defined via <code class="bg-gray-100 px-1 rounded">@theme</code>.</p>
      <div class="rounded-lg bg-primary/10 p-4">
        <p class="text-primary font-medium">This box uses the custom primary color for background and text.</p>
      </div>
    </div>
  </div>
</template>
