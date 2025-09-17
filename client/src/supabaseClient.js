import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// --- DIAGNOSTIC LOGS ---
// The following lines will help us debug the connection issue.
console.log("--- Supabase Client Initialization ---");
console.log("Attempting to connect with URL:", supabaseUrl);
console.log("Is the URL a string?", typeof supabaseUrl === 'string' && supabaseUrl.length > 0);

// We only log the first 8 characters of the key for security.
console.log("Anon Key (first 8 chars):", supabaseAnonKey ? supabaseAnonKey.substring(0, 8) + '...' : "KEY NOT FOUND");
console.log("Is the Key a string?", typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0);
console.log("------------------------------------");
// ---------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey)