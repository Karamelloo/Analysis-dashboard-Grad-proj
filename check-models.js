const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
  const envPath = path.resolve(__dirname, '.env.local');
  const envFile = fs.readFileSync(envPath, 'utf8');
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
      process.env[key] = value;
    }
  }
} catch (e) {
  console.error("Could not read .env.local", e);
}

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in environment.");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("Fetching available models...");
  
  const modelsToTest = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro", 
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-pro",
    "gemini-2.0-flash-exp"
  ];
  
  for (const modelName of modelsToTest) {
    console.log(`Testing model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, just checking if you work.");
      const response = await result.response;
      console.log(`SUCCESS: ${modelName} works!`);
      // console.log(response.text());
      // We found one, but let's see if others work too to pick the best one (Flash is faster/cheaper)
    } catch (error) {
       // Extract just the status text or message
       let msg = error.message;
       if (msg.includes('404')) msg = '404 Not Found';
       else if (msg.includes('400')) msg = '400 Bad Request';
       else if (msg.includes('403')) msg = '403 Forbidden';
       console.log(`FAILED: ${modelName} - ${msg}`);
    }
  }
}

listModels();
