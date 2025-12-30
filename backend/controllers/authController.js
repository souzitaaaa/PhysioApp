import { supabase } from "../services/supabaseService.js";

export async function login(req, res) {
  const { email, password } = req.body

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    return res.status(401).json({ error: error.message })
  }

  return res.json({
    session: data.session,
    user: data.user,
  })
}

export async function logout(req, res) {
  const accessToken = req.headers.authorization?.replace('Bearer ', '')

  if (!accessToken) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const { error } = await supabase.auth.signOut({
    accessToken,
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.json({ message: 'Logged out' })
}

export async function me(req, res) {
  console.log("[ME] Incoming request:", req.method, req.originalUrl);
  const authHeader = req.headers.authorization;
  console.log("[ME] Authorization header:", authHeader);

  const accessToken = authHeader?.replace('Bearer ', '');
  console.log("[ME] Extracted token:", accessToken);

  if (!accessToken) {
    console.error("[ME] No token provided!");
    return res.status(401).json({ error: 'No token' });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
  if (authError || !authData.user) {
    console.error("[ME] Supabase auth error:", authError);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const authUserId = authData.user.id;
  console.log("[ME] Supabase user ID:", authUserId);

  const { data: userData, error: userError } = await supabase
    .from('t_user')
    .select('*')
    .eq('auth_userID', authUserId)
    .maybeSingle();

  if (userError) {
    console.error("[ME] Error fetching t_user:", userError);
    return res.status(500).json({ error: userError.message });
  }

  console.log("[ME] t_user data:", userData);

  return res.json({
    auth: authData.user,
    profile: userData || null,
  });
}


export async function requireAuth(req, res, next) {
  console.log("\n[Auth] Incoming request:", req.method, req.originalUrl);

  const authHeader = req.headers.authorization;
  console.log("[Auth] Authorization header:", authHeader);

  const accessToken = authHeader?.replace("Bearer ", "");
  console.log("[Auth] Extracted access token:", accessToken);

  if (!accessToken) {
    console.error("[Auth] No token provided!");
    return res.status(401).json({ error: "No token provided" });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !authData.user) {
    console.error("[Auth] Supabase auth error:", authError);
    console.error("[Auth] Supabase returned user:", authData?.user);
    return res.status(401).json({ error: "Invalid token" });
  }

  const authUserId = authData.user.id;
  console.log("[Auth] Authenticated Supabase user ID:", authUserId);

  const { data: userData, error: userError } = await supabase
    .from("t_user")
    .select("*")
    .eq("auth_userID", authUserId)
    .single();

  if (userError || !userData) {
    console.error("[Auth] Error fetching t_user:", userError);
    console.error("[Auth] t_user data:", userData);
    return res.status(401).json({ error: "User profile not found" });
  }

  console.log("[Auth] Found t_user:", userData);

  req.authUser = authData.user;
  req.user = userData;

  console.log("[Auth] Middleware complete, passing to next handler\n");
  next();
}
