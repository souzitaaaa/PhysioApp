import { supabase } from "../services/supabaseService.js";

// GET | All Athletes
export async function getAllAthletes(req, res) {
	const { data, error } = await supabase.from("v_athlete").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Athlete by ID
export async function getAthleteByID(req, res) {
	const athleteID = req.params.id;

	const { data, error } = await supabase
		.from("v_athlete")
		.select("*")
		.eq("athleteID", athleteID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
