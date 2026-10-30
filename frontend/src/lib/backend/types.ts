export type Skill = { name: string; level: string; verified: boolean; score?: number };
export type Candidate = {
  ref: string; jobId?: string; alias: string; score: number; confidence: number; category: string; stage: string;
  projects: number; skills: Skill[]; reason: string; gaps: string[]; requestId?: string; status?: string;
  structuredScore?: number | null; vectorScore?: number | null; scrubbedSummary?: string | null;
};
export type SkillRequirement = { skill_id: string; skill_slug: string; name: string; min_level: 'Competent' | 'Proficient' | 'Advanced'; weight: number };
export type SkillCatalogItem = { id: string; slug: string; name: string; family: string };
export type ExtractedSkill = { skill_slug: string; min_level: 'Competent' | 'Proficient' | 'Advanced'; weight: number; name: string };
export type Job = {
  id: string; title: string; status: 'Open' | 'Paused' | 'Closed'; openings: number; mode: string; location: string;
  skills: string[]; requirements?: SkillRequirement[]; candidates: number; requests: number; description?: string;
};
export type Organization = { id?: string; name: string; status: 'approved' | 'pending' | 'rejected'; subscription: 'active' | 'inactive'; verified: boolean };
export type AccessScope = 'profile' | 'scorecard' | 'projects' | 'contact';
export type AccessRequest = {
  id: string; candidateRef: string; alias: string; status: 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'expired';
  jobTitle: string; jobId?: string; requestedScope: AccessScope[]; grantedScope: AccessScope[]; durationDays: number | null;
  createdAt: string; expiresAt: string | null; message: string; pipelineStage?: 'interviewing' | 'offered' | 'closed' | null; respondedAt?: string | null;
};
export type Reveal = {
  request_id: string; granted_scope: AccessScope[]; expires_at: string;
  profile?: { full_name: string; headline?: string; bio?: string; location?: string; links?: { label: string; url: string }[]; university?: { name: string; verification: string }; avatar_url?: string };
  scorecard?: { skills: { name: string; level: string; score?: number; verified: boolean; verified_on?: string; summary?: string }[] };
  projects?: { id: string; title: string; description?: string; skills: string[]; live_url?: string; github_url?: string; files?: { name: string; url: string }[]; video_url?: string }[];
  contact?: { email: string };
};
export type DirectoryEntry = { id: string; name: string; kind: string; size?: string; website?: string; city?: string; state?: string; tier?: string; verified?: boolean };
export type PortalNotification = { id: string; kind: string; payload: Record<string, unknown>; createdAt: string; readAt: string | null };
export type Backend = {
  auth: {
    signIn(email: string, password: string): Promise<boolean>;
    getRole(): Promise<'organization' | 'student' | 'university' | 'other' | null>;
    signOut(): Promise<void>;
    signUp?(input: { fullName: string; email: string; password: string; applicationRef?: string }): Promise<boolean>;
    completeSignup?(applicationRef?: string): Promise<void>;
    requestPasswordReset?(email: string): Promise<void>;
    setNewPassword?(password: string): Promise<void>;
  };
  organization: { get(): Promise<Organization | null> };
  jobs: {
    list(): Promise<Job[]>;
    save(job: Job): Promise<Job>;
    skillCatalog(): Promise<SkillCatalogItem[]>;
    extractSkills(description: string): Promise<{ skills: ExtractedSkill[]; title_suggestion?: string }>;
  };
  matching: { list(jobId: string): Promise<Candidate[]> };
  requests: {
    create(ref: string, input?: { message?: string; scopes: AccessScope[]; durationDays: 7 | 30 | 90 }): Promise<void>;
    list(): Promise<AccessRequest[]>;
    reveal(id: string): Promise<Reveal>;
  };
  pipeline: { move(requestId: string, stage: 'interviewing' | 'offered' | 'closed' | null): Promise<void> };
  directory: { universities(): Promise<DirectoryEntry[]>; organizations(): Promise<DirectoryEntry[]> };
  notifications: { list(): Promise<PortalNotification[]>; subscribe(onChange: () => void): Promise<() => void> };
};
