<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  authorName: string
  chapterCount: number
}>()

// Deterministic seeded PRNG (mulberry32)
function createRng(seed: number) {
  let s = Math.trunc(seed)
  return () => {
    s = Math.trunc(s + 0x6D2B79F5)
    let t = Math.imul(s ^ (s >>> 15), Math.trunc(1 | s))
    t = (t + Math.imul(t ^ (t >>> 7), Math.trunc(61 | t))) ^ t
    return Math.abs(t ^ (t >>> 14)) / 4294967296
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = Math.trunc((hash << 5) - hash + (str.codePointAt(i) ?? 0))
  }
  return hash
}

const rng = createRng(hashString(props.title))

// Lorem ipsum word pool
const words = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'porta',
  'nibh',
  'venenatis',
  'cras',
  'fermentum',
  'odio',
  'eu',
  'feugiat',
  'pretium',
  'lectus',
  'quam',
  'pellentesque',
  'nec',
  'nam',
  'aliquam',
  'sem',
  'tortor',
  'consequuntur',
  'vel',
  'augue',
  'praesent',
  'elementum',
  'facilisis',
  'leo',
  'dictum',
  'viverra',
  'maecenas',
  'accumsan',
  'lacus',
  'posuere',
  'morbi',
  'tristique',
  'senectus',
  'netus',
  'fames',
  'turpis',
  'egestas',
  'pharetra',
  'massa',
  'ultricies',
  'mi',
  'tempus',
  'imperdiet',
  'ac',
  'tincidunt',
  'vitae',
]

function generateSentence(): string {
  const len = Math.floor(rng() * 12) + 8
  const s = []
  for (let i = 0; i < len; i++) {
    s.push(words[Math.floor(rng() * words.length)])
  }
  const first = s[0] as string
  s[0] = first.charAt(0).toUpperCase() + first.slice(1)
  return `${s.join(' ')}.`
}

function generateParagraph(): string {
  const count = Math.floor(rng() * 4) + 5
  const sentences = []
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

// Generate ~20 pages of content per chapter (~30 paragraphs)
function generateChapterContent(): string[] {
  const paraCount = Math.floor(rng() * 6) + 28
  const paragraphs = []
  for (let i = 0; i < paraCount; i++) {
    paragraphs.push(generateParagraph())
  }
  return paragraphs
}

// Deterministic chapter names
const chapterNames = [
  'The Foundations of Digital Typography',
  'Understanding Page Layout Systems',
  'Vector Graphics and Rendering Pipelines',
  'Color Theory for Print Media',
  'Font Embedding and Subsetting',
  'The Evolution of PDF Standards',
  'Browser-Based Rendering Engines',
  'CSS Paged Media Specification',
  'Margin Boxes and Running Elements',
  'Cross-References and Bookmarks',
  'Accessibility in Generated Documents',
  'Performance Optimization Strategies',
  'Image Compression Techniques',
  'Table Layout Algorithms',
  'Hyphenation and Justification',
  'Multi-Language Support',
  'Digital Signatures and Security',
  'Archival Formats and Long-Term Preservation',
  'Automated Document Workflows',
  'The Future of Document Generation',
  'Advanced Template Composition',
  'Server-Side Rendering Patterns',
  'Content Negotiation Strategies',
  'Streaming and Chunked Output',
  'Testing Document Generation',
]

const chapters = computed(() => {
  const count = Math.min(Math.max(props.chapterCount, 1), chapterNames.length)
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    name: chapterNames[i],
    paragraphs: generateChapterContent(),
  }))
})
</script>

<template>
  <div class="book">
    <!-- String-set elements -->
    <span class="string-book-title">{{ title }}</span>

    <!-- Title Page -->
    <div class="title-page">
      <div class="title-content">
        <div class="mb-8 h-1 w-32 bg-gray-800" />
        <h1 class="text-5xl font-light leading-tight text-gray-900">
          {{ title }}
        </h1>
        <div class="mt-6 h-px w-48 bg-gray-400" />
        <p class="mt-6 text-lg text-gray-500">
          {{ authorName }}
        </p>
      </div>
    </div>

    <!-- Table of Contents -->
    <div class="toc">
      <h2 class="text-3xl font-light text-gray-800">
        Contents
      </h2>
      <div class="mt-8 space-y-2">
        <div
          v-for="chapter in chapters"
          :key="chapter.number"
          class="flex items-baseline gap-3"
        >
          <span class="w-8 text-right text-sm text-gray-400">{{ chapter.number }}</span>
          <span class="text-sm text-gray-700">{{ chapter.name }}</span>
          <span class="flex-1 border-b border-dotted border-gray-300" />
        </div>
      </div>
    </div>

    <!-- Chapters -->
    <div
      v-for="chapter in chapters"
      :key="chapter.number"
      class="chapter"
    >
      <!-- Chapter title page -->
      <div class="chapter-title-page">
        <p class="text-sm uppercase tracking-[0.3em] text-gray-400">
          Chapter {{ chapter.number }}
        </p>
        <h2 class="string-chapter-title mt-3 text-3xl font-light text-gray-800">
          {{ chapter.name }}
        </h2>
        <div class="mt-4 h-px w-24 bg-gray-400" />
      </div>

      <!-- Chapter content -->
      <div class="chapter-body">
        <p
          v-for="(para, pi) in chapter.paragraphs"
          :key="pi"
          class="chapter-paragraph"
        >
          {{ para }}
        </p>
      </div>
    </div>

    <!-- eslint-disable-next-line vue/no-useless-v-bind -->
    <component :is="'style'">
      .string-book-title {
      display: none;
      string-set: book-title content(text);
      }
      .string-chapter-title {
      string-set: chapter-title content(text);
      }
      @page {
      margin: 20mm 18mm 22mm 18mm;
      size: A4;
      @top-left {
      content: string(chapter-title);
      font-size: 8pt;
      color: #9ca3af;
      font-style: italic;
      }
      @top-right {
      content: string(book-title);
      font-size: 8pt;
      color: #9ca3af;
      }
      @bottom-center {
      content: counter(page);
      font-size: 8pt;
      color: #9ca3af;
      }
      }
      @page :first {
      @top-left { content: none; }
      @top-right { content: none; }
      @bottom-center { content: none; }
      }
      .title-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 85vh;
      text-align: center;
      }
      .toc { break-before: page; }
      .chapter { break-before: page; }
      .chapter-title-page {
      padding-top: 30vh;
      text-align: center;
      break-after: page;
      }
      .chapter-body { text-align: justify; }
      .chapter-paragraph {
      margin-top: 0.75em;
      font-size: 10pt;
      line-height: 1.6;
      color: #374151;
      text-indent: 1.5em;
      }
      .chapter-paragraph:first-child { text-indent: 0; }
    </component>
  </div>
</template>
