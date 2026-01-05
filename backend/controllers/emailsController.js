import { supabase } from "../services/supabaseService.js";

// GET | All Emails
export async function getAllEmails(req, res) {
	const { data, error } = await supabase
		.from("v_email")
		.select("*")
		.eq("isDeletedBit", false)
		.not("injuryRecordID", "is", null)
		.order("emailID", { ascending: false });

	if (error) return res.status(500).json({ error });
	return res.json(data);
}


// GET | Email by ID
export async function getEmailByID(req, res) {
	const emailID = req.params.id;

	const { data, error } = await supabase
		.from("v_email")
		.select("*")
		.eq("emailID", emailID)
		.eq("isDeletedBit", false)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}


// GET | Email Count with StatusID = 1 (Error)
export async function getEmailErrorCount(req, res) {
	const { count, error } = await supabase
		.from("t_injury_record")
		.select("*", { count: "exact", head: true })
		.eq("statusID", 1);

	if (error) return res.status(500).json({ error: error.message });

	return res.json({ count });

}

// UPDATE | Email with error
export async function updateEmail(req, res) {
	const injuryRecordID = req.params.id;
	const payload = req.body;

	if (isNaN(injuryRecordID))
		return res.status(400).json({ error: "Invalid email" });

	const { data, error } = await supabase.from('t_injury_record').update([
		{
			athleteID: payload.athleteID,
			userID: payload.userID,
			title: payload.injury_title,
			resume: payload.injury_resume,
			statusID: 4,
			errorSpecID: null,
		},
	])
		.eq('injuryRecordID', payload.injuryRecordID)
		.select('*')

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// DELETE | Email by ID + delete associated injury record
export async function deleteEmail(req, res) {
	const emailID = parseInt(req.params.id, 10);

	if (isNaN(emailID))
		return res.status(400).json({ error: "Invalid email ID" });

	const { password } = req.body;

	if (!password)
		return res.status(400).json({ error: "Password is required" });

	if (password !== process.env.DELETE_PASSWORD)
		return res.status(401).json({ error: "Invalid password" });

	//  Get the email first
	const { data: emailData, error: emailError } = await supabase
		.from("t_email")
		.select("emailID, injuryRecordID")
		.eq("emailID", emailID)
		.eq("isDeletedBit", false)
		.single();

	if (emailError) return res.status(500).json({ error: emailError });
	if (!emailData) return res.status(404).json({ error: "Email not found or already deleted" });

	const { injuryRecordID } = emailData;

	// Soft-delete email and set injuryRecordID to null
	const { data: updatedEmail, error: updateError } = await supabase
		.from("t_email")
		.update({
			isDeletedBit: true,
			injuryRecordID: null
		})
		.eq("emailID", emailID)
		.select("*");

	if (updateError) return res.status(500).json({ error: updateError });

	//  Now delete the injury record safely
	if (injuryRecordID) {
		const { error: recordError } = await supabase
			.from("t_injury_record")
			.delete()
			.eq("injuryRecordID", injuryRecordID);

		if (recordError) return res.status(500).json({ error: recordError });
	}

	return res.json({
		message: "Email soft-deleted and associated injury record deleted successfully",
		data: updatedEmail,
	});
}









//! HELPER FUNCTIONS FOR GMAIL LOGIC

// GET | Email with ID already exists
export async function getEmailExists(emailID) {
	const { data, error } = await supabase
		.from("t_email")
		.select("realEmailID, isPhysioBit, isDeletedBit")
		.eq("realEmailID", emailID)
		.limit(1)
		.maybeSingle();

	if (error) throw error;

	return {
		exists: !!data,							// If null = false | If {} = true
		isPhysioBit: data?.isPhysioBit ?? true, // default to true if null
		isDeletedBit: data?.isDeletedBit ?? false
	}
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