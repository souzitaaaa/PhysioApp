import express from "express";
import open from "open";
import fs from "fs";
import { google } from "googleapis";
import "dotenv/config";

const app = express();
const TOKEN_PATH = "token.json";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

app.get("/auth", async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("Authorize this app by visiting:", authUrl);
  open(authUrl);
  res.send("Opening Google Authorization Page...");
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("Token saved to", TOKEN_PATH);

  res.send("Authorization complete. You can close this window.");
});

app.get("/labels", async (req, res) => {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
      oauth2Client.setCredentials(tokens);
    } else {
      return res.send("No token found. Please go to /auth first.");
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const labels = await gmail.users.labels.list({ userId: "me" });
    res.json(labels.data.labels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving labels");
  }
});

app.get("/emails", async (req, res) => {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
      oauth2Client.setCredentials(tokens);
    } else {
      return res.send("No token found. Please go to /auth first.");
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // List the latest 10 messages
    const messagesList = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10, // adjust how many you want
    });

    if (!messagesList.data.messages || messagesList.data.messages.length === 0) {
      return res.send("No messages found.");
    }

    // Get full details for each message
    const messages = await Promise.all(
      messagesList.data.messages.map(async (msg) => {
        const messageDetail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "full", // you can also use 'metadata' or 'raw'
        });

        // Extract headers we care about
        const headers = messageDetail.data.payload.headers;
        const subject = headers.find((h) => h.name === "Subject")?.value;
        const from = headers.find((h) => h.name === "From")?.value;
        const date = headers.find((h) => h.name === "Date")?.value;

        // Extract body if text/plain exists
        let body = "";
        const parts = messageDetail.data.payload.parts;
        if (parts) {
          const textPart = parts.find((p) => p.mimeType === "text/plain");
          if (textPart && textPart.body.data) {
            body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
          }
        }

        return { id: msg.id, from, subject, date, body };
      })
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving emails");
  }
});


app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Start OAuth flow: http://localhost:3000/auth");
});
