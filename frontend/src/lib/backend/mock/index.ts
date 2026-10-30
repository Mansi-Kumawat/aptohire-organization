import type { AccessRequest, Backend, Candidate, Job, SkillCatalogItem } from '../types';

const catalog: SkillCatalogItem[] = [
  { id: 'skill-react', slug: 'react', name: 'React', family: 'Web / Frontend' },
  { id: 'skill-ts', slug: 'typescript', name: 'TypeScript', family: 'Web / Frontend' },
  { id: 'skill-js', slug: 'javascript', name: 'JavaScript', family: 'Web / Frontend' },
  { id: 'skill-node', slug: 'nodejs', name: 'Node.js', family: 'Backend' },
  { id: 'skill-testing', slug: 'testing', name: 'Testing', family: 'Web / Frontend' },
  { id: 'skill-data-vis', slug: 'data-visualization', name: 'Data visualization', family: 'Data' },
  { id: 'skill-sql', slug: 'sql', name: 'SQL', family: 'Data' },
  { id: 'skill-python', slug: 'python', name: 'Python', family: 'Data' },
  { id: 'skill-communication', slug: 'communication', name: 'Communication', family: 'Management / Commerce' }
];
const jobs: Job[] = [
  { id: 'job-react', title: 'Frontend Developer (React)', description: 'Build accessible product interfaces with a collaborative engineering team.', status: 'Open', openings: 2, mode: 'Hybrid', location: 'Jaipur', skills: ['React · Proficient', 'TypeScript · Competent'], requirements: [{ skill_id: 'skill-react', skill_slug: 'react', name: 'React', min_level: 'Proficient', weight: 1 }, { skill_id: 'skill-ts', skill_slug: 'typescript', name: 'TypeScript', min_level: 'Competent', weight: .6 }], candidates: 14, requests: 1 },
  { id: 'job-intern', title: 'Frontend Intern (React)', description: 'Learn by shipping focused frontend features with mentorship.', status: 'Open', openings: 1, mode: 'Remote', location: '', skills: ['React · Competent'], requirements: [{ skill_id: 'skill-react', skill_slug: 'react', name: 'React', min_level: 'Competent', weight: 1 }], candidates: 1, requests: 1 },
  { id: 'job-data', title: 'Data Visualization Analyst', description: 'Turn complex datasets into clear, useful visual stories.', status: 'Open', openings: 1, mode: 'Hybrid', location: 'Jaipur', skills: ['Data visualization · Proficient'], requirements: [{ skill_id: 'skill-data-vis', skill_slug: 'data-visualization', name: 'Data visualization', min_level: 'Proficient', weight: 1 }], candidates: 0, requests: 0 }
];
const wait = (ms = 350) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const candidate = (ref: string, alias: string, score: number, confidence: number, status?: string): Candidate => ({
  ref, alias, score, confidence, category: score >= .7 ? 'Tier 2 · University' : 'Tier 3 · University', stage: score >= .7 ? 'Year 3' : 'Alumni',
  projects: score >= .8 ? 3 : score >= .65 ? 2 : 1, skills: [{ name: 'React', level: 'Proficient', verified: true }, { name: 'TypeScript', level: 'Competent', verified: true }, { name: 'Testing', level: 'Competent', verified: true }],
  reason: 'Verified React work across reviewed projects.', gaps: ['No verified evidence for accessibility yet.'], status
});
const candidates: Candidate[] = [candidate('c1', 'Candidate K7F2', .86, .88, 'Requested'), candidate('c2', 'Candidate M3Q8', .81, .78, 'Accepted'), candidate('c3', 'Candidate T9R4', .66, .62), ...Array.from({ length: 11 }, (_, i) => candidate(`c${i + 4}`, `Candidate ${['P2W5', 'B8N1', 'L4D7', 'Q5J2', 'R1C9', 'V6H3', 'X3A8', 'F2K6', 'D8M4', 'H7T1', 'W9P3'][i]}`, .62 - i * .025, .61 - i * .02))];
const acceptedId = '00000000-0000-4000-8000-000000000001';
const mockRequests: AccessRequest[] = [
  { id: acceptedId, candidateRef: 'c2', jobId: 'job-react', alias: 'Candidate M3Q8', status: 'accepted', jobTitle: 'Frontend Developer (React)', requestedScope: ['profile', 'scorecard', 'projects'], grantedScope: ['profile', 'scorecard', 'projects'], durationDays: 30, createdAt: new Date(Date.now() - 86400000).toISOString(), expiresAt: new Date(Date.now() + 20 * 86400000).toISOString(), message: 'Please share your selected project information.', pipelineStage: null },
  { id: '00000000-0000-4000-8000-000000000002', candidateRef: 'c1', jobId: 'job-react', alias: 'Candidate K7F2', status: 'pending', jobTitle: 'Frontend Developer (React)', requestedScope: ['profile', 'scorecard'], grantedScope: [], durationDays: 30, createdAt: new Date().toISOString(), expiresAt: null, message: 'We would like to learn more about your skills.' }
];
const accounts: Record<string, { name: string; status: 'approved' | 'pending'; subscription: 'active' | 'inactive' }> = {
  'recruiter@orga.demo.test': { name: 'Northwind Labs', status: 'approved', subscription: 'active' },
  'recruiter@orgb.demo.test': { name: 'Brightlane', status: 'approved', subscription: 'active' },
  'recruiter@orgc.demo.test': { name: 'Orbit Analytics', status: 'pending', subscription: 'inactive' },
  'recruiter@orgd.demo.test': { name: 'Cedar Works', status: 'approved', subscription: 'inactive' }
};
export const mockBackend: Backend = {
  auth: {
    async signIn(email) { await wait(); sessionStorage.setItem('org-user', email.trim().toLowerCase()); return true; },
    async getRole() { await wait(); const email = sessionStorage.getItem('org-user'); if (!email) return null; if (email.startsWith('recruiter@org')) return 'organization'; if (email.includes('student')) return 'student'; if (email.includes('university')) return 'university'; return 'other'; },
    async signOut() { sessionStorage.removeItem('org-user'); }
  },
  organization: { async get() { await wait(); const email = sessionStorage.getItem('org-user') ?? ''; const account = accounts[email] ?? accounts['recruiter@orga.demo.test']!; return { name: account.name, status: account.status, subscription: account.subscription, verified: account.status === 'approved' }; } },
  jobs: {
    async list() { await wait(); return jobs.map((job) => ({ ...job, skills: [...job.skills], requirements: job.requirements?.map((item) => ({ ...item })) })); },
    async save(job) { await wait(); const saved = { ...job, id: job.id.startsWith('job-') ? job.id : crypto.randomUUID() }; const index = jobs.findIndex((item) => item.id === saved.id); if (index >= 0) jobs[index] = saved; else jobs.unshift(saved); return saved; },
    async skillCatalog() { await wait(150); return [...catalog]; },
    async extractSkills(description) {
      await wait(500); const text = description.toLowerCase();
      const suggestions = catalog.filter((item) => text.includes(item.name.toLowerCase())).slice(0, 8).map((item) => ({ skill_slug: item.slug, min_level: /senior|lead|advanced/i.test(text) ? 'Advanced' as const : /proficient|experienced/i.test(text) ? 'Proficient' as const : 'Competent' as const, weight: 1, name: item.name }));
      return { skills: suggestions, ...(suggestions.length ? { title_suggestion: undefined } : {}) };
    }
  },
  matching: { async list(id) { await wait(550); if (id === 'job-data') return []; if (id === 'job-intern') return [candidate('c20', 'Candidate J6P2', .73, .72, 'Declined')]; return [...candidates]; } },
  requests: {
    async create(ref, input) {
      await wait(); if (mockRequests.some((item) => item.candidateRef === ref && ['pending', 'accepted'].includes(item.status))) throw new Error('This access request already exists.');
      const person = candidates.find((item) => item.ref === ref); const job = jobs.find((item) => item.id === person?.jobId) ?? jobs[0]!;
      mockRequests.unshift({ id: crypto.randomUUID(), candidateRef: ref, jobId: job.id, alias: person?.alias ?? 'Candidate', status: 'pending', jobTitle: job.title, requestedScope: input?.scopes ?? ['profile', 'scorecard'], grantedScope: [], durationDays: input?.durationDays ?? 30, createdAt: new Date().toISOString(), expiresAt: null, message: input?.message ?? '', pipelineStage: null });
    },
    async list() { await wait(); return mockRequests.map((item) => ({ ...item, requestedScope: [...item.requestedScope], grantedScope: [...item.grantedScope] })); },
    async reveal(id) {
      await wait(); const request = mockRequests.find((item) => item.id === id && item.status === 'accepted' && item.expiresAt && Date.parse(item.expiresAt) > Date.now());
      if (!request) throw new Error('GRANT_EXPIRED');
      const granted = request.grantedScope; const result: import('../types').Reveal = { request_id: id, granted_scope: granted, expires_at: request.expiresAt! };
      if (granted.includes('profile')) result.profile = { full_name: 'Aarav Sharma', headline: 'Frontend developer', university: { name: 'Uni A', verification: 'roster' } };
      if (granted.includes('scorecard')) result.scorecard = { skills: [{ name: 'React', level: 'Proficient', score: 78, verified: true }, { name: 'TypeScript', level: 'Competent', score: 64, verified: true }] };
      if (granted.includes('projects')) result.projects = [{ id: '00000000-0000-4000-8000-000000000003', title: 'Accessible dashboard', skills: ['React', 'TypeScript'], description: 'A fictional sample project.' }];
      if (granted.includes('contact')) result.contact = { email: 'aarav@unia.edu.test' };
      return result;
    }
  },
  pipeline: { async move(id, stage) { await wait(); const row = mockRequests.find((item) => item.id === id); if (!row || row.status !== 'accepted') throw new Error('Only active accepted requests can be moved.'); row.pipelineStage = stage; } },
  directory: {
    async universities() { await wait(); return [{ id: 'uni-a', name: 'Uni A', kind: 'University', tier: 'Tier 2', city: 'Jaipur', state: 'Rajasthan' }, { id: 'uni-b', name: 'Uni B', kind: 'College', tier: 'Tier 3', city: 'Jaipur', state: 'Rajasthan' }]; },
    async organizations() { await wait(); return [{ id: 'org-a', name: 'Northwind Labs', kind: 'Corporate', size: 'Mid-size', website: 'https://northwind.example', verified: true }, { id: 'org-b', name: 'Brightlane', kind: 'Startup', size: 'Small', verified: true }]; }
  },
  notifications: { async list() { await wait(); return [{ id: 'notice-1', kind: 'access_request', payload: { title: 'Access request awaiting a response', body: 'Candidate K7F2 has not responded yet.', route: '/requests' }, createdAt: new Date().toISOString(), readAt: null }, { id: 'notice-2', kind: 'access_accepted', payload: { title: 'A student accepted a request', body: 'Candidate M3Q8 shared selected information.', route: `/requests/${acceptedId}` }, createdAt: new Date(Date.now() - 86400000).toISOString(), readAt: null }]; }, async subscribe() { return () => undefined; } }
};
