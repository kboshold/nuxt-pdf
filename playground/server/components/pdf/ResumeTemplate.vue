<script setup lang="ts">
import { computed } from 'vue'
import { PDFWrapper } from '../../../../src/runtime/index'

interface ExperienceEntry {
  role: string
  company: string
  period: string
  description?: string
}

interface EducationEntry {
  degree: string
  institution: string
  year: string
}

const props = defineProps<{
  name: string
  jobTitle: string
  email: string
  phone: string
  location?: string
  website?: string
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
}>()

const initials = computed(() =>
  props.name.split(' ').map(n => n[0]).join('').toUpperCase(),
)
</script>

<template>
  <PDFWrapper size="A4" :margin-top="0" :margin-right="0" :margin-bottom="0" :margin-left="0">
    <div class="flex h-[297mm] w-[210mm] text-sm">
      <!-- Left sidebar -->
      <div class="flex w-[72mm] flex-col bg-slate-800 px-6 py-10 text-white">
        <!-- Avatar / Initials -->
        <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-500 text-3xl font-bold text-white">
          {{ initials }}
        </div>

        <h1 class="mt-6 text-center text-xl font-bold leading-tight tracking-wide">
          {{ name }}
        </h1>
        <p class="mt-1 text-center text-xs font-medium uppercase tracking-widest text-blue-300">
          {{ jobTitle }}
        </p>

        <!-- Divider -->
        <div class="mx-auto mt-6 h-px w-16 bg-slate-600" />

        <!-- Contact -->
        <div class="mt-6">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Contact
          </h2>
          <div class="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
            <p>{{ email }}</p>
            <p>{{ phone }}</p>
            <p v-if="location">
              {{ location }}
            </p>
            <p v-if="website">
              {{ website }}
            </p>
          </div>
        </div>

        <!-- Skills -->
        <div class="mt-8">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Skills
          </h2>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="skill in skills"
              :key="skill"
              class="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-slate-200"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Education (in sidebar) -->
        <div class="mt-8">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Education
          </h2>
          <div class="mt-3 space-y-4">
            <div v-for="edu in education" :key="edu.degree">
              <p class="text-xs font-semibold text-white">
                {{ edu.degree }}
              </p>
              <p class="mt-0.5 text-[10px] text-slate-300">
                {{ edu.institution }}
              </p>
              <p class="text-[10px] text-slate-400">
                {{ edu.year }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right main content -->
      <div class="flex w-[138mm] flex-col px-8 py-10">
        <!-- Summary -->
        <div>
          <h2 class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <span class="h-px flex-1 bg-slate-200" />
            <span>About</span>
            <span class="h-px flex-1 bg-slate-200" />
          </h2>
          <p class="mt-4 text-xs leading-relaxed text-slate-600">
            {{ summary }}
          </p>
        </div>

        <!-- Experience -->
        <div class="mt-8">
          <h2 class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <span class="h-px flex-1 bg-slate-200" />
            <span>Experience</span>
            <span class="h-px flex-1 bg-slate-200" />
          </h2>
          <div class="mt-4 space-y-5">
            <div v-for="exp in experience" :key="exp.role + exp.company" class="relative pl-4">
              <!-- Timeline dot -->
              <div class="absolute left-0 top-1 h-2 w-2 rounded-full bg-blue-500" />
              <div class="flex items-baseline justify-between">
                <h3 class="text-sm font-semibold text-slate-800">
                  {{ exp.role }}
                </h3>
                <span class="ml-2 shrink-0 text-[10px] text-slate-400">{{ exp.period }}</span>
              </div>
              <p class="mt-0.5 text-xs font-medium text-blue-600">
                {{ exp.company }}
              </p>
              <p v-if="exp.description" class="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                {{ exp.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PDFWrapper>
</template>
