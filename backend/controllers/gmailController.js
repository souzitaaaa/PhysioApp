import { gmail } from "@googleapis/gmail"
import * as gmailService from "../services/gmailService.js"

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
        res.json(emails)
    } catch (error) {
        res.status(400).send(error.message)
    }
}