import { supabase } from "../services/supabaseService.js";

// GET | All Emails
export async function getAllEmails(req, res) {
	const { data, error } = await supabase.from("t_email").select("*");

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Email by ID
export async function getEmailByID(req, res) {
	const emailID = req.params.id;

	const { data, error } = await supabase
		.from("t_email")
		.select("*")
		.eq("emailID", emailID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}
