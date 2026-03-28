export interface FieldDefinition {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'date'
  options?: string[]
  placeholder?: string
}

export interface ExampleDefinition {
  id: string
  name: string
  description: string
  category: 'feature' | 'real-world'
  endpoint: string
  fields: FieldDefinition[]
  defaults: Record<string, unknown>
}

const examples: ExampleDefinition[] = [
  // --- Feature Showcases ---
  {
    id: 'basic',
    name: 'Basic',
    description: 'Minimal "Hello World" PDF',
    category: 'feature',
    endpoint: '/api/pdf/basic',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Hello World' },
    ],
    defaults: { title: 'Hello World' },
  },
  {
    id: 'theming',
    name: 'Theming',
    description: 'Custom @theme colors',
    category: 'feature',
    endpoint: '/api/pdf/themed',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Themed PDF' },
    ],
    defaults: { title: 'Themed PDF' },
  },
  {
    id: 'typography',
    name: 'Typography',
    description: '@tailwindcss/typography prose',
    category: 'feature',
    endpoint: '/api/pdf/typography',
    fields: [],
    defaults: {},
  },
  {
    id: 'paged-headers',
    name: 'Paged.js Headers/Footers',
    description: 'Running headers, page numbers',
    category: 'feature',
    endpoint: '/api/pdf/paged-headers',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Document Title' },
      { key: 'author', label: 'Author', type: 'text', placeholder: 'Author Name' },
    ],
    defaults: { title: 'Document Title', author: 'Author Name' },
  },
  {
    id: 'complex-footers',
    name: 'Complex Headers/Footers',
    description: 'Multi-line footer, different first page',
    category: 'feature',
    endpoint: '/api/pdf/complex-footers',
    fields: [
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
      { key: 'documentId', label: 'Document ID', type: 'text', placeholder: 'DOC-2024-001' },
    ],
    defaults: { company: 'Acme Corp', documentId: 'DOC-2024-001' },
  },
  {
    id: 'no-pagedjs',
    name: 'No Paged.js',
    description: 'Chrome-native @page rules',
    category: 'feature',
    endpoint: '/api/pdf/no-pagedjs',
    fields: [],
    defaults: {},
  },
  {
    id: 'debug',
    name: 'Debug Overlays',
    description: 'Ruler + margin visualization',
    category: 'feature',
    endpoint: '/api/pdf/debug',
    fields: [],
    defaults: {},
  },
  {
    id: 'landscape',
    name: 'Landscape',
    description: 'Landscape A4 orientation',
    category: 'feature',
    endpoint: '/api/pdf/landscape',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Landscape PDF' },
    ],
    defaults: { title: 'Landscape PDF' },
  },
  {
    id: 'custom-size',
    name: 'Custom Page Size',
    description: 'Shipping-label-sized output',
    category: 'feature',
    endpoint: '/api/pdf/custom-size',
    fields: [
      { key: 'labelText', label: 'Label Text', type: 'text', placeholder: 'FRAGILE' },
    ],
    defaults: { labelText: 'FRAGILE' },
  },

  // --- Real-World Templates ---
  {
    id: 'invoice',
    name: 'Invoice',
    description: 'Line items, tax, totals',
    category: 'real-world',
    endpoint: '/api/pdf/invoice',
    fields: [
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
      { key: 'recipient', label: 'Recipient', type: 'text', placeholder: 'John Doe' },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number', placeholder: '19' },
    ],
    defaults: {
      company: 'Acme Corp',
      recipient: 'John Doe',
      items: [
        { description: 'Web Development', quantity: 40, unitPrice: 120 },
        { description: 'UI Design', quantity: 20, unitPrice: 95 },
        { description: 'Hosting (annual)', quantity: 1, unitPrice: 480 },
      ],
      taxRate: 19,
    },
  },
  {
    id: 'letter',
    name: 'Business Letter',
    description: 'DIN 676 Form B',
    category: 'real-world',
    endpoint: '/api/pdf/letter',
    fields: [
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
      { key: 'recipient', label: 'Recipient', type: 'text', placeholder: 'John Doe' },
      { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Important Notice' },
      { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Dear Mr. Doe...' },
    ],
    defaults: {
      company: 'Acme Corp',
      recipient: 'John Doe',
      subject: 'Important Notice',
      body: 'Dear Mr. Doe,\n\nThank you for your inquiry. We are pleased to inform you that your request has been processed successfully.\n\nBest regards,\nAcme Corp',
    },
  },
  {
    id: 'resume',
    name: 'Resume/CV',
    description: 'Multi-section professional CV',
    category: 'real-world',
    endpoint: '/api/pdf/resume',
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Jane Smith' },
      { key: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Senior Developer' },
      { key: 'email', label: 'Email', type: 'text', placeholder: 'jane@example.com' },
      { key: 'phone', label: 'Phone', type: 'text', placeholder: '+1 555-0123' },
      { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Experienced developer...' },
      { key: 'experience', label: 'Experience', type: 'textarea', placeholder: 'Senior Dev at Acme Corp (2020-present)...' },
      { key: 'education', label: 'Education', type: 'textarea', placeholder: 'B.Sc. Computer Science...' },
      { key: 'skills', label: 'Skills', type: 'textarea', placeholder: 'TypeScript, Vue, Node.js...' },
    ],
    defaults: {
      name: 'Jane Smith',
      jobTitle: 'Senior Developer',
      email: 'jane@example.com',
      phone: '+1 555-0123',
      summary: 'Experienced full-stack developer with 8+ years building web applications.',
      experience: 'Senior Software Engineer at Sidebase GmbH (2022–present)\nFull-Stack Developer at StartupXYZ (2019–2022)\nJunior Developer at WebAgency Co. (2016–2019)',
      education: 'M.Sc. Computer Science, TU Berlin (2016)\nB.Sc. Computer Science, University of Munich (2014)',
      skills: 'TypeScript, Vue, React, Node.js, PostgreSQL, Docker',
    },
  },
  {
    id: 'certificate',
    name: 'Certificate',
    description: 'Award/completion certificate',
    category: 'real-world',
    endpoint: '/api/pdf/certificate',
    fields: [
      { key: 'recipientName', label: 'Recipient', type: 'text', placeholder: 'Jane Smith' },
      { key: 'courseName', label: 'Course', type: 'text', placeholder: 'Advanced Vue.js' },
      { key: 'completionDate', label: 'Date', type: 'date' },
      { key: 'issuerName', label: 'Issuer', type: 'text', placeholder: 'Vue Academy' },
    ],
    defaults: {
      recipientName: 'Jane Smith',
      courseName: 'Advanced Vue.js',
      completionDate: '2024-12-15',
      issuerName: 'Vue Academy',
    },
  },
  {
    id: 'report',
    name: 'Report',
    description: 'Multi-page with tables',
    category: 'real-world',
    endpoint: '/api/pdf/report',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Annual Report 2024' },
      { key: 'author', label: 'Author', type: 'text', placeholder: 'Acme Corp' },
      { key: 'sections', label: 'Sections', type: 'number', placeholder: '5' },
    ],
    defaults: { title: 'Annual Report 2024', author: 'Acme Corp', sections: 5 },
  },
  {
    id: 'label',
    name: 'Shipping Label',
    description: 'Small-format label',
    category: 'real-world',
    endpoint: '/api/pdf/label',
    fields: [
      { key: 'senderName', label: 'Sender Name', type: 'text', placeholder: 'Acme Corp' },
      { key: 'senderAddress', label: 'Sender Address', type: 'textarea', placeholder: '123 Main St, Springfield' },
      { key: 'recipientName', label: 'Recipient Name', type: 'text', placeholder: 'John Doe' },
      { key: 'recipientAddress', label: 'Recipient Address', type: 'textarea', placeholder: '456 Oak Ave, Shelbyville' },
      { key: 'trackingNumber', label: 'Tracking Number', type: 'text', placeholder: '1Z999AA10123456784' },
    ],
    defaults: {
      senderName: 'Acme Corp',
      senderAddress: '123 Main St\nSpringfield, IL 62701',
      recipientName: 'John Doe',
      recipientAddress: '456 Oak Ave\nShelbyville, IL 62565',
      trackingNumber: '1Z999AA10123456784',
    },
  },
  {
    id: 'book',
    name: 'Book',
    description: 'Generated lorem-ipsum book',
    category: 'real-world',
    endpoint: '/api/pdf/book',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'The Art of Code' },
      { key: 'authorName', label: 'Author', type: 'text', placeholder: 'Jane Smith' },
      { key: 'chapterCount', label: 'Chapters', type: 'number', placeholder: '12' },
    ],
    defaults: { title: 'The Art of Code', authorName: 'Jane Smith', chapterCount: 12 },
  },
]

export function useExamples() {
  const featureExamples = examples.filter(e => e.category === 'feature')
  const realWorldExamples = examples.filter(e => e.category === 'real-world')

  function getExample(id: string): ExampleDefinition | undefined {
    return examples.find(e => e.id === id)
  }

  return { examples, featureExamples, realWorldExamples, getExample }
}
