import { describe, expect, it } from 'vitest';
import { validateEnvironment } from './env';

const productionRealMode = {
  VITE_APP_ENV: 'production',
  VITE_USE_MOCKS: 'false',
  VITE_DEMO_MODE: 'true',
  VITE_DEMO_PASSWORD: 'test-only-password',
  VITE_SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'public-anon-test-key'
};

describe('deployment environment validation', () => {
  it('allows demo-account sign-in against the real production backend', () => {
    const result = validateEnvironment(productionRealMode);
    expect(result.VITE_USE_MOCKS).toBe('false');
    expect(result.VITE_DEMO_MODE).toBe('true');
    expect(result.VITE_DEMO_PASSWORD).toBe('test-only-password');
  });

  it('still rejects mock data in production', () => {
    expect(() => validateEnvironment({ ...productionRealMode, VITE_USE_MOCKS: 'true' })).toThrow(/real backend mode/i);
  });

  it('requires Supabase URL and public anon key in real mode', () => {
    expect(() => validateEnvironment({ ...productionRealMode, VITE_SUPABASE_ANON_KEY: '' })).toThrow(/SUPABASE_URL/);
  });

  it('continues to allow local mock development', () => {
    expect(validateEnvironment({ VITE_APP_ENV: 'local', VITE_USE_MOCKS: 'true' }).VITE_USE_MOCKS).toBe('true');
  });
});
