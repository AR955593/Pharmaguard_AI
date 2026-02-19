const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyD4yRMLDz5vd62szS45O_fsdSJOcypIqG0";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGen() {
    try {
        console.log("Testing generation with gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Explain pharmacogenomics in one sentence.");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("Generation Failed:", error.message);
    }
}

testGen();
