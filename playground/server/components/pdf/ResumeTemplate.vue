<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  jobTitle: string
  email: string
  phone: string
  summary: string
  experience: string
  education: string
  skills: string
}>()

const skillsList = computed(() =>
  props.skills.split(',').map(s => s.trim()).filter(Boolean),
)

const experienceEntries = computed(() =>
  props.experience.split('\n').filter(Boolean),
)

const educationEntries = computed(() =>
  props.education.split('\n').filter(Boolean),
)
</script>

<template>
  <div class="flex min-h-[297mm] text-sm">
    <!-- Left sidebar -->
    <div class="w-[30%] bg-gray-800 p-8 text-white">
      <h1 class="text-2xl font-bold leading-tight">
        {{ name }}
      </h1>
      <p class="mt-1 text-sm font-medium text-blue-300">
        {{ jobTitle }}
      </p>

      <!-- Contact -->
      <div class="mt-8">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Contact
        </h2>
        <div class="mt-3 space-y-2 text-xs text-gray-300">
          <p>{{ email }}</p>
          <p>{{ phone }}</p>
        </div>
      </div>

      <!-- Skills -->
      <div class="mt-8">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Skills
        </h2>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="skill in skillsList"
            :key="skill"
            class="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs text-gray-200"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <!-- Right main content -->
    <div class="w-[70%] p-8">
      <!-- Summary -->
      <div>
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Professional Summary
        </h2>
        <p class="mt-3 leading-relaxed text-gray-700">
          {{ summary }}
        </p>
      </div>

      <!-- Experience -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Experience
        </h2>
        <ul class="mt-3 space-y-2">
          <li
            v-for="entry in experienceEntries"
            :key="entry"
            class="text-gray-700"
          >
            {{ entry }}
          </li>
        </ul>
      </div>

      <!-- Education -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Education
        </h2>
        <ul class="mt-3 space-y-2">
          <li
            v-for="entry in educationEntries"
            :key="entry"
            class="text-gray-700"
          >
            {{ entry }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
