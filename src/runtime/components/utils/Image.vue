<script setup lang="ts">
import { Buffer } from 'node:buffer'
import { extname } from 'node:path'

const props = defineProps<{
  src: string
  class?: string
  alt?: string
}>()

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
}

const storage = useStorage('assets:server')
const image = await storage.getItemRaw(props.src)

let dataUri: string | null = null

if (image) {
  const ext = extname(props.src)
  const contentType = mimeTypes[ext] || 'image/jpeg'
  const base64Data = Buffer.from(image).toString('base64')
  dataUri = `data:${contentType};base64,${base64Data}`
}
else {
  console.warn(`[@sidebase/nuxt-pdf] Image not found: ${props.src}`)
}
</script>

<template>
  <img v-if="dataUri" :src="dataUri" :class="props.class" :alt="props.alt">
</template>
