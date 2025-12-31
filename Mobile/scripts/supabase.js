import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bxzxbtkdgejmvdzeciqe.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4enhidGtkZ2VqbXZkemVjaXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzIyMTIsImV4cCI6MjA3ODYwODIxMn0.0yr4PU3L7692h9prk4deBGOV5I1EiXG2qBuHPhFrynQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
