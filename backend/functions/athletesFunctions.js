import { supabase } from "../services/supabaseService.js";

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