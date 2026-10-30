import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { env } from '../../../config/env';
import type { Backend, Candidate, DirectoryEntry, Job, Organization, PortalNotification, SkillCatalogItem, SkillRequirement } from '../types';

const roleSchema = z.enum(['organization', 'student', 'university', 'admin']);
const jobStatusSchema = z.enum(['open', 'paused', 'closed']);
const jobRowSchema = z.object({
  id: z.string().uuid(), title: z.string(), description: z.string().nullable().optional(),
  status: jobStatusSchema, openings: z.number().int().min(1).max(1000).default(1),
  mode: z.string().nullable().optional(), location: z.string().nullable().optional(), required_skills: z.array(z.object({
    skill_id: z.string().uuid(), min_level: z.enum(['Emerging', 'Competent', 'Proficient', 'Advanced']), weight: z.number()
  }).strict()).default([])
}).strip();
export const candidateRowSchema = z.object({
  candidate_ref: z.string().uuid(), job_id: z.string().uuid(), alias: z.string().min(1), final_score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100), reasons: z.array(z.string()).default([]), gaps: z.array(z.string()).default([]),
  structured_score: z.number().nullable().optional(), vector_score: z.number().nullable().optional(), scrubbed_summary: z.string().nullable().optional(),
  uni_category: z.string().nullable().optional(), skills: z.array(z.object({
    name: z.string(), level: z.string(), verified: z.boolean(), score: z.number().optional()
  }).strict()).default([]), study_stage: z.string().nullable().optional(), project_count: z.number().int().nonnegative().default(0),
  request_status: z.string().nullable().optional()
}).strip();
const accessScopeSchema = z.enum(['profile', 'scorecard', 'projects', 'contact']);
export const requestInputSchema = z.object({
  match_result_id: z.string().uuid(), message: z.string().trim().max(500).optional(),
  requested_scope: z.array(accessScopeSchema).min(1).max(4).refine((scopes) => new Set(scopes).size === scopes.length),
  duration_days: z.union([z.literal(7), z.literal(30), z.literal(90)])
}).strict();
export const accessRequestSchema = z.object({
  id: z.string().uuid(), candidate_ref: z.string().uuid(), job_id: z.string().uuid(), alias: z.string(), status: z.enum(['pending', 'accepted', 'declined', 'withdrawn', 'expired']),
  job_title: z.string(), requested_scope: z.array(accessScopeSchema), granted_scope: z.array(accessScopeSchema), duration_days: z.number().int().nonnegative().nullable(),
  created_at: z.string().datetime({ offset: true }), expires_at: z.string().datetime({ offset: true }).nullable(), message: z.string().nullable(),
  pipeline_stage: z.enum(['interviewing','offered','closed']).nullable().optional(), responded_at: z.string().datetime({ offset: true }).nullable().optional()
}).strip();
export const revealSchema = z.object({
  request_id: z.string().uuid(), granted_scope: z.array(accessScopeSchema), expires_at: z.string().datetime({ offset: true }),
  profile: z.object({ full_name: z.string(), headline: z.string().optional(), bio: z.string().optional(), location: z.string().optional(), links: z.array(z.object({ label: z.string(), url: z.string().url() }).strict()).optional(), university: z.object({ name: z.string(), verification: z.string() }).strict().optional(), avatar_url: z.string().url().optional() }).strict().optional(),
  scorecard: z.object({ skills: z.array(z.object({ name: z.string(), level: z.string(), score: z.number().optional(), verified: z.boolean(), verified_on: z.string().optional(), summary: z.string().optional() }).strict()) }).strict().optional(),
  projects: z.array(z.object({ id: z.string().uuid(), title: z.string(), description: z.string().optional(), skills: z.array(z.string()), live_url: z.string().url().optional(), github_url: z.string().url().optional(), files: z.array(z.object({ name: z.string(), url: z.string().url() }).strict()).optional(), video_url: z.string().url().optional() }).strict()).optional(),
  contact: z.object({ email: z.string().email() }).strict().optional()
}).strict();
const safeFunctionError = (error: { name?: string; context?: unknown; message?: string } | null) => {
  if (!error) return new Error('The request could not be completed. Check your connection and try again.');
  const status = (error.context as { status?: number } | undefined)?.status;
  if (status === 401) return new Error('Your session has expired. Sign in again.');
  if (status === 403) return new Error('Your organization account is not allowed to perform this action.');
  if (status === 402) return new Error('An active organization subscription is required for matching.');
  if (status === 409) return new Error('This access request already exists.');
  if (status === 429) return new Error('You have reached the request limit. Try again later.');
  return new Error('The request could not be completed. Check your connection and try again.');
};
let client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (client) return client;
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Organization sign-in is not configured for the hosted backend.');
  }
  client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    auth: { storageKey: 'aptohire-organization', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
  });
  return client;
}
const asText = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const mapStatus = (value: string): Job['status'] => value === 'open' ? 'Open' : value === 'closed' ? 'Closed' : 'Paused';

export const supabaseBackend: Backend = {
  auth: {
    async signIn(email, password) {
      const { data, error } = await getClient().auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.user) throw safeFunctionError(error);
      sessionStorage.setItem('org-user', data.user.email ?? email.trim());
      return true;
    },
    async signUp(input) {
      const supabase = getClient();
      const applicationRef = input.applicationRef?.trim().toUpperCase();
      if (applicationRef) sessionStorage.setItem('org-application-ref', applicationRef);
      else sessionStorage.removeItem('org-application-ref');
      const { data, error } = await supabase.auth.signUp({ email: input.email.trim(), password: input.password, options: { data: { full_name: input.fullName.trim() }, emailRedirectTo: new URL('/auth/callback', window.location.origin).toString() } });
      if (error || !data.user) throw safeFunctionError(error);
      if (data.session && data.user.email_confirmed_at) {
        const { error: bootstrapError } = await supabase.functions.invoke('complete-signup', { body: { portal: 'organization', ...(applicationRef ? { application_ref: applicationRef } : {}) } });
        if (bootstrapError) throw safeFunctionError(bootstrapError);
        sessionStorage.setItem('org-user', data.user.email ?? input.email.trim());
        sessionStorage.removeItem('org-application-ref');
        return true;
      }
      return false;
    },
    async completeSignup(applicationRef) {
      const supabase = getClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || !user.email_confirmed_at) throw new Error('Confirm your email before continuing.');
      const ref = applicationRef?.trim().toUpperCase() || sessionStorage.getItem('org-application-ref') || undefined;
      const { error } = await supabase.functions.invoke('complete-signup', { body: { portal: 'organization', ...(ref ? { application_ref: ref } : {}) } });
      if (error) throw safeFunctionError(error);
      sessionStorage.setItem('org-user', user.email ?? 'Organization recruiter');
      sessionStorage.removeItem('org-application-ref');
    },
    async requestPasswordReset(email) {
      const { error } = await getClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: new URL('/reset-password', window.location.origin).toString() });
      if (error) throw safeFunctionError(error);
    },
    async setNewPassword(password) {
      const { error } = await getClient().auth.updateUser({ password });
      if (error) throw safeFunctionError(error);
    },
    async getRole() {
      const supabase = getClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return null;
      const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (error || !data) return null;
      const role = roleSchema.safeParse(data.role);
      if (!role.success) return 'other';
      return role.data === 'admin' ? 'other' : role.data;
    },
    async signOut() {
      const supabase = getClient();
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      sessionStorage.removeItem('org-user');
      if (error) throw safeFunctionError(error);
    }
  },
  organization: {
    async get(): Promise<Organization | null> {
      const { data, error } = await getClient().from('my_organization_v')
        .select('id,name,status,subscription_status,verified_at').limit(1).maybeSingle();
      if (error) throw safeFunctionError(error);
      if (!data) return null;
      const status = data.status === 'approved' || data.status === 'rejected' ? data.status : 'pending';
      return {
        id: String(data.id), name: asText(data.name, 'Organization'), status,
        subscription: data.subscription_status === 'active' ? 'active' : 'inactive',
        verified: data.verified_at != null
      };
    }
  },
  jobs: {
    async list(): Promise<Job[]> {
      const supabase = getClient();
      const { data, error } = await supabase.from('jobs')
        .select('id,title,description,status,openings,mode,location,required_skills')
        .order('created_at', { ascending: false }).limit(200);
      if (error) throw safeFunctionError(error);
      const parsed = z.array(jobRowSchema).parse(data ?? []);
      const skillIds = [...new Set(parsed.flatMap((row) => row.required_skills.map((skill) => skill.skill_id)))];
      const skillNames = new Map<string, { name: string; slug: string; family: string }>();
      if (skillIds.length) {
        const { data: skills, error: skillsError } = await supabase.from('skills').select('id,name,slug,skill_families(name)').in('id', skillIds);
        if (skillsError) throw safeFunctionError(skillsError);
        for (const skill of skills ?? []) {
          const family = skill.skill_families as { name?: string } | null;
          skillNames.set(String(skill.id), { name: String(skill.name), slug: String(skill.slug), family: family?.name ?? 'Other' });
        }
      }
      const cards = await Promise.all(parsed.map(async (row) => {
        const [candidates, requests] = await Promise.all([
          supabase.from('org_candidate_cards').select('candidate_ref', { count: 'exact', head: true }).eq('job_id', row.id),
          supabase.from('org_access_requests_v').select('id', { count: 'exact', head: true }).eq('job_id', row.id)
        ]);
        if (candidates.error || requests.error) throw safeFunctionError(candidates.error ?? requests.error);
        const requirements = row.required_skills.map((requirement) => {
          const skill = skillNames.get(requirement.skill_id);
          return skill ? { skill_id: requirement.skill_id, skill_slug: skill.slug, name: skill.name, min_level: requirement.min_level as 'Competent' | 'Proficient' | 'Advanced', weight: requirement.weight } : null;
        }).filter((requirement): requirement is SkillRequirement => requirement !== null);
        const skills = requirements.map((requirement) => `${requirement.name} · ${requirement.min_level}`);
        return {
          id: row.id, title: row.title, status: mapStatus(row.status), openings: row.openings,
          mode: asText(row.mode, 'Not listed'), location: asText(row.location), skills, requirements,
          candidates: candidates.count ?? 0, requests: requests.count ?? 0, description: asText(row.description)
        } satisfies Job;
      }));
      return cards;
    },
    async save(job): Promise<Job> {
      const supabase = getClient();
      const { data: organization, error: orgError } = await supabase.from('my_organization_v')
        .select('id,status').limit(1).maybeSingle();
      if (orgError) throw safeFunctionError(orgError);
      if (!organization?.id || organization.status !== 'approved') throw new Error('Only an approved organization can manage roles.');
      const skillNamesAndLevels = job.requirements?.length ? job.requirements.map((entry) => ({
        skill_id: entry.skill_id, name: entry.name, min_level: entry.min_level, weight: entry.weight
      })) : job.skills.map((entry) => {
        const [name, level = 'Competent'] = entry.split(' · ');
        return { skill_id: '', name: name.trim(), min_level: level.trim(), weight: 1 };
      }).filter((entry) => entry.name);
      if (!skillNamesAndLevels.length || skillNamesAndLevels.length > 30) throw new Error('Add between 1 and 30 required skills.');
      const unresolved = skillNamesAndLevels.filter((entry) => !entry.skill_id);
      const { data: foundSkills, error: skillsError } = unresolved.length
        ? await supabase.from('skills').select('id,name').in('name', unresolved.map((entry) => entry.name))
        : { data: [], error: null };
      if (skillsError) throw safeFunctionError(skillsError);
      const byName = new Map((foundSkills ?? []).map((row) => [String(row.name).toLowerCase(), String(row.id)]));
      const requiredSkills = skillNamesAndLevels.map((entry) => {
        const skillId = entry.skill_id || byName.get(entry.name.toLowerCase());
        if (!skillId) throw new Error(`The skill “${entry.name}” is not in the approved skill catalogue.`);
        const minLevel = z.enum(['Competent', 'Proficient', 'Advanced']).parse(entry.min_level);
        const weight = z.number().min(0.01).max(100).parse(entry.weight);
        return { skill_id: skillId, min_level: minLevel, weight };
      });
      const status = job.status.toLowerCase();
      const normalizedStatus = jobStatusSchema.parse(status);
      const payload = {
        organization_id: organization.id, title: job.title.trim(), description: job.description?.trim() ?? '',
        mode: job.mode, location: job.mode === 'Remote' ? null : job.location.trim(), status: normalizedStatus,
        openings: Math.max(1, Math.min(1000, Math.trunc(job.openings))), required_skills: requiredSkills
      };
      const isExisting = z.string().uuid().safeParse(job.id).success;
      const query = isExisting
        ? supabase.from('jobs').update({ title: payload.title, description: payload.description, mode: payload.mode, location: payload.location, status: payload.status, openings: payload.openings, required_skills: payload.required_skills }).eq('id', job.id).eq('organization_id', organization.id)
        : supabase.from('jobs').insert(payload);
      const { data, error } = await query.select('id,title,description,status,openings,mode,location,required_skills').single();
      if (error || !data) throw safeFunctionError(error);
      return { ...job, id: String(data.id), status: mapStatus(String(data.status)), openings: Number(data.openings) };
    },
    async skillCatalog(): Promise<SkillCatalogItem[]> {
      const { data, error } = await getClient().from('skills').select('id,slug,name,skill_families(name)').order('name').limit(500);
      if (error) throw safeFunctionError(error);
      return (data ?? []).map((row) => {
        const family = row.skill_families as { name?: string } | null;
        return { id: String(row.id), slug: String(row.slug), name: String(row.name), family: family?.name ?? 'Other' };
      });
    },
    async extractSkills(description: string) {
      const input = z.string().trim().min(20).max(8000).parse(description);
      const { data, error } = await getClient().functions.invoke('extract-job-skills', { body: { description: input } });
      if (error) throw safeFunctionError(error);
      const output = z.object({
        skills: z.array(z.object({ skill_slug: z.string().min(1).max(80), min_level: z.enum(['Competent', 'Proficient', 'Advanced']), weight: z.number().positive().max(1) }).strict()).max(30),
        title_suggestion: z.string().min(1).max(120).optional()
      }).strict().parse(data);
      const slugs = output.skills.map((item) => item.skill_slug);
      const { data: skills, error: skillsError } = slugs.length
        ? await getClient().from('skills').select('slug,name').in('slug', slugs)
        : { data: [], error: null };
      if (skillsError) throw safeFunctionError(skillsError);
      const names = new Map((skills ?? []).map((row) => [String(row.slug), String(row.name)]));
      return { ...output, skills: output.skills.filter((item) => names.has(item.skill_slug)).map((item) => ({ ...item, name: names.get(item.skill_slug)! })) };
    }
  },
  matching: {
    async list(jobId): Promise<Candidate[]> {
      const id = z.string().uuid().parse(jobId);
      const supabase = getClient();
      const matchResponse = z.object({ status: z.enum(['ready', 'running']), candidate_count: z.number().int().nonnegative() }).strict();
      const { data: matchData, error: matchError } = await supabase.functions.invoke('match-job', { body: { job_id: id } });
      if (matchError) throw safeFunctionError(matchError);
      const matchResult = matchResponse.parse(matchData);
      const readCards = () => supabase.from('org_candidate_cards')
        .select('candidate_ref,job_id,alias,final_score,confidence,reasons,gaps,uni_category,skills,study_stage,project_count')
        .eq('job_id', id).order('final_score', { ascending: false }).limit(250);
      let result = await readCards();
      for (let attempt = 0; matchResult.status === 'running' && result.data?.length !== matchResult.candidate_count && attempt < 10; attempt++) {
        await new Promise((resolve) => window.setTimeout(resolve, 3000));
        result = await readCards();
      }
      if (result.error) throw safeFunctionError(result.error);
      const data = result.data;
      return z.array(candidateRowSchema).parse(data ?? []).map((row) => ({
        ref: row.candidate_ref, jobId: row.job_id, alias: row.alias,
        score: row.final_score > 1 ? row.final_score / 100 : row.final_score,
        confidence: row.confidence > 1 ? row.confidence / 100 : row.confidence,
        category: asText(row.uni_category, 'University category not shared'),
        stage: asText(row.study_stage, 'Study stage not shared'), projects: row.project_count,
        skills: row.skills.map((skill) => ({ name: skill.name, level: skill.level, verified: skill.verified, ...(skill.score !== undefined ? { score: skill.score } : {}) })),
        reason: row.reasons.find((item) => item.trim()) || 'Verified skills match the role requirements.',
        gaps: row.gaps, structuredScore: null, vectorScore: null, scrubbedSummary: null
      }));
    }
  },
  requests: {
    async create(ref: string, input = { scopes: ['profile', 'scorecard'] as Array<'profile' | 'scorecard' | 'projects' | 'contact'>, durationDays: 30 as 7 | 30 | 90, message: '' }): Promise<void> {
      const payload = requestInputSchema.parse({ match_result_id: ref, message: input.message?.trim() || undefined, requested_scope: input.scopes, duration_days: input.durationDays });
      const { data, error } = await getClient().functions.invoke('request-access', { body: payload });
      if (error) throw safeFunctionError(error);
      z.object({ request_id: z.string().uuid() }).strict().parse(data);
    },
    async list() {
      const { data, error } = await getClient().from('org_access_requests_v')
        .select('id,candidate_ref,job_id,alias,status,job_title,requested_scope,granted_scope,duration_days,created_at,expires_at,message,pipeline_stage,responded_at')
        .order('created_at', { ascending: false }).limit(200);
      if (error) throw safeFunctionError(error);
      return z.array(accessRequestSchema).parse(data ?? []).map((row) => ({
        id: row.id, candidateRef: row.candidate_ref, jobId: row.job_id, alias: row.alias, status: row.status, jobTitle: row.job_title,
        requestedScope: row.requested_scope, grantedScope: row.granted_scope, durationDays: row.duration_days,
        createdAt: row.created_at, expiresAt: row.expires_at, message: row.message ?? '', pipelineStage: row.pipeline_stage ?? null, respondedAt: row.responded_at ?? null
      }));
    },
    async reveal(id) {
      const requestId = z.string().uuid().parse(id);
      const { data, error } = await getClient().functions.invoke('reveal-student', { body: { request_id: requestId } });
      if (error) {
        const status = (error.context as { status?: number } | undefined)?.status;
        if (status === 403) throw new Error('GRANT_EXPIRED');
        throw safeFunctionError(error);
      }
      return revealSchema.parse(data);
    }
  },
  pipeline: {
    async move(requestId, stage) {
      const id = z.string().uuid().parse(requestId);
      const validatedStage = z.enum(['interviewing', 'offered', 'closed']).nullable().parse(stage);
      const { error } = await getClient().from('access_requests').update({ pipeline_stage: validatedStage }).eq('id', id).eq('status', 'accepted');
      if (error) throw safeFunctionError(error);
    }
  },
  directory: {
    async universities(): Promise<DirectoryEntry[]> {
      const { data, error } = await getClient().from('public_universities').select('id,name,short_name,tier,kind,city,state').order('name').limit(500);
      if (error) throw safeFunctionError(error);
      return (data ?? []).map((row) => ({ id: String(row.id), name: String(row.short_name || row.name), kind: String(row.kind ?? 'University'), tier: String(row.tier ?? ''), city: String(row.city ?? ''), state: String(row.state ?? '') }));
    },
    async organizations(): Promise<DirectoryEntry[]> {
      const { data, error } = await getClient().from('public_organizations').select('id,name,kind,size,website,verified').order('name').limit(500);
      if (error) throw safeFunctionError(error);
      return (data ?? []).map((row) => ({ id: String(row.id), name: String(row.name), kind: String(row.kind ?? 'Organization'), size: String(row.size ?? ''), website: typeof row.website === 'string' ? row.website : undefined, verified: Boolean(row.verified) }));
    }
  },
  notifications: {
    async list(): Promise<PortalNotification[]> {
      const supabase = getClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Sign in again to view notifications.');
      const { data, error } = await supabase.from('notifications').select('id,kind,payload,created_at,read_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100);
      if (error) throw safeFunctionError(error);
      return (data ?? []).map((row) => ({ id: String(row.id), kind: String(row.kind), payload: z.record(z.unknown()).parse(row.payload ?? {}), createdAt: String(row.created_at), readAt: typeof row.read_at === 'string' ? row.read_at : null }));
    },
    async subscribe(onChange) {
      const supabase = getClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return () => undefined;
      const channel = supabase.channel(`org-notifications-${user.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, onChange).subscribe();
      return () => { void supabase.removeChannel(channel); };
    }
  }
};