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

// DELETE | User
export async function deleteUser(req, res) {
	const userID = parseInt(req.params.id, 10);

	if (isNaN(userID))
		return res.status(400).json({ error: "Invalid user ID" });

	const { password } = req.body

	if (!password)
		return res.status(400).json({ error: "Password is required" });

	if (password !== process.env.DELETE_PASSWORD)
		return res.status(401).json({ error: "Invalid password" });

	const { data, error } = await supabase
		.from('t_user')
		.delete()
		.eq('userID', userID)
		.select('*');

	if (error)
		return res.status(500).json({ error });

	if (!data || data.length === 0)
		return res.status(404).json({ error: "Aser not found" });

	return res.json({ message: "User deleted successfully", data });
}
