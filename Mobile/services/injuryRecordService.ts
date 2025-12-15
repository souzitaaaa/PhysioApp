import { supabase } from "../scripts/supabase";

export type InjuryRecord = {
  injuryRecordID: number;
  athleteID: number;
  physioID: number;
  resume: string;
  statusID: number;
  errorSpecID: number;
  dateStart: string;
  dateEnd: string | null;
  title: string;
  taux_status?: {
    status: string;
  };
};


export async function fetchInjuryRecordsByAthlete(
  athleteID: number
): Promise<InjuryRecord[]> {
  const { data, error } = await supabase
    .from("t_injury_record")
    .select(`
      *,
      taux_status (
        status
      )
    `)
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


export async function fetchInjuryRecordById(injuryRecordID: number): Promise<InjuryRecord | null> {
  const { data, error } = await supabase
    .from("t_injury_record")
    .select("*")
    .eq("injuryRecordID", injuryRecordID)
    .single();

  if (error) {
    console.log("Erro ao carregar registo da lesão:", error);
    return null;
  }

  return data;
}


export async function closeInjuryRecord(
  injuryRecordID: number,
  dateEnd: string
) {
  const { error } = await supabase
    .from("t_injury_record")
    .update({
      dateEnd,
      statusID: 2, // fechado
    })
    .eq("injuryRecordID", injuryRecordID);

  if (error) {
    console.log("Erro ao fechar registo:", error);
    throw error;
  }
}

