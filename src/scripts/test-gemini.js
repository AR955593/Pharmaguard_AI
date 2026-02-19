const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBWIvI3Jf18OSmm7iUnB3itUgnENV3guQY";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but let's try to just generate content with a fallback to see if we get a different error 
        // or if we can find a working one.

        // Actually, the error message itself suggests: "Call ListModels to see the list..."
        // The node SDK doesn't always expose listModels directly on the main class easily without browsing docs.
        // Let's try to hit the REST API directly to list models if the SDK fails.

        console.log("Testing gemini-1.5-flash...");
        const result1 = await model.generateContent("Hello");
        console.log("gemini-1.5-flash worked!");
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }

    try {
        console.log("Testing gemini-pro...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("Hello");
        console.log("gemini-pro worked!");
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }
}

listModels();
