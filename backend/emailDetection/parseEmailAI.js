import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, cleanAIJson } from "../utils/utils.js";

// https://aistudio.google.com/
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseEmailAI(email) {
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

        const inputText = SYSTEM_PROMPT + "\n\n" + `
      Email From: ${email.from}
      Email Subject: ${email.subject}
      Email Date: ${email.date}
      Email Body:
      ${email.body}`;

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: inputText }] }
            ]
        });
        const rawOutput = result.response.text();
        const cleanedOutput = cleanAIJson(rawOutput)

        return JSON.parse(cleanedOutput);
    } catch (error) {
        console.error("Gemini returned invalid JSON: ", error);
        return null;
    }
}

