<script setup lang="ts">
const props = defineProps<{
  title: string
  author: string
  sections: number
}>()

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const sectionData = computed(() => {
  const templates = [
    {
      title: 'Executive Summary',
      paragraphs: [
        'This report provides a comprehensive overview of organizational performance metrics, key achievements, and strategic initiatives undertaken during the reporting period. The data presented reflects our commitment to continuous improvement and operational excellence.',
        'Overall performance indicators show positive trends across most departments, with notable improvements in customer satisfaction scores and operational efficiency. Revenue targets have been met or exceeded in the majority of business units.',
        'The following sections detail specific performance areas, providing both quantitative analysis and qualitative assessments. Recommendations for future quarters are included at the conclusion of each section.',
      ],
      hasTable: false,
    },
    {
      title: 'Financial Performance',
      paragraphs: [
        'Financial results for the reporting period demonstrate solid growth across key revenue streams. The organization maintained disciplined cost management while investing in strategic growth initiatives.',
        'Operating margins improved by 2.3 percentage points compared to the previous quarter, driven by efficiency gains in production and a favorable product mix shift toward higher-margin offerings.',
      ],
      hasTable: true,
      tableTitle: 'Quarterly Financial Summary',
      tableHeaders: ['Metric', 'Q3 2026', 'Q4 2026', 'Change'],
      tableRows: [
        ['Revenue', '€2.4M', '€2.8M', '+16.7%'],
        ['Gross Margin', '62.1%', '64.4%', '+2.3pp'],
        ['Operating Expenses', '€1.1M', '€1.15M', '+4.5%'],
        ['Net Income', '€380K', '€470K', '+23.7%'],
        ['EBITDA', '€520K', '€640K', '+23.1%'],
      ],
    },
    {
      title: 'Customer Analytics',
      paragraphs: [
        'Customer acquisition and retention metrics indicate healthy growth in our user base. New customer onboarding improved significantly following the implementation of the streamlined registration process.',
        'Customer satisfaction scores, measured through NPS surveys, reached an all-time high during the reporting period. Support ticket resolution times decreased by 18% while maintaining quality standards.',
      ],
      hasTable: true,
      tableTitle: 'Customer Metrics Overview',
      tableHeaders: ['Metric', 'Previous', 'Current', 'Target'],
      tableRows: [
        ['Active Users', '12,450', '14,820', '14,000'],
        ['NPS Score', '42', '51', '45'],
        ['Churn Rate', '3.2%', '2.8%', '3.0%'],
        ['Avg. Resolution Time', '4.2h', '3.4h', '4.0h'],
        ['Support Satisfaction', '87%', '91%', '90%'],
      ],
    },
    {
      title: 'Operational Efficiency',
      paragraphs: [
        'Operational improvements continued throughout the quarter with significant investments in automation and process optimization. The deployment pipeline now supports continuous delivery with an average release cycle of 2.3 days.',
        'Infrastructure costs were reduced through improved resource allocation and the migration of legacy workloads to cloud-native architectures. System uptime maintained at 99.97% throughout the period.',
        'Team productivity metrics show sustained improvement, with sprint velocity increasing by 12% while maintaining code quality standards as measured by automated testing coverage and defect density.',
      ],
      hasTable: false,
    },
    {
      title: 'Strategic Initiatives',
      paragraphs: [
        'Several key strategic initiatives were advanced during the reporting period. The platform modernization project completed its second milestone, delivering a redesigned API layer that supports 3x the previous throughput capacity.',
        'Partnership development yielded two new integration agreements with enterprise clients, expanding the addressable market by an estimated 15%. These partnerships are expected to generate revenue beginning in Q1 of the next fiscal year.',
      ],
      hasTable: true,
      tableTitle: 'Initiative Status Tracker',
      tableHeaders: ['Initiative', 'Status', 'Completion', 'Impact'],
      tableRows: [
        ['Platform Modernization', 'On Track', '65%', 'High'],
        ['Enterprise Partnerships', 'Complete', '100%', 'High'],
        ['AI Integration Pilot', 'In Progress', '40%', 'Medium'],
        ['Security Hardening', 'On Track', '80%', 'Critical'],
        ['Mobile App Redesign', 'Planning', '10%', 'Medium'],
      ],
    },
    {
      title: 'Market Analysis',
      paragraphs: [
        'The competitive landscape continues to evolve with new market entrants focusing on niche segments. Our market position remains strong in core verticals, with growing mindshare in adjacent markets.',
        'Pricing analysis indicates our positioning remains competitive while maintaining healthy margins. Customer feedback suggests strong value perception relative to alternatives.',
        'Emerging trends in the market include increased demand for AI-powered features, enhanced security capabilities, and seamless integration with third-party ecosystems. Our product roadmap is well-aligned with these trends.',
      ],
      hasTable: false,
    },
    {
      title: 'Team & Culture',
      paragraphs: [
        'The organization continued to invest in talent development and workplace culture initiatives. Employee satisfaction scores increased by 8 points, reflecting improvements in work-life balance policies and professional development opportunities.',
        'Hiring goals were met across all departments, with particular success in engineering recruitment. The new mentorship program launched successfully with 45 active mentor-mentee pairs.',
      ],
      hasTable: true,
      tableTitle: 'Team Growth Summary',
      tableHeaders: ['Department', 'Headcount', 'Open Roles', 'Satisfaction'],
      tableRows: [
        ['Engineering', '48', '5', '4.3/5'],
        ['Product', '12', '2', '4.5/5'],
        ['Sales', '18', '3', '4.1/5'],
        ['Support', '15', '1', '4.4/5'],
        ['Operations', '8', '0', '4.2/5'],
      ],
    },
    {
      title: 'Risk Assessment',
      paragraphs: [
        'The risk management framework was updated to reflect changing market conditions and regulatory requirements. Key risk areas have been identified and mitigation strategies are in place for each.',
        'Cybersecurity posture was strengthened through implementation of zero-trust architecture principles and enhanced monitoring capabilities. No significant security incidents occurred during the reporting period.',
        'Supply chain risks remain elevated due to global economic conditions. Diversification of key vendors has been prioritized to reduce single-point-of-failure exposure.',
      ],
      hasTable: false,
    },
  ]

  const count = Math.min(Math.max(props.sections, 1), templates.length)
  return templates.slice(0, count)
})
</script>

<template>
  <div class="report">
    <!-- String-set for running header -->
    <span class="string-title">{{ title }}</span>

    <!-- Cover Page -->
    <div class="cover">
      <div class="cover-content">
        <div class="cover-logo">
          <div class="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-700 text-2xl font-bold text-white">
            S
          </div>
        </div>
        <h1 class="mt-8 text-4xl font-bold text-gray-900">
          {{ title }}
        </h1>
        <p class="mt-3 text-lg text-gray-500">
          Prepared by {{ author }}
        </p>
        <p class="mt-1 text-sm text-gray-400">
          {{ currentDate }}
        </p>
        <div class="mt-8 h-1 w-24 bg-blue-700" />
        <p class="mt-6 text-xs text-gray-400">
          CONFIDENTIAL
        </p>
      </div>
    </div>

    <!-- Table of Contents -->
    <div class="toc">
      <h2 class="text-2xl font-bold text-gray-800">
        Table of Contents
      </h2>
      <div class="mt-6 space-y-3">
        <div
          v-for="(section, i) in sectionData"
          :key="i"
          class="flex items-baseline gap-2"
        >
          <span class="font-medium text-gray-700">{{ i + 1 }}.</span>
          <span class="text-gray-700">{{ section.title }}</span>
          <span class="flex-1 border-b border-dotted border-gray-300" />
        </div>
      </div>
    </div>

    <!-- Content Sections -->
    <div
      v-for="(section, i) in sectionData"
      :key="i"
      class="section"
    >
      <h2 class="text-2xl font-bold text-gray-800">
        {{ i + 1 }}. {{ section.title }}
      </h2>

      <p
        v-for="(para, j) in section.paragraphs"
        :key="j"
        class="mt-4 text-sm leading-relaxed text-gray-700"
      >
        {{ para }}
      </p>

      <!-- Data table for sections that have one -->
      <div
        v-if="section.hasTable"
        class="mt-6"
      >
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {{ section.tableTitle }}
        </p>
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b-2 border-gray-300">
              <th
                v-for="header in section.tableHeaders"
                :key="header"
                class="py-2 text-left text-xs font-semibold uppercase text-gray-500"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, ri) in section.tableRows"
              :key="ri"
              class="border-b border-gray-200"
            >
              <td
                v-for="(cell, ci) in row"
                :key="ci"
                class="py-2 text-gray-700"
                :class="{ 'font-medium': ci === 0 }"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.string-title {
  display: none;
  string-set: report-title content(text);
}

@page {
  margin: 25mm 20mm 25mm 20mm;

  @top-center {
    content: string(report-title);
    font-size: 8pt;
    color: #9ca3af;
  }

  @bottom-center {
    content: "Page " counter(page) " of " counter(pages);
    font-size: 8pt;
    color: #9ca3af;
  }
}

@page :first {
  @top-center {
    content: none;
  }
  @bottom-center {
    content: none;
  }
}

.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.cover-content {
  text-align: center;
}

.toc {
  break-before: page;
  padding: 0 8px;
}

.section {
  break-before: page;
  padding: 0 8px;
}
</style>
