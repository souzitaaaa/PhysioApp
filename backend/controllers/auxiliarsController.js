import { supabase } from "../services/supabaseService.js";

// GET | Division
export async function getDivisions(req, res) {
	const { data, error } = await supabase.from("taux_division").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Relations
export async function getRelations(req, res) {
	const { data, error } = await supabase.from("taux_relation").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | User Type
export async function getUserType(req, res) {
	const { data, error } = await supabase.from("taux_user_type").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
