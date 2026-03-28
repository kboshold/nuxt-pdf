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
  // Form sends plain text — parse into structured arrays for the template
  if (typeof body.skills === 'string') {
    body.skills = body.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
  }
  if (typeof body.experience === 'string') {
    body.experience = body.experience.split('\n').filter(Boolean).map((line: string) => {
      // Parse "Role at Company (period)" format
      const atIdx = line.indexOf(' at ')
      if (atIdx === -1) {
        return { role: line, company: '', period: '' }
      }
      const role = line.slice(0, atIdx)
      const rest = line.slice(atIdx + 4)
      const parenIdx = rest.lastIndexOf('(')
      if (parenIdx === -1) {
        return { role, company: rest.trim(), period: '' }
      }
      return { role, company: rest.slice(0, parenIdx).trim(), period: rest.slice(parenIdx + 1, -1).trim() }
    })
  }
  if (typeof body.education === 'string') {
    body.education = body.education.split('\n').filter(Boolean).map((line: string) => {
      // Parse "Degree, Institution (year)" or "Degree, Institution, Year"
      const parenIdx = line.lastIndexOf('(')
      const base = parenIdx >= 0 ? line.slice(0, parenIdx).trim() : line
      const year = parenIdx >= 0 ? line.slice(parenIdx + 1, -1).trim() : ''
      const commaIdx = base.indexOf(',')
      if (commaIdx === -1) {
        return { degree: base, institution: '', year }
      }
      return { degree: base.slice(0, commaIdx).trim(), institution: base.slice(commaIdx + 1).trim(), year }
    })
  }
  const props = { ...defaults, ...body }
  return sendPDFWithMetrics(event, ResumeTemplate, props, { filename: 'resume.pdf' })
})
