import { supabase } from "../scripts/supabase";

export type InjuryRecord = {
  injuryRecordID: number;
  athleteID: number;
  physioID: number;
  resume: string;
  statusID: number;
  errorSpecID: number;
  dateStart: string;
  dateEnd: string;
  title: string;
};

export async function fetchInjuryRecordsByAthlete(athleteID: number): Promise<InjuryRecord[]> {
  const { data, error } = await supabase
    .from("t_injury_record")
    .select("*")
    .eq("athleteID", athleteID)
    .order("dateStart", { ascending: false });

  if (error) {
    console.log("Erro ao carregar histórico do atleta:", error);
    return [];
  }

  return data || [];
}


export async function fetchAllInjuryRecords(): Promise<InjuryRecord[]> {
  const { data, error } = await supabase
    .from("t_injury_record")
    .select("*")
    .order("dateStart", { ascending: false });

  if (error) {
    console.log("Erro ao carregar todos os registos de lesão:", error);
    return [];
  }

  return data || [];
}
