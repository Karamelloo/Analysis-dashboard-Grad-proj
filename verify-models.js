const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("----------------------------------------");
  console.log("Starting Model Verification");
  console.log("----------------------------------------");

  // Load API Key
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    try {
      const envPath = path.resolve(__dirname, '.env.local');
      if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        const match = envFile.match(/GEMINI_API_KEY=(.*)/);
        if (match) {
          apiKey = match[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch (e) {
      console.log("Error reading .env.local:", e.message);
    }
  }

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY not found.");
    return;
  }
  
  // Mask key for logging
  console.log(`API Key found: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);

  const genAI = new GoogleGenerativeAI(apiKey);

  // List of models to try in order of preference/stability
  const models = [
    "gemini-1.5-flash",
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-1.0-pro"
  ];

  for (const modelName of models) {
    console.log(`\nTesting: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Use a simple prompt intended to be cheap
      const result = await model.generateContent("Hi");
      const response = await result.response;
      console.log(`✅ SUCCESS: ${modelName} is available.`);
      fs.appendFileSync('verification_results.txt', `SUCCESS: ${modelName}\n`);
      
      // If we find a working one, we highly recommend using it.
      // We continue to see if others work too.
    } catch (error) {
      let status = "Unknown Error";
      if (error.message.includes('404')) status = "404 Not Found (Invalid Model Name)";
      else if (error.message.includes('429')) status = "429 Quota Exceeded (Valid Model, but rate limited)";
      else if (error.message.includes('403')) status = "403 Forbidden (Key/Location issue)";
      else if (error.message.includes('503')) status = "503 Service Unavailable";
      
      fs.appendFileSync('verification_results.txt', `FAILED: ${modelName} - ${status}\n`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();
