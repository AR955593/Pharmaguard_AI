const https = require('https');

const API_KEY = "AIzaSyD4yRMLDz5vd62szS45O_fsdSJOcypIqG0";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log("Status Code:", res.statusCode);
            if (parsed.models) {
                console.log("Available Models:");
                parsed.models.forEach(m => console.log("- " + m.name));
            } else {
                console.log("Error Response:", JSON.stringify(parsed, null, 2));
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (err) => {
    console.error("Request Error:", err);
});
