import ResumeTemplate from '../../components/pdf/ResumeTemplate.vue'

export default defineEventHandler(async (event) => {
  const defaults = {
    name: 'Jane Smith',
    jobTitle: 'Senior Software Engineer',
    email: 'jane@example.com',
    phone: '+1 555-0123',
    summary: 'Experienced full-stack developer with 8+ years building scalable web applications. Passionate about clean architecture, developer experience, and open-source tooling. Strong background in TypeScript, Vue, and cloud-native infrastructure.',
    experience: 'Senior Software Engineer at Sidebase GmbH (2022–present)\nFull-Stack Developer at StartupXYZ (2019–2022)\nJunior Developer at WebAgency Co. (2016–2019)',
    education: 'M.Sc. Computer Science, TU Berlin (2016)\nB.Sc. Computer Science, University of Munich (2014)',
    skills: 'TypeScript, Vue, React, Node.js, PostgreSQL, Docker, Kubernetes, AWS, GraphQL, Tailwind CSS',
  }
  const body = event.method === 'POST' ? await readBody(event) : {}
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, ResumeTemplate, props, { filename: 'resume.pdf' })
})
