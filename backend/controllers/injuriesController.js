import { supabase } from "../services/supabaseService.js";

// GET | All Records
export async function getAllRecords(req, res) {
	const { data, error } = await supabase.from("v_injury_record").select("*").order("injuryRecordID", { ascending: false });

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | Record by ID
export async function getRecordByID(req, res) {
	const injuryRecordID = req.params.id;

	const { data, error } = await supabase
		.from("v_injury_record")
		.select("*")
		.eq("injuryRecordID", injuryRecordID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}






















// POST | Creates email from gmail API
export async function createInjuryRecord(injuryRecordData, athleteID, errorSpecID) {

    const { data, error } = await supabase
        .from("t_injury_record")
        .insert({
            athleteID: athleteID,
            title: injuryRecordData.title,
            resume: injuryRecordData.resume,
            statusID: errorSpecID ? 1 : 4,
            errorSpecID: errorSpecID,
            dateStart: new Date(injuryRecordData.startDate),
        })
        .select();;

    if (error) throw error;

    const injuryRecordID = data[0].injuryRecordID;

    return injuryRecordID;
}