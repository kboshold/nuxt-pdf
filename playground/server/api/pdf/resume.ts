import ResumeTemplate from '../../components/pdf/ResumeTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    name: 'Jane Smith',
    jobTitle: 'Senior Software Engineer',
    email: 'jane@example.com',
    phone: '+1 555-0123',
    location: 'Berlin, Germany',
    website: 'janesmith.dev',
    summary: 'Experienced full-stack developer with 8+ years building scalable web applications. Passionate about clean architecture, developer experience, and open-source tooling. Strong background in TypeScript, Vue, and cloud-native infrastructure.',
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'Sidebase GmbH',
        period: '2022 – present',
        description: 'Leading frontend architecture for enterprise SaaS platform. Built a Nuxt-based PDF generation module used across 12 client projects.',
      },
      {
        role: 'Full-Stack Developer',
        company: 'StartupXYZ',
        period: '2019 – 2022',
        description: 'Developed real-time collaboration features using Vue 3 and WebSockets. Reduced page load times by 40% through SSR optimization.',
      },
      {
        role: 'Junior Developer',
        company: 'WebAgency Co.',
        period: '2016 – 2019',
        description: 'Built responsive web applications for various clients. Introduced TypeScript to the team\'s workflow.',
      },
    ],
    education: [
      { degree: 'M.Sc. Computer Science', institution: 'TU Berlin', year: '2016' },
      { degree: 'B.Sc. Computer Science', institution: 'University of Munich', year: '2014' },
    ],
    skills: ['TypeScript', 'Vue', 'Nuxt', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Tailwind CSS'],
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, ResumeTemplate, props, { filename: 'resume.pdf' })
})
