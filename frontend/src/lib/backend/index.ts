import {mockBackend} from './mock';
import {supabaseBackend} from './supabase';
export const backend=import.meta.env.VITE_USE_MOCKS==='false'?supabaseBackend:mockBackend;