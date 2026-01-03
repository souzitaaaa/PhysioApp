import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { USERS } from "../utils/utils.js";

// ✅ Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in environment variables')
}

// ✅ KEY FIX: Create client with session for each request
function getSupabaseWithSession(accessToken, refreshToken) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })

  // Set the session synchronously
  if (accessToken && refreshToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  }

  return supabase
}

// Verify authentication using cookies
// Attach authUser and user to req
export async function requireAuth(req, res, next) {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_TOKEN"
      });
    }

    // Create client with session
    const supabase = getSupabaseWithSession(accessToken, refreshToken)

    // Verify token with Supabase
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      console.log("[Auth Middleware] Token invalid:", authError?.message);
      return res.status(401).json({
        error: "Invalid or Expired Token",
        code: "TOKEN_EXPIRED"
      });
    }

    // Fetch user profile from database
    const { data: userData, error: userError } = await supabase
      .from("t_user")
      .select("*")
      .eq("auth_userID", authData.user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        error: "User profile not found",
        code: "NO_PROFILE"
      });
    }

    // Attach to request object
    req.authUser = authData.user;
    req.user = userData;

    next();
  } catch (error) {
    console.error("[Auth Middleware] Error:", error);
    return res.status(500).json({
      error: "Authentication failed",
      code: "AUTH_ERROR"
    });
  }
}

// Verify specific roles
export async function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      console.error('[requireRole] No user in request');
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_AUTH"
      });
    }

    const userRole = req.user.user_type
    console.log(`[requireRole] Checking: User role="${userRole}", Required=${allowedRoles}`);

    if (!allowedRoles.includes(userRole)) {
      console.warn(`[requireRole] Access denied: ${userRole} not in [${allowedRoles}]`);
      return res.status(403).json({
        error: "Insufficient permissions",
        code: "FORBIDDEN",
        required: allowedRoles,
        current: userRole
      });
    }

    console.log(`[requireRole] Access granted: ${userRole}`);
    next();
  }
}