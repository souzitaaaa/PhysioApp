import { supabase } from "../services/supabaseService.js";

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