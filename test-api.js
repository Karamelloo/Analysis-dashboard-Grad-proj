const fs = require('fs');
const path = require('path');

// We need 'form-data' and 'node-fetch' (or built-in fetch in newer node)
// Since we might not have them installed, we'll try to use built-in fetch (Node 18+)
// and construct the body manually or use a simple boundary strategy.

const filePath = path.join(__dirname, 'Playsonic useres final.xlsx');
const fileStats = fs.statSync(filePath);
const fileName = path.basename(filePath);

async function testUpload() {
  console.log(`Testing upload with file: ${fileName} (${fileStats.size} bytes)`);

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  // Construct a multipart/form-data body manually because we want to avoid external deps if possible
  // or use the 'formData' built-in if available (Node 18+ has FormData but it's a bit tricky with fs streams sometimes)
  
  // Let's try the modern way first
  try {
    const { FormData } = require('undici'); // Next.js usually has undici globally or available, but let's stick to Node native if possible
  } catch (e) {}

  // Using native fetch and FormData (Node 18+)
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]); 
    const formData = new FormData();
    formData.append('file', blob, fileName);

    console.log("Sending POST request to http://localhost:3000/api/analyze...");
    
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData,
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log("\n✅ SUCCESS! API returned valid JSON.");
      console.log("---------------------------------------------------");
      console.log("Record Count:", data.recordCount);
      console.log("Key Findings:", data.keyFindings?.length || 0);
      console.log("Key Metric 1:", data.keyMetrics?.[0]?.label, "=", data.keyMetrics?.[0]?.value);
      console.log("---------------------------------------------------");
    } else {
      const text = await response.text();
      console.log("\n❌ FAILED.");
      console.log("Error Body:", text);
    }

  } catch (error) {
    console.error("Script Execution Error:", error);
  }
}

testUpload();
