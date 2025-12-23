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

// GET | Athletes Monthly Summary
export async function getAthletesStatistics(req, res) {
	const { data, error } = await supabase.from("v_monthly_comparison").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Users Monthly Summary
export async function getUsersStatistics(req, res) {
	const { data, error } = await supabase.from("v_user_monthly_stats").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Athletes Injury Summary
export async function getAthleteInjurySummary(req, res) {
	const { data, error } = await supabase.from("v_athlete_injury_summary").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Athletes Stats Summary
export async function getAthleteStatsSummary(req, res) {
	const { data, error } = await supabase.from("v_total_athletes_summary").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Injuries by Month
export async function getInjuriesByMonth(req, res) {
	const { data, error } = await supabase.from("v_injuries_by_month").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
