![nuxt-pdf](.github/preview.jpg)

# @sidebase/nuxt-pdf

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![GitHub stars](https://badgen.net/github/stars/sidebase/nuxt-pdf)](https://GitHub.com/sidebase/nuxt-pdf/)
[![License][license-src]][license-href]
[![Follow us on Twitter](https://badgen.net/badge/icon/twitter?icon=twitter&label)](https://twitter.com/sidebase_io)
[![Join our Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/NDDgQkcv3s)

> Server-side PDF generation for Nuxt using Vue components, Tailwind CSS, and headless Chrome.

## Features

- Render Vue components to PDF on the server via `usePDF()`
- Tailwind CSS v4 styling with programmatic compilation
- DIN 676 letter templates (Form A/B) with fold marks
- Custom theming via CSS file (`@theme`, `@plugin`)
- Paged.js support for running headers/footers and page numbers
- Client-side download helper via `useExportPDF()`
- Debug overlays (ruler, margin, letter zone visualization)

## Quick Start

### 1. Install

```bash
pnpm add @sidebase/nuxt-pdf
pnpm add -D puppeteer tailwindcss
```

`puppeteer` auto-downloads Chrome for development. In production/Docker, provide Chrome via `chromePath` instead.

### 2. Configure

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-pdf'],
  pdf: {
    // All options are optional with sensible defaults
    cssFile: '~/assets/pdf.css', // Custom Tailwind theme
  },
})
```

### 3. Create a PDF template

```vue
<!-- server/components/pdf/InvoiceTemplate.vue -->
<script setup lang="ts">
import { PDFWrapper } from '#pdf/components'

defineProps<{ title: string }>()
</script>

<template>
  <PDFWrapper>
    <h1 class="text-2xl font-bold">
      {{ title }}
    </h1>
    <p class="mt-4 text-gray-700">
      Your invoice content here.
    </p>
  </PDFWrapper>
</template>
```

### 4. Create a server route

```ts
// server/api/pdf/invoice.ts
import { usePDF } from '#pdf'
import InvoiceTemplate from '../../components/pdf/InvoiceTemplate.vue'

export default defineEventHandler(async (event) => {
  const { sendPDF } = usePDF()
  return sendPDF(event, InvoiceTemplate, { title: 'Invoice #001' }, {
    filename: 'invoice.pdf',
  })
})
```

Visit `/api/pdf/invoice` to see your PDF.

## SSR Context Limitation

PDF templates render via `createSSRApp()` + `renderToString()` **outside the Nuxt context**. This means:

- `useNuxtApp()`, `useFetch()`, `useRoute()` and other Nuxt composables are **not available**
- Only standard Vue APIs and this module's components work inside PDF templates
- Pass all data as props from the server route

## API

### `usePDF()` (Server)

Available via `#pdf` alias in server routes.

```ts
const { render, sendPDF, cleanup } = usePDF()
```

- **`render(component, props?, options?)`** — Returns `Promise<Uint8Array>` (PDF buffer)
- **`sendPDF(event, component, props?, options?)`** — Renders and sends PDF as HTTP response
- **`cleanup()`** — Close the shared browser instance

#### Render Options

```ts
interface RenderOptions {
  usePagedJS?: boolean // Override module-level paged.js setting
  pdfOptions?: PDFOptions // Puppeteer page.pdf() options
  waitForSelector?: string
  timeout?: number // Default: 30000ms
}

interface SendPDFOptions extends RenderOptions {
  filename?: string // Default: 'document.pdf'
  disposition?: 'inline' | 'attachment' // Default: 'inline'
}
```

### `useExportPDF()` (Client)

Auto-imported composable for client-side PDF downloads.

```vue
<script setup>
const { download, isLoading, error } = useExportPDF()
</script>

<template>
  <button :disabled="isLoading" @click="download('/api/pdf/invoice', 'invoice.pdf')">
    {{ isLoading ? 'Generating...' : 'Download PDF' }}
  </button>
  <p v-if="error">
    {{ error.message }}
  </p>
</template>
```

## Components

Import from `#pdf/components` (recommended) or `@sidebase/nuxt-pdf/components`.

### PDFWrapper

Base container. Sets page size, margins, and `@page` CSS rules.

```vue
<PDFWrapper size="A4" :margin-top="25" :debug="['ruler', 'margin']" fold-mark="letterA">
  <slot />
</PDFWrapper>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `AnySize` | `'A4'` | Page size: `A0`-`A10`, `A4 landscape`, `100mm 200mm` |
| `marginTop` | `number` | `20` | Top margin in mm |
| `marginRight` | `number` | `20` | Right margin in mm |
| `marginBottom` | `number` | `20` | Bottom margin in mm |
| `marginLeft` | `number` | `20` | Left margin in mm |
| `debug` | `DebugMode[] \| DebugMode \| false` | `false` | `'ruler'`, `'margin'`, `'letterA'`, `'letterB'` |
| `foldMark` | `MarkerMode \| false` | `false` | `'letterA'`, `'letterB'` |

### LetterA / LetterB

DIN 676 letter templates. LetterA: 27mm letterhead. LetterB: 45mm letterhead.

```vue
<LetterB :fold-mark="true">
  <template #letterhead>...</template>
  <template #logo>...</template>
  <template #address-note>...</template>
  <template #address>...</template>
  <template #reference>...</template>
  <template #content>...</template>
</LetterB>
```

### Image

Embeds images from Nitro `assets:server` storage as base64 data URIs.

```vue
<Image src="images/logo.png" class="w-24" alt="Logo" />
```

Supported formats: JPG, PNG, GIF, WebP, SVG, BMP, ICO.

### Footer

Running footer via paged.js (requires `usePagedJS: true`).

```vue
<Footer class="text-sm text-gray-500">
  <p>Page footer content</p>
</Footer>
```

## Theming

Create a CSS file with Tailwind directives:

```css
/* assets/pdf.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-primary: #3c623a;
  --font-sans: "Inter", sans-serif;
}
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-pdf'],
  pdf: {
    cssFile: '~/assets/pdf.css',
  },
})
```

## Module Options

```ts
interface ModuleOptions {
  isEnabled?: boolean // Default: true
  isCleanupEnabled?: boolean // Default: true — auto-cleanup browser on shutdown
  chromePath?: string // Chrome path (or SIDEBASE_PDF_CHROME_PATH env var)
  usePagedJS?: boolean // Default: true — enable paged.js polyfill
  cssFile?: string // Path to custom CSS file (e.g. '~/assets/pdf.css')
  maxConcurrency?: number // Default: 5 — max parallel renders
  maxRenderCount?: number // Default: 500 — recycle browser after N renders
}
```

## Paged.js

Paged.js is enabled by default and provides:
- Running headers and footers (`Footer` component)
- Page counters (`counter(page)` / `counter(pages)`)
- Named pages and margin boxes

Disable per-render with `{ usePagedJS: false }` or globally via `pdf.usePagedJS: false`.
Without paged.js, Chrome-native `@page` rules handle page size, margins, and basic page breaks.

## Docker / Production

In production, provide Chrome/Chromium and set the path:

```dockerfile
FROM node:20-slim
RUN apt-get update && apt-get install -y chromium
ENV SIDEBASE_PDF_CHROME_PATH=/usr/bin/chromium
```

Or via config:

```ts
export default defineNuxtConfig({
  pdf: {
    chromePath: '/usr/bin/chromium',
  },
})
```

Chrome is launched with container-safe flags: `--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`, `--font-render-hinting=none`.

## Development

```bash
pnpm install
pnpm run dev          # Playground at http://localhost:3000
pnpm run build        # Build module
pnpm run test         # Run tests
pnpm run lint         # Lint
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@sidebase/nuxt-pdf/latest.svg
[npm-version-href]: https://npmjs.com/package/@sidebase/nuxt-pdf

[npm-downloads-src]: https://img.shields.io/npm/dt/@sidebase/nuxt-pdf.svg
[npm-downloads-href]: https://npmjs.com/package/@sidebase/nuxt-pdf

[license-src]: https://img.shields.io/npm/l/@sidebase/nuxt-pdf.svg
[license-href]: https://npmjs.com/package/@sidebase/nuxt-pdf
