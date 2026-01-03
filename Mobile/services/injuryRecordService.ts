import { supabase } from "../scripts/supabase";

export type InjuryRecord = {
  injuryRecordID: number;
  athleteID: number;
  userID: number;
  resume: string;
  statusID: number;
  errorSpecID: number;
  dateStart: string;
  dateEnd: string | null;
  title: string;
  created_at: string;
  taux_status?: {
    status: string;
  };
  t_user?: {
    name: string;
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
    .neq("statusID", 1) 
    .order("created_at", { ascending: false });
    

  if (error) {
    console.log("Erro ao carregar histórico do atleta:", error);
    return [];
  }

  return data || [];
}


export async function fetchAllInjuryRecords(): Promise<InjuryRecord[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data: internalUser, error: userError } = await supabase
    .from("t_user")
    .select("userID")
    .eq("auth_userID", user.id)
    .single();

  if (userError || !internalUser) {
    console.log("Utilizador interno não encontrado");
    return [];
  }

  const userID = internalUser.userID;

  const { data, error } = await supabase
    .from("t_injury_record")
    .select(`
      *,
      taux_status (
        status
      )
    `)
    .or(`userID.eq.${userID},userID.is.null`)
    .neq("statusID", 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Erro ao carregar registos:", error);
    return [];
  }

  return data || [];
}



export async function fetchInjuryRecordById(
  injuryRecordID: number
): Promise<InjuryRecord | null> {
  const { data, error } = await supabase
    .from("t_injury_record")
    .select(`
      *,
      t_user (
        name
      )
    `)
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

export async function setInjuryRecordWithNote(injuryRecordID: number) {

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Nenhum usuário logado.");

  const authUserID = user.id; 

  const { data: users, error: userError } = await supabase
    .from("t_user")
    .select("userID")
    .eq("auth_userID", authUserID)
    .single(); 

  if (userError || !users) throw new Error("Usuário interno não encontrado.");

  const userID = users.userID; 

  const { error } = await supabase
    .from("t_injury_record")
    .update({
      statusID: 3,
      userID: userID, 
    })
    .eq("injuryRecordID", injuryRecordID);

  if (error) {
    console.log("Erro ao mudar status para 3:", error);
    throw error;
  }

  console.log("Registro atualizado com sucesso!");
}

