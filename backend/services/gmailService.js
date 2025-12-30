import fs from "fs";
import { google } from "googleapis";
import { SCOPES, TOKEN_PATH } from '../utils/utils.js'
import { getGmailTokenByUser, upsertGmailToken } from "../functions/gmailFunctions.js";

function createOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
}

// Generate Auth URL
export function getAuthUrl(userID) {
    const oauth2Client = createOAuthClient()

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
        state: String(userID)
    });
}

// Exchange code and saves token
export async function saveToken(code, userID) {
    const oauth2Client = createOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    await upsertGmailToken(userID, tokens);

    console.log(`[Gmail] Saved token for user ${userID}:`, JSON.stringify(tokens, null, 2));

    return tokens;
}


// Get Authorized Client
export async function getAuthorizedClient(userID) {
    const oauth2Client = createOAuthClient();
    const row = await getGmailTokenByUser(userID);

    if (!row) throw new Error("No Gmail token found");

    const token = {
        access_token: row.access_token,
        refresh_token: row.refresh_token,
        scope: row.scope,
        token_type: row.token_type,
        expiry_date: row.expiry_date
    };

    console.log("[Gmail] Loaded token:", JSON.stringify(token, null, 2));

    oauth2Client.setCredentials(token);

    oauth2Client.on("tokens", async (newTokens) => {
        await upsertGmailToken(userID, {
            ...token,
            ...newTokens
        });
    });

    return oauth2Client;
}


// GET | Labels
export async function listLabels(userID) {
    const auth = await getAuthorizedClient(userID);
    const gmail = google.gmail({ version: "v1", auth });

    const labels = await gmail.users.labels.list({ userId: "me" });
    return labels.data.labels;
}

// GET | Emails
export async function listEmails(userID, maxResults = 10) {
    const auth = await getAuthorizedClient(userID);
    const gmail = google.gmail({ version: "v1", auth });

    const messagesList = await gmail.users.messages.list({
        userId: "me",
        maxResults
    });

    if (!messagesList.data.messages) return [];

    const messages = await Promise.all(
        messagesList.data.messages.map(async (msg) => {
            const messageDetail = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full"
            });

            const headers = messageDetail.data.payload.headers;
            const subject = headers.find(h => h.name === "Subject")?.value;
            const from = headers.find(h => h.name === "From")?.value;
            const date = headers.find(h => h.name === "Date")?.value;

            let body = "";
            const parts = messageDetail.data.payload.parts;
            if (parts) {
                const textPart = parts.find(p => p.mimeType === "text/plain");
                if (textPart?.body?.data) {
                    body = Buffer.from(
                        textPart.body.data,
                        "base64"
                    ).toString("utf-8");
                }
            }

            return { id: msg.id, from, subject, date, body };
        })
    );

    return messages;
}
