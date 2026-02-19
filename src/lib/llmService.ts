import { LLMExplanation } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
// Using 1.5-flash for better speed and rate limits on free tier
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export const generateExplanation = async (drug: string, gene: string, risk: string): Promise<LLMExplanation> => {
    try {
        if (!API_KEY) {
            console.warn("Gemini API Key is missing. Returning mock data.");
            throw new Error("API Key missing");
        }

        const prompt = `
        You are a helpful clinical pharmacogenomics assistant.
        Your goal is to explain complex genetic drug interactions to a patient in simple, easy-to-understand language.

        Task: Analyze the interaction between the drug "${drug}" and the gene "${gene}" given the risk assessment: "${risk}".
        
        Output Requirements:
        1. **Summary**: Write 2-3 simple sentences explaining what this means for the patient. Avoid overly technical jargon.
        2. **Mechanism**: Briefly explain *why* this happens (e.g., "My body breaks this drug down too slowly").
        3. **Citations**: List 1-2 trusted sources.

        Response Format (Strict JSON Only):
        {
            "summary": "Your generic breakdown is dangerous for this drug. It might build up in your system.",
            "mechanism_of_action": "The CYP2D6 enzyme in your liver is not working well, so the drug stays in your body longer.",
            "citations": ["CPIC Guidelines", "FDA Label"]
        }

        Do not generate markdown code blocks. Just the raw JSON string.
        `;

        const runWithRetry = async (retries = 5, delay = 2000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await model.generateContent(prompt);
                } catch (err: any) {
                    const isOverloaded = err.message?.includes("503") || err.status === 503;
                    const isRateLimited = err.message?.includes("429") || err.status === 429;

                    if (isOverloaded || isRateLimited) {
                        console.warn(`Model busy (${err.status}). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
                        await new Promise(r => setTimeout(r, delay));
                        delay *= 1.5; // Exponential backoff
                        continue;
                    }
                    throw err;
                }
            }
            // Fallback to a secondary model if the primary one is consistently overloaded
            console.warn("Primary model overloaded. Attempting fallback to gemini-2.0-flash...");
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            return await fallbackModel.generateContent(prompt);
        };

        const result = await runWithRetry();
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present (Gemini sometimes adds them despite instructions)
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(cleanedText);

        return {
            summary: parsed.summary || `Analysis for ${drug} and ${gene} completed.`,
            mechanism_of_action: parsed.mechanism_of_action || "Mechanism details unavailable.",
            citations: parsed.citations || ["PharmGKB"]
        };

    } catch (error: any) {
        console.error("LLM Generation Failed:", error);

        let errorMessage = "Unknown error";
        if (error instanceof Error) errorMessage = error.message;
        if (typeof error === "string") errorMessage = error;

        // Fallback to mock data on error to prevent app crash, BUT include the error for debugging
        return {
            summary: `AI Analysis Failed: ${errorMessage}. Genetic analysis of ${gene} indicates ${risk} status for ${drug}.`,
            mechanism_of_action: "AI connectivity issue. Please verify API Key and Network.",
            citations: ["System Error"]
        };
    }
};
