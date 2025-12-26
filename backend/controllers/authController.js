import { supabase } from "../services/supabaseService.js";
import { stripIsNew } from "../utils/utils.js"

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

  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  return res.json(data.user)
}
