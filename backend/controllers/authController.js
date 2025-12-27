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
  const accessToken = req.headers.authorization?.replace('Bearer ', '')

  if (!accessToken) {
    return res.status(401).json({ error: 'No token' })
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
  if (authError || !authData.user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const authUserId = authData.user.id

  // Use maybeSingle() para evitar erro se não existir registro
  const { data: userData, error: userError } = await supabase
    .from('t_user')
    .select('*')
    .eq('auth_userID', authUserId)
    .maybeSingle()

  if (userError) {
    return res.status(500).json({ error: userError.message })
  }

  return res.json({
    auth: authData.user,
    profile: userData || null, // null se não existir
  })
}


