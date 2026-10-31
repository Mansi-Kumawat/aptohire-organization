import { describe, expect, it } from 'vitest';
import { accessRequestSchema, candidateRowSchema, requestInputSchema, revealSchema } from './index';

describe('organization Supabase contract schemas', () => {
  it('accepts exact consent request bounds and rejects duplicate scopes or extra fields', () => {
    expect(requestInputSchema.safeParse({ match_result_id: '00000000-0000-4000-8000-000000000001', requested_scope: ['profile', 'scorecard'], duration_days: 30 }).success).toBe(true);
    expect(requestInputSchema.safeParse({ match_result_id: '00000000-0000-4000-8000-000000000001', requested_scope: ['profile', 'profile'], duration_days: 30 }).success).toBe(false);
    expect(requestInputSchema.safeParse({ match_result_id: '00000000-0000-4000-8000-000000000001', requested_scope: ['profile'], duration_days: 14 }).success).toBe(false);
    expect(requestInputSchema.safeParse({ match_result_id: '00000000-0000-4000-8000-000000000001', requested_scope: ['profile'], duration_days: 30, student_id: 'private' }).success).toBe(false);
  });

  it('accepts blind request rows without requiring identity fields', () => {
    const row = {
      id: '00000000-0000-4000-8000-000000000001', candidate_ref: '00000000-0000-4000-8000-000000000002', job_id: '00000000-0000-4000-8000-000000000003',
      alias: 'Candidate K7F2', status: 'accepted', job_title: 'Frontend Developer', requested_scope: ['profile'], granted_scope: ['profile'],
      duration_days: 30, created_at: '2026-10-30T10:00:00.000Z', expires_at: '2026-11-29T10:00:00.000Z', message: null, pipeline_stage: 'interviewing', responded_at: null
    };
    expect(accessRequestSchema.parse(row).alias).toBe('Candidate K7F2');
    const stripped = accessRequestSchema.parse({ ...row, full_name: 'Should not be in this view' });
    expect('full_name' in stripped).toBe(false);
  });

  it('accepts the internal Reviewed stage without exposing additional candidate identity', () => {
    const row = { id: '00000000-0000-4000-8000-000000000001', candidate_ref: '00000000-0000-4000-8000-000000000002', job_id: '00000000-0000-4000-8000-000000000003', alias: 'Candidate M3Q8', status: 'accepted', job_title: 'Frontend Developer', requested_scope: ['profile'], granted_scope: ['profile'], duration_days: 30, created_at: '2026-10-30T10:00:00.000Z', expires_at: '2026-11-29T10:00:00.000Z', message: null, pipeline_stage: 'reviewed', responded_at: null };
    expect(accessRequestSchema.parse(row).pipeline_stage).toBe('reviewed');
  });

  it('accepts only the revealed response contract and rejects unrelated identity fields at the root', () => {
    const response = { request_id: '00000000-0000-4000-8000-000000000001', granted_scope: ['profile'], expires_at: '2026-11-29T10:00:00.000Z', profile: { full_name: 'Aarav Sharma' } };
    expect(revealSchema.parse(response).profile?.full_name).toBe('Aarav Sharma');
    expect(revealSchema.safeParse({ ...response, student_id: 'must-not-be-returned' }).success).toBe(false);
  });

  it('accepts blind candidate card projections with bounded scores and no named profile fields', () => {
    const card = { candidate_ref: '00000000-0000-4000-8000-000000000001', job_id: '00000000-0000-4000-8000-000000000002', alias: 'Candidate K7F2', final_score: 82, confidence: 0.8, reasons: ['Verified React evidence'], gaps: [], uni_category: 'Tier 2', skills: [{ name: 'React', level: 'Proficient', verified: true, score: 82 }], study_stage: 'Year 3', project_count: 2, request_status: null, structured_score: 80, vector_score: 65, scrubbed_summary: null };
    expect(candidateRowSchema.parse(card).alias).toBe('Candidate K7F2');
    expect(candidateRowSchema.safeParse({ ...card, final_score: 101 }).success).toBe(false);
  });
});
