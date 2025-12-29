import { supabase } from "../scripts/supabase";

export type Reminder = {
  reminderID?: number;
  title: string;
  date: string;
  injuryRecordID: number; // ou injury_id conforme tabela
  created_at?: string;
};


// Buscar todos (já tens)
export async function fetchAllReminders(): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from("t_reminder")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.log("Erro ao carregar reminders:", error);
    return [];
  }

  return data || [];
}

export async function createReminder(reminder: Reminder) {
  const { data, error } = await supabase
    .from("t_reminder")
    .insert([reminder])
    .select(); // retorna o dado inserido

  if (error) {
    console.log("Erro ao criar reminder:", error);
    console.log("Payload enviado:", reminder);
    throw error;
  }

  console.log("Reminder criado com sucesso:", data);
  return data;
}

