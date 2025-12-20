import * as gmailService from "../services/gmailService.js"
import { parseEmailAI } from "../emailDetection/parseEmailAI.js";
import { getEmailExists, getExistingEmailHasRecord, createEmail, updateEmailWithRecord } from "./emailsController.js";
import { getVerifyAccountable, getVerifyAthlete } from "./athletesController.js";
import { createInjuryRecord } from "./injuriesController.js";
import { getMatchingAthletes } from "../utils/utils.js"

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
    try {
        const emails = await gmailService.listEmails(10)

        for (const e of emails) {
            const exists = await getEmailExists(e.id);
            if (!exists)
                await createEmail(e);
            else {
                const hasRecord = await getExistingEmailHasRecord(e.id)
                if (hasRecord)
                    continue
            }
            const injuryRecordID = await prepareCreationInjuryRecordID(e);
            if (injuryRecordID)
                await updateEmailWithRecord(e.id, injuryRecordID);
        }
        res.json(emails);
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function prepareCreationInjuryRecordID(emailData) {
    //! parsed = { athleteName, senderEmail, title, resume, startDate }
    const injuryRecordData = await parseEmailAI(emailData);
    if (!injuryRecordData)
        return;
    console.log("injuryRecordData: ", injuryRecordData)
    const {
        athleteName = null,
        senderEmail = null,
    } = injuryRecordData || {};
    let errorSpecID = null;
    let athleteID = null;

    let accountableExists = await getVerifyAccountable(senderEmail);

    //? if -    No Accountable found (Try verify athlete to attribute)
    //? else -  Athlete Verifications
    if (!accountableExists) {
        errorSpecID = 1;

        const athleteExists = await getVerifyAthlete(athleteName);

        //? if          No matching athlete
        //? else if -   More than one athlete
        if (!athleteExists)
            errorSpecID = 4;
        else if (athleteExists.length > 1)
            errorSpecID = 3;
        else
            athleteID = athleteExists[0].athleteID
    } else {
        const matchingAthletes = getMatchingAthletes(accountableExists, athleteName);

        //? if          No matching athlete
        //? else if -   More than one athlete
        //?             All good
        if (matchingAthletes.length === 0)
            errorSpecID = 2;
        else if (matchingAthletes.length > 1)
            errorSpecID = 3;
        else
            athleteID = matchingAthletes[0].athleteID
    }
    const injuryRecordID = await createInjuryRecord(injuryRecordData, athleteID, errorSpecID);
    return injuryRecordID;
}