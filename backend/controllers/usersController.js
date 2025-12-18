import { supabase } from "../services/supabaseService.js";

// GET | All Users
export async function getAllUsers(req, res) {
	const { data, error } = await supabase.from("v_user").select("*")
		.order("name", { ascending: true });

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | User by ID
export async function getUserByID(req, res) {
	const userID = req.params.id;

	const { data, error } = await supabase
		.from("v_user")
		.select("*")
		.eq("userID", userID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
