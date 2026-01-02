import * as gmailService from "../services/gmailService.js"
import { parseEmailAI } from "../emailDetection/parseEmailAI.js";
import { getEmailExists, getExistingEmailHasRecord, createEmail, updateEmailWithRecord } from "./emailsController.js";
import { getVerifyAccountable, getVerifyAthlete } from "../functions/athletesFunctions.js";
import { createInjuryRecord } from "./injuriesController.js";
import { getMatchingAthletes } from "../utils/utils.js"
import { getGmailTokenByUser } from "../functions/gmailFunctions.js";

// AUTH | Get Auth URL
export async function auth(req, res) {
    const url = gmailService.getAuthUrl(req.user.userID);
    res.json({ url })
}

// AUTH CALLBACK | Save tokens
export async function oauthCallback(req, res) {
    const code = req.query.code;
    const userID = req.query.state;

    if (!userID) return res.status(400).send("Missing user context");

    try {
        const tokens = await gmailService.saveToken(code, userID);

        res.redirect('http://localhost:5173/email');
    } catch (error) {
        console.error("Gmail OAuth error:", error);
        res.redirect('http://localhost:5173/login' + encodeURIComponent(error.message));
    }
}

export async function checkToken(req, res) {
    try {
        const userID = req.user.userID;
        const row = await getGmailTokenByUser(userID);

        if (!row) {
            return res.json({ connected: false });
        }

        const isExpired = row.expiry_date && new Date(row.expiry_date) < new Date();

        res.json({
            connected: true,
            expired: isExpired,
        });
    } catch (error) {
        console.error("Token check error:", error);
        res.json({ connected: false });
    }
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
        console.log("📧 [getEmails] Starting to fetch emails for user:", req.user.userID);

        const emails = await gmailService.listEmails(req.user.userID, 10);
        console.log(`📧 [getEmails] Found ${emails.length} emails from Gmail`);

        for (const [index, e] of emails.entries()) {
            console.log(`\n--- 📬 [getEmails] Processing email ${index + 1}/${emails.length} ---`);
            console.log(`📬 [getEmails] Email ID: ${e.id}`);
            console.log(`📬 [getEmails] Subject: ${e.subject}`);
            console.log(`📬 [getEmails] From: ${e.from}`);

            const emailCheck = await getEmailExists(e.id);
            console.log(`📬 [getEmails] Email exists in DB: ${emailCheck.exists}`);
            console.log(`📬 [getEmails] Email isPhysioBit: ${emailCheck.isPhysioBit}`);

            if (!emailCheck.exists) {
                console.log(`📬 [getEmails] Creating new email in DB...`);
                await createEmail(e);
                console.log(`✅ [getEmails] Email created successfully`);
            } else {
                // Check if email is not physio-related
                if (!emailCheck.isPhysioBit) {
                    console.log(`⏭️  [getEmails] Skipping - email is not physio-related`);
                    continue;
                }

                const hasRecord = await getExistingEmailHasRecord(e.id);
                console.log(`📬 [getEmails] Email has injury record: ${hasRecord}`);

                if (hasRecord) {
                    console.log(`⏭️  [getEmails] Skipping - already has record`);
                    continue;
                }
            }

            console.log(`🤖 [getEmails] Preparing to create injury record...`);
            const injuryRecordID = await prepareCreationInjuryRecordID(e);

            if (injuryRecordID) {
                console.log(`✅ [getEmails] Injury record created with ID: ${injuryRecordID}`);
                await updateEmailWithRecord(e.id, injuryRecordID);
                console.log(`✅ [getEmails] Email updated with record ID`);
            } else {
                console.log(`⚠️  [getEmails] No injury record created (parseEmailAI returned null)`);
            }
        }

        console.log(`\n✅ [getEmails] Finished processing all emails\n`);
        res.json(emails);
    } catch (error) {
        console.error("❌ [getEmails] Error:", error);
        console.error("❌ [getEmails] Stack:", error.stack);
        res.status(400).send(error.message);
    }
}

async function prepareCreationInjuryRecordID(emailData) {
    console.log("\n🔍 [prepareCreation] ===== Starting injury record preparation =====");
    console.log("🔍 [prepareCreation] Email data:", {
        id: emailData.id,
        subject: emailData.subject,
        from: emailData.from,
        body: emailData.body,
        date: emailData.date
    });

    // Parse email with AI
    console.log("🤖 [prepareCreation] Calling parseEmailAI...");
    const aiResult = await parseEmailAI(emailData);

    // Check if email is physio-related
    if (!aiResult.isPhysioBit) {
        console.log("⚠️  [prepareCreation] Email is NOT physio-related - updating database");
        await updateEmailIsPhysioBit(emailData.id, false);
        console.log("✅ [prepareCreation] Email marked as non-physio - stopping");
        return null;
    }

    const injuryRecordData = aiResult.data;

    if (!injuryRecordData) {
        console.log("⚠️  [prepareCreation] parseEmailAI returned null - stopping");
        return;
    }

    console.log("🤖 [prepareCreation] AI parsed data:", injuryRecordData);

    const {
        athleteName = null,
        senderEmail = null,
    } = injuryRecordData || {};

    console.log("🔍 [prepareCreation] Extracted:", { athleteName, senderEmail });

    let errorSpecID = null;
    let athleteID = null;

    // =====================================================
    // 1. Check if accountable exists
    // =====================================================
    console.log("👤 [prepareCreation] Checking if accountable exists:", senderEmail);
    const accountableExists = await getVerifyAccountable(senderEmail);
    console.log("👤 [prepareCreation] Accountable found:", accountableExists ? "YES" : "NO");

    if (accountableExists) {
        console.log("👤 [prepareCreation] Accountable data:", accountableExists);
    }

    // =====================================================
    // 2. Accountable DOES NOT exist
    // =====================================================
    if (!accountableExists) {
        console.log("⚠️  [prepareCreation] No accountable found - starting global athlete search");
        errorSpecID = 1; // Responsável não encontrado

        const athleteExists = await getVerifyAthlete(athleteName);
        console.log("🏃 [prepareCreation] Global athletes found:", athleteExists ? athleteExists.length : 0);

        if (!athleteExists || athleteExists.length === 0) {
            console.log("❌ [prepareCreation] No athlete found - errorSpecID = 3");
            errorSpecID = 3; // Geral
        }
        else if (athleteExists.length > 1) {
            console.log("⚠️  [prepareCreation] Multiple athletes found - errorSpecID = 3");
            errorSpecID = 3; // Geral (ambiguous)
        }
        else {
            athleteID = athleteExists[0].athleteID;
            console.log("✅ [prepareCreation] Single athlete matched globally - athleteID:", athleteID);
        }
    }

    // =====================================================
    // 3. Accountable EXISTS
    // =====================================================
    else {
        console.log("✅ [prepareCreation] Accountable exists - checking athlete under accountable...");

        const matchingAthletes = getMatchingAthletes(accountableExists, athleteName);
        console.log("🏃 [prepareCreation] Matching athletes count:", matchingAthletes.length);

        if (matchingAthletes.length > 0) {
            console.log("🏃 [prepareCreation] Matching athletes:", matchingAthletes.map(a => ({
                athleteID: a.athleteID,
                name: a.name
            })));
        }

        // -------------------------------------------------
        // 3.1 Perfect match
        // -------------------------------------------------
        if (matchingAthletes.length === 1) {
            athleteID = matchingAthletes[0].athleteID;
            console.log("✅ [prepareCreation] Perfect match - athleteID:", athleteID);
        }

        // -------------------------------------------------
        // 3.2 Multiple matches under accountable
        // -------------------------------------------------
        else if (matchingAthletes.length > 1) {
            console.log("⚠️  [prepareCreation] Multiple matching athletes - errorSpecID = 3");
            errorSpecID = 3; // Geral
        }

        // -------------------------------------------------
        // 3.3 No match under accountable → fallback
        // -------------------------------------------------
        else {
            console.log("⚠️  [prepareCreation] Athlete not under accountable - trying global search");
            errorSpecID = 2; // intermediate state (DO NOT persist)

            const athleteExists = await getVerifyAthlete(athleteName);
            console.log("🏃 [prepareCreation] Global athletes found:", athleteExists ? athleteExists.length : 0);

            if (athleteExists && athleteExists.length === 1) {
                athleteID = athleteExists[0].athleteID;
                errorSpecID = 1; // Responsável não encontrado
                console.log("⚠️  [prepareCreation] Athlete found globally but not under accountable - errorSpecID = 1");
            }
            else if (athleteExists && athleteExists.length > 1) {
                errorSpecID = 3; // Geral
                console.log("⚠️  [prepareCreation] Multiple global athletes found - errorSpecID = 3");
            }
            else {
                errorSpecID = 3; // Geral
                console.log("❌ [prepareCreation] Athlete not found globally - errorSpecID = 3");
            }
        }
    }

    // =====================================================
    // 5. Create injury record
    // =====================================================
    console.log("\n💾 [prepareCreation] Creating injury record with:");
    console.log("   - athleteID:", athleteID || "NULL");
    console.log("   - errorSpecID:", errorSpecID || "NULL (no errors)");
    console.log("   - injuryRecordData:", injuryRecordData);

    const injuryRecordID = await createInjuryRecord(
        injuryRecordData,
        athleteID,
        errorSpecID
    );

    console.log("✅ [prepareCreation] Injury record created with ID:", injuryRecordID);
    console.log("🔍 [prepareCreation] ===== Finished injury record preparation =====\n");

    return injuryRecordID;
}

// UPDATE | Update email isPhysioBit status
async function updateEmailIsPhysioBit(emailID, isPhysioBit) {
    const { error } = await supabase
        .from("t_email")
        .update({ isPhysioBit })
        .eq("realEmailID", emailID);

    if (error) throw error;
}


