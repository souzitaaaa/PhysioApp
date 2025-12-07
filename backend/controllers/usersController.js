import { supabase } from "../services/supabaseService.js";

// GET | All Users
//TODO change select form t to v with usertype
export async function getAllUsers(req, res) {
	const { data, error } = await supabase.from("t_user").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | User by ID
export async function getUserByID(req, res) {
	const userID = req.params.id;

	const { data, error } = await supabase
		.from("t_user")
		.select("*")
		.eq("userID", userID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
