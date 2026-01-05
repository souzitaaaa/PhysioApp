import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { USERS } from "../utils/utils.js";

// Load environment variables first
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in environment variables')
}

// Create a fresh Supabase client (stateless for server)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

//  IMPORTANT: Make sure your supabaseService.js is configured for server-side
// It should have: auth: { autoRefreshToken: false, persistSession: false }

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

async function performLogin(req, res, allowedRoles = null) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("[Login] Auth error:", error.message);
      return res.status(401).json({
        error: error.message,
        code: "LOGIN_FAILED"
      });
    }

    if (!data.session) {
      console.error("[Login] No session created");
      return res.status(401).json({
        error: "No session created",
        code: "NO_SESSION"
      });
    }

    console.log("[Login] Session created successfully");

    // 2. Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('t_user')
      .select('*')
      .eq('auth_userID', data.user.id)
      .single();

    if (userError || !userData) {
      console.error("[Login] Profile error:", userError?.message);
      return res.status(401).json({
        error: "User profile not found",
        code: "NO_PROFILE"
      });
    }

    // 3. Check role (adjust field name based on your DB schema)
    const userRole = userData.user_type || userData.usertypeID;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      console.warn(`[Login] Access denied: ${userRole} not in [${allowedRoles}]`);
      return res.status(403).json({
        error: "Access denied for this platform",
        code: "INSUFFICIENT_PERMISSIONS",
        message: `This login is restricted to ${allowedRoles.join(' or ')} users only`,
        userRole: userRole,
        requiredRoles: allowedRoles
      });
    }

    console.log(`[Login] Successful: ${userData.email} (${userRole})`);

    // 4. Set cookies with the session tokens
    console.log("[Login] Setting cookies...");
    console.log("[Login] Access token length:", data.session.access_token.length);
    console.log("[Login] Refresh token length:", data.session.refresh_token.length);

    res.cookie('access_token', data.session.access_token, COOKIE_OPTIONS);
    res.cookie('refresh_token', data.session.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    console.log("[Login] Cookies set successfully");

    // 5. Return user data
    return res.json({
      user: data.user,
      profile: userData,
      message: "Login successful"
    });
  } catch (error) {
    console.error("[Login] Unexpected error:", error);
    return res.status(500).json({
      error: "Login failed",
      code: "SERVER_ERROR"
    });
  }
}

export async function loginWeb(req, res) {
  console.log("[Login Web] Attempt from:", req.body.email);
  return performLogin(req, res, [USERS.BOSS]);
}

export async function loginMobile(req, res) {
  console.log("[Login Mobile] Attempt from:", req.body.email);
  return performLogin(req, res, [USERS.PHYSIO]);
}

export async function logout(req, res) {
  try {
    const accessToken = req.cookies.access_token;

    if (accessToken) {
      // Sign out from Supabase
      await supabase.auth.signOut();
    }

    // Clear all auth cookies
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    console.log("[Logout] User logged out successfully");

    return res.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("[Logout] Error:", error);
    // Still clear cookies even if Supabase call fails
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    return res.json({
      message: "Logged out"
    });
  }
}

export async function me(req, res) {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken) {
      console.log("[Me] No access token found");
      return res.status(401).json({
        error: "Not authenticated",
        code: "NO_TOKEN"
      });
    }

    // Create client with session
    const meClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })

    // Set session before getting user
    await meClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    });

    // Verify token with Supabase
    const { data: authData, error: authError } = await meClient.auth.getUser();

    if (authError || !authData.user) {
      console.log("[Me] Token invalid or expired:", authError?.message);
      return res.status(401).json({
        error: "Token expired or invalid",
        code: "TOKEN_EXPIRED"
      });
    }

    // Fetch user profile
    const { data: userData, error: userError } = await meClient
      .from('t_user')
      .select('*')
      .eq('auth_userID', authData.user.id)
      .single();

    if (userError) {
      console.error("[Me] Profile fetch error:", userError.message);
      return res.status(401).json({
        error: "User profile not found",
        code: "NO_PROFILE"
      });
    }

    console.log("[Me] Successfully fetched user:", authData.user.email);
    return res.json({
      auth: authData.user,
      profile: userData
    });
  } catch (error) {
    console.error("[Me] Unexpected error:", error);
    return res.status(500).json({
      error: "Failed to fetch user data",
      code: "SERVER_ERROR"
    });
  }
}

/**
 *  CORRECT SERVER-SIDE TOKEN REFRESH
 * Creates a new client instance with the session to refresh it
 */
export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies.refresh_token;
    const accessToken = req.cookies.access_token;

    console.log("[Refresh] Token refresh requested");
    console.log("[Refresh] Access token length:", accessToken?.length);
    console.log("[Refresh] Refresh token length:", refreshToken?.length);
    console.log("[Refresh] Access token preview:", accessToken?.substring(0, 50));
    console.log("[Refresh] Refresh token preview:", refreshToken?.substring(0, 50));

    if (!refreshToken) {
      console.log("[Refresh] No refresh token in cookies");
      return res.status(401).json({
        error: "No refresh token",
        code: "NO_REFRESH_TOKEN"
      });
    }

    console.log("[Refresh] Creating fresh Supabase client with session...");

    //  KEY FIX: Create a NEW client instance for this refresh
    const refreshClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })

    console.log("[Refresh] Calling setSession with tokens...");

    // Set the session with both tokens
    const { data, error } = await refreshClient.auth.setSession({
      access_token: accessToken || '',
      refresh_token: refreshToken
    });

    if (error) {
      console.error("[Refresh] setSession failed:", error.message);
      console.error("[Refresh] Error code:", error.code);
      console.error("[Refresh] Error name:", error.name);
      console.error("[Refresh] Full error:", JSON.stringify(error, null, 2));

      // Clear invalid tokens
      res.clearCookie('access_token', { path: '/' });
      res.clearCookie('refresh_token', { path: '/' });

      return res.status(401).json({
        error: "Session refresh failed",
        code: "REFRESH_FAILED",
        message: error.message
      });
    }

    if (!data.session) {
      console.error("[Refresh] No session returned from Supabase");
      res.clearCookie('access_token', { path: '/' });
      res.clearCookie('refresh_token', { path: '/' });
      return res.status(401).json({
        error: "No session returned",
        code: "NO_SESSION"
      });
    }

    console.log("[Refresh]  Session refreshed successfully");
    console.log("[Refresh] User:", data.user?.email);

    // Set new tokens in cookies
    res.cookie('access_token', data.session.access_token, COOKIE_OPTIONS);
    res.cookie('refresh_token', data.session.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: "Token refreshed successfully",
      user: data.user
    });

  } catch (error) {
    console.error("[Refresh] Unexpected error:", error);
    console.error("[Refresh] Error stack:", error.stack);
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    return res.status(500).json({
      error: "Token refresh failed",
      code: "SERVER_ERROR",
      message: error.message
    });
  }
}