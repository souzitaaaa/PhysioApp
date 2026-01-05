import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_KEY
const supabaseServiceRole = process.env.VITE_SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables!')
}

//  CRITICAL: Server-side configuration
// This is the key to making setSession() work properly
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        //  IMPORTANT: This tells Supabase we're on the server
        storageKey: 'supabase-auth-token',
        storage: null // Explicitly no storage on server
    },
    global: {
        headers: {
            'X-Client-Info': 'supabase-js-node'
        }
    }
})

// Admin client for privileged operations
export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRole,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

console.log(' Supabase clients initialized for server-side use')