<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="p-10">
    <h1 class="text-3xl font-bold text-blue-700">
      {{ title }}
    </h1>
    <p class="mt-1 text-sm text-gray-400">
      Landscape A4 (297 × 210 mm)
    </p>

    <div class="mt-8 grid grid-cols-2 gap-8">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          Why Landscape?
        </h2>
        <p class="mt-3 text-gray-700">
          Landscape orientation provides a wider content area, making it ideal for tables, charts, dashboards, and side-by-side comparisons. At 297mm wide, a landscape A4 page offers nearly 50% more horizontal space than portrait.
        </p>
        <p class="mt-3 text-gray-700">
          This format is commonly used for financial reports, presentation handouts, Gantt charts, and any document where horizontal space is more valuable than vertical space.
        </p>
        <p class="mt-3 text-gray-700">
          With <code class="rounded bg-gray-100 px-1">@sidebase/nuxt-pdf</code>, switching to landscape is a single option: pass <code class="rounded bg-gray-100 px-1">pdfOptions: { landscape: true }</code> to the render call. The template itself doesn't need any special CSS — the browser viewport is simply wider.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          Two-Column Layout
        </h2>
        <p class="mt-3 text-gray-700">
          This two-column layout demonstrates how the extra width can be used effectively. In portrait mode, this content would be stacked vertically, requiring more vertical scrolling and additional pages.
        </p>
        <p class="mt-3 text-gray-700">
          Tailwind's grid utilities make it straightforward to create multi-column layouts that take advantage of the landscape format. The same template could adapt to portrait by changing the grid to a single column.
        </p>
        <div class="mt-4 rounded-lg bg-blue-50 p-4">
          <p class="text-sm font-medium text-blue-800">
            Tip: Combine landscape with paged.js running headers for professional wide-format reports with consistent branding across every page.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
