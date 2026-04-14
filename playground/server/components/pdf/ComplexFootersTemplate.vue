<script setup lang="ts">
defineProps<{ company: string, documentId: string }>()

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
</script>

<template>
  <div class="complex-footers">
    <!-- String-set elements for paged.js margin boxes -->
    <span class="string-company">{{ company }}</span>
    <span class="string-doc-id">{{ documentId }}</span>
    <span class="string-date">{{ currentDate }}</span>

    <!-- Cover page -->
    <div class="cover">
      <div class="cover-content">
        <p class="text-sm font-medium uppercase tracking-widest text-gray-400">
          {{ company }}
        </p>
        <h1 class="mt-4 text-4xl font-bold text-gray-900">
          Technical Report
        </h1>
        <p class="mt-2 text-lg text-gray-500">
          {{ documentId }}
        </p>
        <p class="mt-8 text-sm text-gray-400">
          {{ currentDate }}
        </p>
      </div>
    </div>

    <!-- Content pages -->
    <div class="content">
      <h2 class="text-2xl font-bold text-gray-800">
        1. Executive Summary
      </h2>
      <p class="mt-4 text-gray-700">
        This document demonstrates complex header and footer layouts using paged.js CSS margin boxes. The first page acts as a cover with no running header, while subsequent pages display the company name in the header. All pages feature a structured three-column footer.
      </p>
      <p class="mt-3 text-gray-700">
        The footer layout uses three separate margin box regions: <code class="rounded bg-gray-100 px-1">@bottom-left</code> for company information, <code class="rounded bg-gray-100 px-1">@bottom-center</code> for the document identifier and date, and <code class="rounded bg-gray-100 px-1">@bottom-right</code> for page numbering. Each region is independently styled and populated using CSS named strings.
      </p>

      <h2 class="mt-10 text-2xl font-bold text-gray-800">
        2. Implementation Details
      </h2>
      <p class="mt-4 text-gray-700">
        The cover page suppresses the running header using the <code class="rounded bg-gray-100 px-1">@page :first</code> pseudo-class, which sets the top-center content to <code class="rounded bg-gray-100 px-1">none</code>. This is a standard paged media technique for documents that begin with a title or cover page.
      </p>
      <p class="mt-3 text-gray-700">
        Named strings are defined using the <code class="rounded bg-gray-100 px-1">string-set</code> CSS property on hidden elements in the document. Paged.js extracts the text content of these elements and makes them available as named strings that can be referenced in any page margin box.
      </p>
      <p class="mt-3 text-gray-700">
        The three-column footer demonstrates how multiple margin box regions can work together to create a professional document footer. Each column serves a different purpose: identification, tracking, and navigation.
      </p>

      <h2 class="mt-10 text-2xl font-bold text-gray-800">
        3. CSS Paged Media Specification
      </h2>
      <p class="mt-4 text-gray-700">
        The W3C CSS Paged Media Module Level 3 defines 16 margin boxes around each page. These boxes are arranged in a 3x3 grid on each side of the page area, plus corner boxes. The most commonly used boxes are the top and bottom rows.
      </p>
      <p class="mt-3 text-gray-700">
        Margin boxes support most CSS properties including font styling, colors, alignment, and even content generated from counters and named strings. This makes them highly flexible for creating professional document layouts.
      </p>
      <p class="mt-3 text-gray-700">
        Page selectors like <code class="rounded bg-gray-100 px-1">:first</code>, <code class="rounded bg-gray-100 px-1">:left</code>, <code class="rounded bg-gray-100 px-1">:right</code>, and <code class="rounded bg-gray-100 px-1">:blank</code> allow different styling for different page types. Combined with named pages, this enables sophisticated layouts for books, reports, and other long-form documents.
      </p>
      <p class="mt-3 text-gray-700">
        Counter styles can be customized beyond simple decimal numbers. The specification supports roman numerals, alphabetic numbering, and custom counter styles. For example, front matter pages might use lowercase roman numerals while body pages use standard decimal numbering.
      </p>

      <h2 class="mt-10 text-2xl font-bold text-gray-800">
        4. Best Practices for Document Footers
      </h2>
      <p class="mt-4 text-gray-700">
        Professional documents typically include identification information in the footer to help with document management and version control. The company name and address establish ownership, while the document ID and date provide traceability.
      </p>
      <p class="mt-3 text-gray-700">
        Page numbering in the format "Page X of Y" gives readers a clear sense of document length and their current position. This is especially important for printed documents where navigation is purely sequential.
      </p>
      <p class="mt-3 text-gray-700">
        Footer font sizes should be smaller than body text to avoid competing for attention. A size of 7-8pt is typical for footer content, with subtle colors like gray to further distinguish it from the main content area.
      </p>
      <p class="mt-3 text-gray-700">
        When designing footers for documents that may be printed double-sided, consider using <code class="rounded bg-gray-100 px-1">@page :left</code> and <code class="rounded bg-gray-100 px-1">@page :right</code> selectors to mirror the footer layout, placing page numbers on the outside edge for easier thumb navigation.
      </p>
    </div>

    <!-- eslint-disable-next-line vue/no-useless-v-bind -->
    <component :is="'style'">
      .string-company,
      .string-doc-id,
      .string-date {
      display: none;
      }
      .string-company { string-set: company-name content(text); }
      .string-doc-id { string-set: doc-id content(text); }
      .string-date { string-set: doc-date content(text); }
      @page {
      margin: 25mm 20mm 30mm 20mm;
      @top-center {
      content: string(company-name);
      font-size: 9pt;
      color: #6b7280;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      }
      @bottom-left {
      content: string(company-name) "\A" "123 Main Street, Berlin";
      font-size: 7pt;
      color: #9ca3af;
      white-space: pre;
      vertical-align: top;
      }
      @bottom-center {
      content: string(doc-id) "\A" string(doc-date);
      font-size: 7pt;
      color: #9ca3af;
      white-space: pre;
      text-align: center;
      vertical-align: top;
      }
      @bottom-right {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 7pt;
      color: #9ca3af;
      vertical-align: top;
      }
      }
      @page :first {
      @top-center { content: none; }
      }
      .cover {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      }
      .content {
      break-before: page;
      padding: 0 8px;
      }
    </component>
  </div>
</template>
