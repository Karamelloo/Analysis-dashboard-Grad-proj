const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx'); // Make sure to use the project's installed xlsx

async function main() {
  console.log("----------------------------------------");
  console.log("Starting Deep Verification (Mocking Route)");
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

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = 'gemini-1.5-flash';
  // Attempt to match route config exactly
  const model = genAI.getGenerativeModel({ model: modelName });

  // Read the actual file to generate the HUGE prompt
  const filePath = path.join(__dirname, 'Playsonic useres final.xlsx');
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' }); // 'buffer' for node fs
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet).slice(0, 5); 
  const dataString = JSON.stringify(jsonData);

  const prompt = "Hi";
  
  console.log(`Sending prompt of length: ${prompt.length} chars to ${modelName}...`);

  try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(`✅ SUCCESS! Response received.`);
      console.log(response.text().substring(0, 200) + "...");
  } catch (error) {
      console.log(`❌ FAILED.`);
      console.log(`   Error: ${error.message}`);
      // console.log(JSON.stringify(error, null, 2));
  }
}

main();
