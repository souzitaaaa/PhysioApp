import { supabase } from "../scripts/supabase";

export type Note = {
  noteID: number;
  text: string;
  date: string;
  injuryRecordID: number;
  created_at: string;
};

export async function fetchNotesByRecord(injuryRecordID: number): Promise<Note[]> {
  const { data, error } = await supabase
    .from("t_note")
    .select("*")
    .eq("injuryRecordID", injuryRecordID)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Erro ao carregar notas:", error);
    return [];
  }

  return data || [];
}

export async function createNote(injuryRecordID: number, text: string) {
  const { error } = await supabase.from("t_note").insert({
    injuryRecordID,
    text,
    date: new Date().toISOString().split("T")[0],
  });

  if (error) {
    console.log("Erro ao criar nota:", error);
    return false;
  }

  return true;
}


