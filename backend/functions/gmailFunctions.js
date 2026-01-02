import { supabase } from "../services/supabaseService.js";

export async function getGmailTokenByUser(userID) {
    const { data, error } = await supabase
        .from("t_gmail_token")
        .select("*")
        .eq("userID", userID)
        .single();

    if (error && error.code === 'PGRST116') {
        return null;
    }

    if (error) throw new Error("Gmail token query error: " + error.message);

    return data;
}

export async function upsertGmailToken(userID, tokens) {
    // Check if token exists
    const existing = await getGmailTokenByUser(userID);

    const tokenData = {
        userID,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || existing?.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
        updated_at: new Date()
    };

    let error;

    if (existing) {
        ({ error } = await supabase
            .from("t_gmail_token")
            .update(tokenData)
            .eq("userID", userID));
    } else {
        ({ error } = await supabase
            .from("t_gmail_token")
            .insert(tokenData));
    }

    if (error) throw error;
}