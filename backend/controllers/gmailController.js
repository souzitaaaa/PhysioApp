import * as gmailService from "../services/gmailService.js"
import { parseEmailAI } from "../emailDetection/parseEmailAI.js";

// AUTH | Get Auth URL
export async function auth(req, res) {
    const url = gmailService.getAuthUrl();
    res.json({ url })
}

// AUTH CALLBACK | Save tokens
export async function oauthCallback(req, res) {
    const code = req.query.code
    await gmailService.saveToken(code)
    res.send("Authorization complete. You can close this window.")
}

// GET | Get Gmail Labels
export async function getLabels(req, res) {
    try {
        const labels = await gmailService.listLabels()
        res.json(labels)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// GET | Get Gmail Inbox
export async function getEmails(req, res) {
    try  {
        const emails = await gmailService.listEmails(10)
        //res.json(emails)
        for (const email of emails) {
            const parsed = await parseEmailAI(email); // parsed = { athleteName, senderName, injuryDescription, startDate, isInjury }
            
            console.log("📧 Original Email Subject:", email.subject);
            console.log("🧠 Parsed Output:", parsed);
        }

        // 3️⃣ Optionally send back raw emails + parsed (for testing)
        res.json({ emails, message: "Check your server console for parsed output" });
    } catch (error) {
        res.status(400).send(error.message)
    }
}