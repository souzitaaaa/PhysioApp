import { supabase } from "../scripts/supabase";

// Type representing a reminder
export type Reminder = {
  reminderID?: number;
  title: string;
  date: string;
  injuryRecordID: number;
  created_at?: string;
};

// Get current logged-in user ID
async function getLoggedUserID(): Promise<number | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: internalUser, error: userError } = await supabase
    .from("t_user")
    .select("userID")
    .eq("auth_userID", user.id)
    .single();

  if (userError || !internalUser) return null;

  return internalUser.userID;
}

// Fetch all reminders for logged-in user
export async function fetchAllReminders() {
  const userID = await getLoggedUserID();
  if (!userID) return []; 

  const { data, error } = await supabase
    .from("t_reminder")
    .select(`
      reminderID,
      title,
      date,
      injuryRecordID,
      t_injury_record (
        userID,
        athleteID,
        t_athlete (
          name
        )
      )
    `)
    .eq("t_injury_record.userID", userID)  
    .not("t_injury_record", "is", null)  
    .order("date", { ascending: true });

  if (error) {
    console.log("Erro ao carregar reminders:", error);
    return [];
  }

  return data || [];
}

// Create a new reminder
export async function createReminder(reminder: Reminder) {
  const { data, error } = await supabase
    .from("t_reminder")
    .insert([reminder])
    .select();

  if (error) {
    console.log("Erro ao criar reminder:", error);
    console.log("Payload enviado:", reminder);
    throw error;
  }

  console.log("Reminder criado com sucesso:", data);
  return data;
}

