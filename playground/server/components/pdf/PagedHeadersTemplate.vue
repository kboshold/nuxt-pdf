<script setup lang="ts">
defineProps<{ title: string, author: string }>()
</script>

<template>
  <div class="paged-headers">
    <h1 class="doc-title text-3xl font-bold text-blue-700">
      {{ title }}
    </h1>
    <p class="mt-1 text-sm text-gray-500">
      By {{ author }}
    </p>

    <div class="mt-8 space-y-4">
      <h2 class="text-xl font-semibold text-gray-800">
        Chapter 1: Introduction
      </h2>
      <p class="text-gray-700">
        This document demonstrates paged.js running headers and footers. The document title appears in the header of every page, and page numbering in the format "Page X of Y" appears in the footer.
      </p>
      <p class="text-gray-700">
        Running headers are a powerful feature of paged.js that allow content to automatically repeat across all pages. They use the CSS <code class="rounded bg-gray-100 px-1">string-set</code> property to capture content from the document and display it in margin boxes defined by <code class="rounded bg-gray-100 px-1">@page</code> rules.
      </p>
      <p class="text-gray-700">
        The page counter is built into paged.js via the CSS <code class="rounded bg-gray-100 px-1">counter(page)</code> and <code class="rounded bg-gray-100 px-1">counter(pages)</code> functions, which are automatically incremented as pages are created during the pagination process.
      </p>

      <h2 class="mt-8 text-xl font-semibold text-gray-800">
        Chapter 2: How It Works
      </h2>
      <p class="text-gray-700">
        The header is defined using the <code class="rounded bg-gray-100 px-1">@top-center</code> margin box in the <code class="rounded bg-gray-100 px-1">@page</code> rule. The content is pulled from a <code class="rounded bg-gray-100 px-1">string-set</code> property attached to the document title element.
      </p>
      <p class="text-gray-700">
        When paged.js processes the document, it extracts the value from the element with the string-set property and makes it available as a named string that can be referenced in any page margin box using the <code class="rounded bg-gray-100 px-1">string()</code> function.
      </p>
      <p class="text-gray-700">
        This approach is particularly useful for long documents like reports, manuals, or books where readers need to quickly identify which document they are reading and navigate by page number. The running header provides persistent context without taking up space in the main content area.
      </p>
      <p class="text-gray-700">
        Paged.js faithfully implements the W3C CSS Paged Media specification, which means these features work consistently and predictably. The specification defines a rich set of margin boxes — 16 in total — that can be used for headers, footers, and side annotations.
      </p>

      <h2 class="mt-8 text-xl font-semibold text-gray-800">
        Chapter 3: Advanced Features
      </h2>
      <p class="text-gray-700">
        Beyond simple running headers, paged.js supports multiple named strings, allowing different parts of the document to contribute different values to different margin boxes. For example, you could have the document title in the top-center and the current chapter name in the top-left.
      </p>
      <p class="text-gray-700">
        The footer in this example uses both <code class="rounded bg-gray-100 px-1">counter(page)</code> for the current page number and <code class="rounded bg-gray-100 px-1">counter(pages)</code> for the total page count. This combination gives readers a clear sense of their position within the document.
      </p>
      <p class="text-gray-700">
        You can also control when string values are updated using the <code class="rounded bg-gray-100 px-1">string-set</code> property on different elements throughout the document. As paged.js encounters these elements during pagination, it updates the named string value, which then appears in subsequent page margin boxes.
      </p>
      <p class="text-gray-700">
        The margin boxes themselves can be styled with CSS properties like font-size, color, font-weight, and more. This allows you to create professional-looking headers and footers that match the overall design of your document.
      </p>

      <h2 class="mt-8 text-xl font-semibold text-gray-800">
        Chapter 4: Best Practices
      </h2>
      <p class="text-gray-700">
        When designing documents with running headers, keep the header content concise. Long titles may overflow the margin box, so consider using a shortened version of the title for the running header if the full title is very long.
      </p>
      <p class="text-gray-700">
        Page margins should be large enough to accommodate the header and footer content without crowding the main content area. A margin of at least 20mm on the top and bottom is recommended when using running headers and footers.
      </p>
      <p class="text-gray-700">
        Test your documents with varying content lengths to ensure the pagination works correctly. Paged.js handles page breaks automatically, but you may want to add explicit break hints using CSS properties like <code class="rounded bg-gray-100 px-1">break-before</code> and <code class="rounded bg-gray-100 px-1">break-after</code> for better control.
      </p>
      <p class="text-gray-700">
        Finally, consider accessibility when adding running headers. Screen readers may not process paged media margin boxes, so ensure that all important information is also present in the main document content.
      </p>
    </div>
    <!-- eslint-disable-next-line vue/no-useless-v-bind -->
    <component :is="'style'">
      @page {
      margin: 25mm 20mm;
      @top-center {
      content: string(doc-title);
      font-size: 10pt;
      color: #4b5563;
      }
      @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 9pt;
      color: #6b7280;
      }
      }
      .doc-title {
      string-set: doc-title content(text);
      }
    </component>
  </div>
</template>
