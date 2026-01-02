import { supabase } from "../services/supabaseService.js";
import { USERS } from "../utils/utils.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
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

    // 1. Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: error.message,
        code: "LOGIN_FAILED"
      });
    }

    // 2. Buscar perfil do utilizador (incluindo role)
    const { data: userData, error: userError } = await supabase
      .from('t_user')
      .select('*')
      .eq('auth_userID', data.user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        error: "User profile not found",
        code: "NO_PROFILE"
      });
    }

    if (allowedRoles && !allowedRoles.includes(userData.usertypeID)) {
      console.warn(`[Login] Access denied: ${userData.usertypeID} not in [${allowedRoles}]`);
      return res.status(403).json({
        error: "Access denied for this platform",
        code: "INSUFFICIENT_PERMISSIONS",
        message: `This login is restricted to ${allowedRoles.join(' or ')} users only`,
        userRole: userData.usertypeID,
        requiredRoles: allowedRoles
      });
    }

    console.log(`[Login] Successful: ${userData.email} (${userData.usertypeID})`);

    // 4. Definir cookies
    res.cookie('access_token', data.session.access_token, COOKIE_OPTIONS);

    if (data.session.refresh_token) {
      res.cookie('refresh_token', data.session.refresh_token, {
        ...COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }

    // 5. Retornar dados
    return res.json({
      user: data.user,
      profile: userData,
      message: "Login successful"
    });
  } catch (error) {
    console.error("[Login] Error:", error);
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
      await supabase.auth.signOut({ accessToken });
    }

    // Clear all auth cookies
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

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

    if (!accessToken) {
      console.log("[Me] No access token found");
      return res.status(401).json({
        error: "Not authenticated",
        code: "NO_TOKEN"
      });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !authData.user) {
      console.log("[Me] Token invalid or expired:", authError?.message);
      // DON'T clear cookies here - let refresh handle it
      return res.status(401).json({
        error: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }

    const { data: userData } = await supabase
      .from('t_user')
      .select('*')
      .eq('auth_userID', authData.user.id)
      .maybeSingle();

    console.log("[Me] Successfully fetched user");
    return res.json({
      auth: authData.user,
      profile: userData || null
    });
  } catch (error) {
    console.error("[Me] Error:", error);
    return res.status(500).json({
      error: "Failed to fetch user data",
      code: "SERVER_ERROR"
    });
  }
}

/**
 * Refresh the access token using refresh token
 * Call this endpoint when access token expires
 */
export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        error: "No refresh token",
        code: "NO_REFRESH_TOKEN"
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error || !data.session) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return res.status(401).json({
        error: "Failed to refresh token",
        code: "REFRESH_FAILED"
      });
    }

    // Update cookies with new tokens
    res.cookie('access_token', data.session.access_token, COOKIE_OPTIONS);

    if (data.session.refresh_token) {
      res.cookie('refresh_token', data.session.refresh_token, {
        ...COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }

    return res.json({
      message: "Token refreshed successfully",
      user: data.user
    });
  } catch (error) {
    console.error("[Refresh] Error:", error);
    return res.status(500).json({
      error: "Token refresh failed",
      code: "SERVER_ERROR"
    });
  }
}