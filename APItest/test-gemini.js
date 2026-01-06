const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testModel(modelName) {
  let apiKey = process.env.GEMINI_API_KEY;
  
  // Fallback: Try to read from parent .env.local if not found
  if (!apiKey) {
      const fs = require('fs');
      const path = require('path');
      try {
        const parentEnvPath = path.resolve(__dirname, '../.env.local');
        if (fs.existsSync(parentEnvPath)) {
            const content = fs.readFileSync(parentEnvPath, 'utf8');
            const match = content.match(/GEMINI_API_KEY=(.*)/);
            if (match) apiKey = match[1].trim();
        }
      } catch (e) {}
  }

  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is missing. Please create a .env file.");
    return;
  }

  console.log(`\nTesting Model: ${modelName} ...`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent("Hello! Are you working?");
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS!`);
    console.log(`   Response: ${text.trim()}`);
  } catch (error) {
    console.log(`❌ FAILED.`);
    
    if (error.message.includes('404')) {
        console.log("   Reason: 404 Not Found. (Model not enabled, wrong region, or key invalid for this model)");
    } else if (error.message.includes('429') || error.message.includes('Quota')) {
        console.log("   Reason: 429 Quota Exceeded. (You have access, but hit the Free Tier rate limit)");
    } else {
        console.log(`   Error: ${error.message}`);
    }
  }
}

async function main() {
    console.log("=== GEMINI API CONNECTION TEST ===");
    console.log("Reading API Key from .env...");
    
    // Test the standard model (Should work for everyone)
    await testModel("gemini-1.5-flash");

    // Test the experimental model (Often restricted)
    await testModel("gemini-2.0-flash-exp");
    
    console.log("\n==================================");
}

main();
