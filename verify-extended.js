const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("----------------------------------------");
  console.log("Extended Model Verification");
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
  
  const genAI = new GoogleGenerativeAI(apiKey);

  const configs = [
    { model: "gemini-1.5-flash", version: undefined }, // Default (v1beta)
    { model: "models/gemini-1.5-flash", version: undefined },
    { model: "gemini-1.5-flash-latest", version: undefined },
    { model: "gemini-1.5-flash", version: "v1" },
    { model: "gemini-1.5-flash-001", version: "v1beta" },
    { model: "gemini-1.5-flash-002", version: "v1beta" },
    { model: "gemini-1.5-flash-8b", version: "v1beta" },
    { model: "gemini-pro", version: undefined },
    { model: "gemini-1.5-pro", version: "v1beta" },
  ];

  fs.writeFileSync('extended_results.txt', '');

  for (const config of configs) {
    const versionLabel = config.version || 'default(v1beta)';
    console.log(`Testing: ${config.model} [${versionLabel}]`);
    
    try {
      const modelOptions = config.version ? { apiVersion: config.version } : undefined;
      const model = genAI.getGenerativeModel({ model: config.model }, modelOptions);
      
      const result = await model.generateContent("Hi");
      const response = await result.response;
      const responseText = response.text();
      
      console.log(`✅ SUCCESS: ${config.model}`);
      fs.appendFileSync('extended_results.txt', `SUCCESS: ${config.model} [${versionLabel}]\n`);
    } catch (error) {
      let status = "Unknown";
      if (error.message.includes('404')) status = "404 Not Found";
      else if (error.message.includes('429')) status = "429 Quota";
      else if (error.message.includes('403')) status = "403 Forbidden";
      else if (error.message.includes('500')) status = "500 Server Error";
      else status = error.message.split('\n')[0];

      console.log(`❌ FAILED: ${config.model} - ${status}`);
      fs.appendFileSync('extended_results.txt', `FAILED: ${config.model} [${versionLabel}] - ${status}\n`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();
