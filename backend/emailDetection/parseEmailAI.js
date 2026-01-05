import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, cleanAIJson } from "../utils/utils.js";

// https://aistudio.google.com/
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function parseEmailAI(email) {
//     try {
//         const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

//         const inputText = SYSTEM_PROMPT + "\n\n" + `
//       Email From: ${email.from}
//       Email Subject: ${email.subject}
//       Email Date: ${email.date}
//       Email Body:
//       ${email.body}`;

//         const result = await model.generateContent({
//             contents: [
//                 { role: "user", parts: [{ text: inputText }] }
//             ]
//         });
//         const rawOutput = result.response.text();
//         const cleanedOutput = cleanAIJson(rawOutput)

//         return JSON.parse(cleanedOutput);
//     } catch (error) {
//         console.error("Gemini returned invalid JSON: ", error);
//         return null;
//     }
// }

// https://aistudio.google.com/
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseEmailAI(email) {
    console.log(" [parseEmailAI] Email input:", {
        id: email.id,
        from: email.from,
        subject: email.subject,
        date: email.date,
        bodyLength: email.body?.length || 0
    });

    try {
        console.log(" [parseEmailAI] Getting Gemini model: gemini-2.5-flash");
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

        const inputText = SYSTEM_PROMPT + "\n\n" + `
      Email From: ${email.from}
      Email Subject: ${email.subject}
      Email Date: ${email.date}
      Email Body:
      ${email.body}`;

        console.log(" [parseEmailAI] Input text prepared:");
        console.log("   - System prompt length:", SYSTEM_PROMPT.length);
        console.log("   - Total input length:", inputText.length);

        console.log(" [parseEmailAI] Calling Gemini API...");
        const startTime = Date.now();

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: inputText }] }
            ]
        });

        const endTime = Date.now();
        console.log(` [parseEmailAI] Gemini API responded in ${endTime - startTime}ms`);

        const rawOutput = result.response.text();
        console.log(" [parseEmailAI] Raw AI output:", rawOutput);
        console.log(" [parseEmailAI] Raw output length:", rawOutput.length);

        console.log(" [parseEmailAI] Cleaning JSON...");
        const cleanedOutput = cleanAIJson(rawOutput);
        console.log(" [parseEmailAI] Cleaned output:", cleanedOutput);

        console.log(" [parseEmailAI] Parsing JSON...");
        const parsedData = JSON.parse(cleanedOutput);

        if (parsedData === null) {
            console.warn(" [parseEmailAI] AI determined this email is NOT an injury report");
            return { isPhysioBit: false, data: null };
        }

        console.log(" [parseEmailAI] Successfully parsed JSON:");
        console.log("   - athleteName:", parsedData.athleteName);
        console.log("   - senderEmail:", parsedData.senderEmail);
        console.log("   - title:", parsedData.title);
        console.log("   - startDate:", parsedData.startDate);
        console.log("   - resume length:", parsedData.resume?.length || 0);
        console.log(" ===== AI PARSING END (SUCCESS) =====\n");

        return { isPhysioBit: true, data: parsedData };

    } catch (error) {
        console.error("\n ===== AI PARSING ERROR =====");
        console.error(" [parseEmailAI] Error type:", error.name);
        console.error(" [parseEmailAI] Error message:", error.message);

        if (error instanceof SyntaxError) {
            console.error(" [parseEmailAI] JSON parsing failed");
            console.error(" [parseEmailAI] Attempted to parse:", error.message);
        } else if (error.response) {
            console.error(" [parseEmailAI] API error response:", error.response);
        } else {
            console.error(" [parseEmailAI] Full error:", error);
        }

        console.error(" [parseEmailAI] Stack trace:", error.stack);
        console.error(" ===== AI PARSING END (FAILED) =====\n");

        return { isPhysioBit: false, data: null };
    }
}

