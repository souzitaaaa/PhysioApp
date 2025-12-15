import { supabase } from "../scripts/supabase";

export type Reminder = {
  reminderID?: number;
  title: string;
  date: string;
  injuryRecordID: number;
  created_at?: string;
  timeStart: string;
  timeEnd: string;
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
  const { error } = await supabase
    .from("t_reminder")
    .insert([reminder]);

  if (error) {
    console.log("Erro ao criar reminder:", error);
    throw error;
  }
}
