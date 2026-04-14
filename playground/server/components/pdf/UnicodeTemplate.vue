<script setup lang="ts">
defineProps<{ customText: string }>()

const sections = [
  {
    title: 'Emojis',
    note: 'Color emoji incl. skin-tone + ZWJ sequences',
    samples: [
      '🎉 🌍 💻 📄 🔥 🚀 ✨ 🎨 📊 🧪',
      '👋🏻 👋🏼 👋🏽 👋🏾 👋🏿',
      '👨‍👩‍👧‍👦 👩‍💻 🧑‍🚀 🏳️‍🌈 🏴‍☠️',
    ],
  },
  {
    title: 'CJK (Chinese · Japanese · Korean)',
    note: 'Han, Hiragana, Katakana, Hangul',
    samples: ['你好，世界！', 'こんにちは、世界！', '안녕하세요, 세계!'],
  },
  {
    title: 'Cyrillic · Greek',
    note: 'Russian, Ukrainian, Greek',
    samples: ['Привет, мир!', 'Слава Україні!', 'Γειά σου Κόσμε!'],
  },
  {
    title: 'Diacritics & Ligatures',
    note: 'Western European accents',
    samples: ['àáâãäå æ ç èéêë ìíîï ñ òóôõö ø ùúûü ß', 'Piñata crème brûlée jalapeño Zürich'],
  },
  {
    title: 'Mathematical Symbols',
    note: 'Greek letters, operators, set theory',
    samples: ['∑ ∫ ∞ ≠ ≈ ≤ ≥ √ π ∂ ∇ ∈ ∉ ⊂ ⊆ ∪ ∩ ∅', 'α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω'],
  },
  {
    title: 'Currency',
    note: 'Global currency symbols',
    samples: ['$ € £ ¥ ₹ ₽ ₿ ¢ ₩ ₺ ₪ ₫ ₴ ₦'],
  },
  {
    title: 'Arrows & Misc',
    note: 'Directional, suits, stars',
    samples: ['← → ↑ ↓ ↔ ↕ ⇐ ⇒ ⇑ ⇓ ⇔', '♠ ♥ ♦ ♣ ★ ☆ ☀ ☁ ☂ ☃ ❄ ⚡ ☎ ✉ ✓ ✗'],
  },
]
</script>

<template>
  <div
    class="unicode-demo p-8 text-gray-800"
    style="font-family: system-ui, 'Noto Color Emoji', 'Noto Sans CJK SC', 'Noto Sans CJK JP', 'Noto Sans CJK KR', 'Noto Sans Arabic', 'Noto Sans Hebrew', sans-serif;"
  >
    <header class="mb-6 border-b-2 border-blue-600 pb-3">
      <h1 class="text-3xl font-bold text-blue-700">
        Unicode &amp; Emoji Showcase 🌐
      </h1>
      <p class="mt-1 text-sm text-gray-600">
        Proof that @sidebase/nuxt-pdf renders the full UTF-8 range — emojis, CJK, RTL, math, currency.
      </p>
    </header>

    <section class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Your custom input
      </h2>
      <p class="whitespace-pre-wrap text-base">
        {{ customText }}
      </p>
    </section>

    <div class="columns-2 gap-4">
      <section
        v-for="section in sections"
        :key="section.title"
        class="mb-4 rounded-lg border border-gray-200 p-4"
        style="break-inside: avoid; page-break-inside: avoid; display: inline-block; width: 100%;"
      >
        <h2 class="text-base font-semibold text-gray-900">
          {{ section.title }}
        </h2>
        <p class="mb-2 text-xs text-gray-500">
          {{ section.note }}
        </p>
        <ul class="space-y-1 text-sm text-gray-800">
          <li v-for="(sample, i) in section.samples" :key="i">
            {{ sample }}
          </li>
        </ul>
      </section>

      <section
        class="mb-4 rounded-lg border border-gray-200 p-4"
        dir="rtl"
        style="break-inside: avoid; page-break-inside: avoid; display: inline-block; width: 100%;"
      >
        <h2 class="text-base font-semibold text-gray-900" dir="ltr">
          RTL — Arabic &amp; Hebrew
        </h2>
        <p class="mb-2 text-xs text-gray-500" dir="ltr">
          Right-to-left bidirectional text
        </p>
        <ul class="space-y-1 text-sm text-gray-800">
          <li lang="ar">
            مرحبا بالعالم! هذا نص عربي تجريبي.
          </li>
          <li lang="he">
            שלום עולם! זהו טקסט עברי לדוגמה.
          </li>
        </ul>
      </section>

      <section
        class="mb-4 rounded-lg border border-gray-200 p-4"
        style="break-inside: avoid; page-break-inside: avoid; display: inline-block; width: 100%;"
      >
        <h2 class="text-base font-semibold text-gray-900">
          Box Drawing
        </h2>
        <p class="mb-2 text-xs text-gray-500">
          Monospace block glyphs
        </p>
        <pre class="rounded bg-gray-100 p-2 text-xs leading-tight">┌──────────────┐
│  Hello 🌍    │
│  UTF-8 works │
└──────────────┘
╔══════════════╗
║  ░▒▓█▓▒░     ║
╚══════════════╝</pre>
      </section>
    </div>

    <footer class="mt-6 border-t border-gray-200 pt-3 text-center text-xs text-gray-500">
      If you see colored emojis, non-Latin scripts, and right-to-left text correctly — UTF-8 works end to end. ✅
    </footer>
  </div>
</template>
