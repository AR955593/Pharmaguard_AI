const OpenAI = require("openai");

const START_KEY = "sk-proj-fDT48Q6RkOGkMdSKJs5kYWSG2RJwY1d1"; // First part
const END_KEY = "70Rfqs0gLoQu75KjCdiXjNK6GFnoyMjK6BHmzen_wT3BlbkFJJ0gCMg0Fx5VKHUSuBAr4fRmiv7MUK8IgW42jjT-Fo3_FbsOIIHkfpLfwrE1Po8N8V1FsGZmFMA"; // Second part
const API_KEY = START_KEY + "-" + END_KEY;

const openai = new OpenAI({
    apiKey: API_KEY,
});

async function main() {
    console.log("Testing OpenAI Key...");
    try {
        const list = await openai.models.list();
        console.log("Models list retrieved successfully.");

        // Check for gpt-4o or gpt-3.5-turbo
        const models = list.data.map(m => m.id);
        const hasGPT4o = models.includes("gpt-4o");
        const hasGPT35 = models.includes("gpt-3.5-turbo");

        console.log(`Has GPT-4o: ${hasGPT4o}`);
        console.log(`Has GPT-3.5-Turbo: ${hasGPT35}`);

        const modelToUse = hasGPT4o ? "gpt-4o" : "gpt-3.5-turbo";
        console.log(`Testing generation with ${modelToUse}...`);

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say hello." }],
            model: modelToUse,
        });

        console.log("Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI Error:", error.message);
    }
}

main();
