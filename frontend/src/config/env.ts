import { z } from 'zod';

const schema = z.object({
  VITE_APP_ENV: z.enum(['local', 'demo', 'production']).default('local'),
  VITE_USE_MOCKS: z.enum(['true', 'false']).default('true'),
  VITE_DEMO_MODE: z.enum(['true', 'false']).default('true'),
  VITE_DEMO_PASSWORD: z.string().optional(),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional()
});

export function validateEnvironment(source: Record<string, unknown>) {
  const values = schema.parse(source);
  if (values.VITE_USE_MOCKS === 'false' && (!values.VITE_SUPABASE_URL || !values.VITE_SUPABASE_ANON_KEY)) {
    throw new Error('Real mode requires VITE_SUPABASE_URL and the public VITE_SUPABASE_ANON_KEY.');
  }
  // Demo-account shortcuts may authenticate against the real backend. Only mock
  // data is forbidden in production; demo credentials must be dedicated test users.
  if (values.VITE_APP_ENV === 'production' && values.VITE_USE_MOCKS !== 'false') {
    throw new Error('Production requires real backend mode (VITE_USE_MOCKS=false).');
  }
  return values;
}

export const env = validateEnvironment(import.meta.env);
