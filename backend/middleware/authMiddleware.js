import { supabase } from "../services/supabaseService.js";

// Verify authentication using cookies
// Attach authUser and user to req
export async function requireAuth(req, res, next) {
  try {
    // Get token from cookie instead of Authorization header
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_TOKEN"
      });
    }

    // Verify token with Supabase
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !authData.user) {
      console.log("[Auth Middleware] Token invalid:", authError?.message);
      // DON'T clear cookies - let the frontend refresh logic handle it
      return res.status(401).json({
        error: "Invalid or Expired Token",
        code: "TOKEN_EXPIRED" // Frontend will try to refresh
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