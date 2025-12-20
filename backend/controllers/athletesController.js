import { supabase } from "../services/supabaseService.js";
import { stripIsNew } from "../utils/utils.js"

// GET | All Athletes
export async function getAllAthletes(req, res) {
	const { data, error } = await supabase.from("v_athlete").select("*")
		.order("name", { ascending: true });

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Athlete by ID
export async function getAthleteByID(req, res) {
	const athleteID = parseInt(req.params.id, 10);

	const { data, error } = await supabase
		.from("v_athlete")
		.select("*")
		.eq("athleteID", athleteID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Athlete Accountable
export async function getAthleteAccountables(req, res) {
	const athleteID = req.params.id;

	const { data, error } = await supabase
		.from("v_accountable")
		.select("*")
		.eq("athleteID", athleteID);

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Verification if Accountable Email exists on database
export async function getVerifyAccountable(accEmail) {

	let query = supabase
		.from("v_accountable")
		.select("accountableID, name, email, athleteID, athlete_name")
		.eq("email", accEmail)

	const { data, error } = await query;

	if (error) throw error;

	return data && data.length > 0 ? data : null;
}

// GET | Verification if Athlete Name exists on database
export async function getVerifyAthlete(athleteName) {
	if (!athleteName) return null;

	const nameParts = athleteName.trim().toLowerCase().split(/\s+/);

	const orConditions = nameParts.map(part => `name.ilike.%${part}%`).join(",");
	const { data, error } = await supabase
		.from("t_athlete")
		.select("athleteID, name")
		.or(orConditions);

	if (error) throw error;
	if (!data || data.length === 0) return null;

	const matchingAthletes = data.filter(record => {
		const dbName = record.name.trim().toLowerCase();
		return nameParts.every(part => dbName.includes(part));
	});

	return matchingAthletes.length > 0 ? matchingAthletes : null;
}

// GET | Athlete History
export async function getAthleteHistory(req, res) {
	const athleteID = req.params.id;

	const { data, error } = await supabase
		.from("v_injury_record")
		.select("*")
		.eq("athleteID", athleteID)
		.neq("statusID", 1)
		.order("dateStart", { ascending: false });

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// DELETE | Athlete
export async function deleteAthlete(req, res) {
	const athleteID = parseInt(req.params.id, 10);

	if (isNaN(athleteID))
		return res.status(400).json({ error: "Invalid athlete ID" });

	const { password } = req.body

	if (!password)
		return res.status(400).json({ error: "Password is required" });

	if (password !== process.env.DELETE_PASSWORD)
		return res.status(401).json({ error: "Invalid password" });

	const { data, error } = await supabase
		.from('t_athlete')
		.delete()
		.eq('athleteID', athleteID)
		.select('*');

	if (error)
		return res.status(500).json({ error });

	if (!data || data.length === 0)
		return res.status(404).json({ error: "Athlete not found" });

	return res.json({ message: "Athlete deleted successfully", data });
}

// POST | Accountable
export async function createAthleteAccountables(req, res) {
	const athleteID = parseInt(req.params.id, 10);

	let payload = stripIsNew(req.body);

	if (Array.isArray(payload)) {
		payload = payload
			.map(item => ({
				...item,
				athleteID
			}))
			.filter(item => {
				const { name, email, phoneNumber, relationID } = item;
				return name || email || phoneNumber || relationID;
			});
	} else {
		const { name, email, phoneNumber, relationID } = payload;
		if (!(name || email || phoneNumber || relationID))
			return res.status(400).json({ error: "No valid data to insert" });
		payload = { ...payload, athleteID };
	}

	if (!payload || (Array.isArray(payload) && payload.length === 0))
		return res.status(400).json({ error: "No valid data to insert" });

	const { data, error } = await supabase
		.from("t_accountable")
		.insert(payload)
		.select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// UPDATE | Accountable
export async function updateAccountable(req, res) {
	const athleteID = parseInt(req.params.id, 10);
	const accountableID = parseInt(req.params.accountableID, 10);

	const payload = stripIsNew(req.body);

	const { data, error } = await supabase
		.from('t_accountable')
		.update(payload)
		.eq('accountableID', accountableID)
		.eq('athleteID', athleteID)
		.select('*');

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
