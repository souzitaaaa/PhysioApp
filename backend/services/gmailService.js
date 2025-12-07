import fs from "fs";
import { google } from "googleapis";

const TOKEN_PATH = "token.json";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
    });
}

export async function saveToken(code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

export function loadToken() {
    if (!fs.existsSync(TOKEN_PATH)) return false;

    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(tokens);
    return true;
}

export async function listLabels() {
    if (!loadToken()) throw new Error("No token found. Go to /gmail/auth first.");

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const labels = await gmail.users.labels.list({ userId: "me" });
    return labels.data.labels;
}

export async function listEmails(maxResults = 10) {
    if (!loadToken()) throw new Error("No token found. Go to /gmail/auth first.")
    
    const gmail = google.gmail({ version: "v1", auth: oauth2Client })
    const messagesList = await gmail.users.messages.list({
        userId: "me",
        maxResults
    })

    if (!messagesList.data.messages) return []

    const messages = await Promise.all(
        messagesList.data.messages.map(async (msg) => {
            const messageDetail = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full"
            })
          
            const headers = messageDetail.data.payload.headers
            const subject = headers.find((h) => h.name === "Subject")?.value
            const from = headers.find((h) => h.name === "From")?.value
            const date = headers.find((h) => h.name === "Date")?.value

            let body = ""
            const parts = messageDetail.data.payload.parts
            if (parts) {
                const textPart = parts.find((p) => p.mimeType === "text/plain")
                if (textPart?.body?.data)
                    body = Buffer.from(textPart.body.data, "base64").toString("utf-8")
            }

            return { id: msg.id, from, subject, date, body }
        })
    )
    return messages;
}

//TODO list emails
