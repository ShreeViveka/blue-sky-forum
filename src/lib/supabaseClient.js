import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VIiTE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VIiTE_SUPABASE_ANON_KEY;

// Using a mock valid JWT structure for fallback to prevent client library validation crashes
const dummyJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.dummy';
const dummyUrl = 'https://placeholder-project.supabase.co';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please configure your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export let supabase;
try {
  supabase = createClient(
    supabaseUrl || dummyUrl,
    supabaseAnonKey || dummyJwt
  );
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
  // Create a minimal mock client to prevent undefined errors in components
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  };
}

