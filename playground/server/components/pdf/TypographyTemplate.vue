<template>
  <div class="p-8 prose prose-lg max-w-none">
    <h1>Typography Example</h1>
    <p>This PDF demonstrates <strong>@tailwindcss/typography</strong> prose styling. All content below is rendered with the <code>prose</code> class.</p>
    <h2>Features</h2>
    <ul>
      <li>Headings with proper spacing and sizing</li>
      <li>Paragraphs with comfortable line height</li>
      <li>Lists with consistent indentation</li>
      <li><code>Inline code</code> with subtle background</li>
    </ul>
    <blockquote>
      <p>Blockquotes are styled with a left border and italic text, providing visual distinction for quoted content.</p>
    </blockquote>
    <h3>Code Block</h3>
    <pre><code>const pdf = usePDF()
await pdf.sendPDF(event, MyTemplate)</code></pre>
    <p>The typography plugin handles all of these styles automatically when the <code>prose</code> class is applied.</p>
  </div>
</template>
