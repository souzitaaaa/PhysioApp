import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_KEY
const supabaseServiceRole = process.env.VITE_SUPABASE_SERVICE_ROLE

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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