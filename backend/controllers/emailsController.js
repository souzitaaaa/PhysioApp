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

// GET | Email with ID already exists
export async function getEmailExists(emailID) {
	const { data, error } = await supabase
		.from("t_email")
		.select("realEmailID")
		.eq("realEmailID", emailID)
		.limit(1)
		.maybeSingle();

	if (error) throw error;

	// If null = false | If {} = true
	return !!data;
}

// GET | Existing Email have injuryRecord created
export async function getExistingEmailHasRecord(emailID) {
	const { data, error } = await supabase
		.from("t_email")
		.select("realEmailID")
		.eq("realEmailID", emailID)
		.not("injuryRecordID", "is", null)
		.limit(1)
		.maybeSingle();

	if (error) throw error;

	// If null = false | If {} = true
	return !!data;
}

// POST | Creates email from gmail API
export async function createEmail(email) {

	const { data, error } = await supabase
		.from("t_email")
		.insert({
			realEmailID: email.id,
			from: email.from,
			subject: email.subject,
			body: email.body,
			date: new Date(email.date),
		});

	if (error) throw error;

	return { created: true };
}

// UPDATE | Email with RecordID just created
export async function updateEmailWithRecord(realEmailID, injuryRecordID) {
	const { data, error } = await supabase
		.from('t_email')
		.update({ injuryRecordID })
		.eq('realEmailID', realEmailID);

	if (error) throw error;
	return { created: true };
}