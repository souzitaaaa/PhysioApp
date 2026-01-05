import { supabase } from "../scripts/supabase";

// Athlete type
export type Athlete = {
  athleteID: number;
  name: string;
};

// Fetch athlete by ID
export async function fetchAthleteByID(
  athleteID: number
): Promise<Athlete | null> {
  const { data, error } = await supabase
    .from("t_athlete")
    .select("name")
    .eq("athleteID", athleteID)
    .single();

  if (error) {
    console.log("Erro ao buscar atleta:", error);
    return null;
  }

  return data;
}
