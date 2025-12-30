import { supabase } from "../services/supabaseService.js";

export async function getGmailTokenByUser(userID) {
    const { data, error } = await supabase
        .from("t_gmail_token")
        .select("*")
        .eq("userID", userID)
        .single();

    if (error) throw new Error("Gmail token not found")
    return data
}

export async function upsertGmailToken(userID, tokens) {
    const { error } = await supabase
        .from("t_gmail_token")
        .upsert({
            userID,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type,
            expiry_date: tokens.expiry_date,
            updated_at: new Date()
        })

    if (error) throw error
}