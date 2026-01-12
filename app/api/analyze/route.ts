import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import * as XLSX from 'xlsx';
import { DashboardData } from '@/types/dashboard';

// Helper function to remove duplicate rows
function removeDuplicates(data: any[]): { cleanData: any[], duplicatesRemoved: number } {
  if (!data || data.length === 0) {
    return { cleanData: data, duplicatesRemoved: 0 };
  }

  const seen = new Set<string>();
  const cleanData: any[] = [];

  for (const row of data) {
    // Create a unique key from all values in the row
    const rowKey = JSON.stringify(
      Object.keys(row)
        .sort() // Sort keys to ensure consistent comparison
        .map(key => row[key])
    );

    if (!seen.has(rowKey)) {
      seen.add(rowKey);
      cleanData.push(row);
    }
  }

  const duplicatesRemoved = data.length - cleanData.length;
  return { cleanData, duplicatesRemoved };
}

// Initialize Groq
const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
const groq = new Groq({
  apiKey: apiKey,
});

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY (or GEMINI_API_KEY) is not set.' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const customPrompt = formData.get('customPrompt') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Parse Excel/CSV to JSON string
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    if (!workbook.SheetNames.length) {
      return NextResponse.json({ error: 'The uploaded file contains no sheets.' }, { status: 400 });
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);
    
    // Remove duplicates from the entire dataset
    const { cleanData: allData, duplicatesRemoved } = removeDuplicates(rawData);
    
    // Log duplicate removal statistics
    console.log(`Data cleaning: ${duplicatesRemoved} duplicate rows removed from ${rawData.length} total rows`);
    
    // Send a sample of data to the AI (ensure it's enough to infer context)
    // Reduce sample size to 15 to save tokens and avoid rate limits
    const promptData = allData.slice(0, 15); 
    const dataString = JSON.stringify(promptData);

    // 2. Prepare Detailed Prompt
    // 2. Prepare Detailed Prompt
    const isAdditive = customPrompt?.includes('(ADDITIVE REQUEST)');
    
    let objectivesSection = '';
    if (isAdditive) {
       objectivesSection = `
       OBJECTIVES (REFIMEMENT MODE - STRICT):
       1. **EXECUTE USER REQUEST ONLY**: You are updating an existing dashboard. You must ONLY generate what the user specifically asked for.
       2. **REMOVALS & REPLACEMENTS**: 
          - If the user asks to **REMOVE** an item, add its exact Title/Label to the "removals" list.
          - If the user asks to **REPLACE** an item, add the OLD item's Title to "removals" and generate the NEW item.
       3. **ZERO UNREQUESTED CONTENT**: 
          - Metrics? Only if asked.
          - Charts? Only if asked.
          - Insights? Only if asked.
          - Recommendations? Only if asked.
          - Predictions? Only if asked.
       4. **PRESERVE CONTEXT**: Use the provided sample data to generate the *requested* items accurately.
       `;
    } else {
       objectivesSection = `
       OBJECTIVES:
       1. **Infer Domain**: Figure out what this data represents.
       2. **Key Metrics**: Calculate 4 vital high-level metrics.
          - Include 'explanation': Briefly explain HOW this number was calculated (e.g. "Count of unique UserIDs in column A").
       3. **Dynamic Visualization**: Design 4-6 charts.
          - **VERIFY**: Check the keys. Do you see "Date", "Year", "Time", "Month"? 
          - **YES**: Use Line/Area charts for trends.
          - **NO**: DO NOT USE LINE/AREA CHARTS. Use Bar (distribution), Pie (composition), or Scatter (relationship).
       4. **Deep Strategic Insights**: Provide 5-6 comprehensive insights.
          - Contextualize "Why this matters".
       5. **Future Predictions**: Generate 3-4 forward-looking predictions based on the trends.
          - Suggest "Sales Q4", "Growth Rate", "Risk Probability".
          - Assign a confidence level (high/medium/low).
       6. **Actionable Recommendations**: Suggest 5-6 concrete actions.
       `;
    }

    let schemaSection = '';
    if (isAdditive) {
       schemaSection = `
       OUTPUT SCHEMA (Strict JSON - ADDITIVE MODE):
       (Only populate arrays if specifically requested. Otherwise return empty [].)
       {
         "analysisTitle": "String (Keep existing)",
         "analysisDescription": "String (Keep existing)",
         "keyMetrics": [ /* ADD ONLY IF REQUESTED, else [] */
           { "label": "String", "value": "String", "description": "String", "icon": "String", "variant": "default" }
         ],
         "dynamicCharts": [ /* ADD ONLY IF REQUESTED, else [] */
           {
             "id": "String",
             "title": "String",
             "description": "String",
             "chartType": "String",
             "data": [ { "name": "String", "value": Number, "x": "Number (Optional, for Scatter)", "y": "Number (Optional, for Scatter)" } ] 
           }
         ],
         "keyInsights": [ /* ADD ONLY IF REQUESTED, else [] */
           { "title": "String", "severity": "String", "description": "String" }
         ],
         "recommendations": [ /* ADD ONLY IF REQUESTED, else [] */
            { "title": "String", "action": "String", "impact": "String" }
         ],
         "predictions": [ /* ADD ONLY IF REQUESTED, else [] */
            { "title": "String", "predictedValue": "String", "trend": "up|down|stable", "confidence": "high|medium|low", "reasoning": "String" }
         ],
         "removals": [
           { "type": "String (metric, chart, insight, recommendation)", "title": "String" }
         ]
       }`;
    } else {
       schemaSection = `
       OUTPUT SCHEMA (Strict JSON - FULL ANALYSIS):
       {
         "analysisTitle": "String (Professional, Non-Redundant)",
         "analysisDescription": "String (Executive Summary)",
         "keyMetrics": [
           { "label": "String", "value": "String", "description": "String", "explanation": "String (Calculation Method)", "icon": "String (One of: Users, TrendingUp, DollarSign, Activity, BarChart, PieChart, AlertCircle, CheckCircle, Zap, Target)", "variant": "default" }
         ],
         "dynamicCharts": [
           {
             "id": "String (unique)",
             "title": "String",
             "description": "String",
             "explanation": "String (Data Source/Logic)",
             "chartType": "String (One of: 'bar', 'pie', 'line', 'area', 'scatter')",
             "data": [ { "name": "String", "value": "Number", "x": "Number (Optional, for Scatter)", "y": "Number (Optional, for Scatter)" } ] 
           }
         ],
         "keyInsights": [
           { "title": "String", "severity": "String (positive, warning, info)", "description": "String (Include 'Why this matters')" }
         ],
         "recommendations": [
           { "title": "String", "action": "String", "impact": "String (high, medium, low)" }
         ],
         "predictions": [
            { "title": "String (e.g. Q4 Sales Forecast)", "predictedValue": "String (e.g. $1.2M)", "trend": "up|down|stable", "confidence": "high|medium|low", "reasoning": "String (Why?)", "explanation": "String (Model/Calculation Method used)" }
         ],
         "removals": []
       }`;
    }

    const prompt = `
      You are a Senior Strategic Consultant.
      Your goal is to analyze the provided dataset SAMPLE **accurately**, based ONLY on the data fields present.
      
      ${customPrompt ? `\nUSER SPECIAL INSTRUCTIONS: ${customPrompt}\n(IMPORTANT: Prioritize these instructions over default behavior.)\n` : ''}

      DATASET CONTEXT:
      - Total Records: ${allData.length}
      - Duplicates Removed: ${duplicatesRemoved}
      - Columns/Keys: ${Object.keys(promptData[0] || {}).join(", ")} <--- ONLY USE THESE FIELDS.
      
      SAMPLE DATA (First 15 rows):
      ${dataString}

      CRITICAL RULES (STRICT ADHERENCE REQUIRED):
      1. **NO HALLUCINATIONS**: Do NOT invent columns. If there is no 'Date' or 'Time' column in the keys below, YOU MUST NOT create Line or Area charts. Use Bar charts for categories or Scatter plots for correlations instead. THIS IS A HARD RULE.
      2. **TITLE QUALITY**: Generate a clean, professional title. Do NOT repeat words.
      3. **DATA GROUNDING**: Every metric and chart MUST be derivable from the provided sample keys.
      4. **ADDITIVE REQUESTS**: If this is an additive request, DO NOT re-generate standard analysis sections unless explicitly asked.

      ${objectivesSection}

      ${schemaSection}
    `;

    // 3. Generate Content using Groq with Fallback
    let chatCompletion;
    try {
        // Try Primary Model (Smartest)
        chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });
    } catch (primaryError: any) {
        console.warn("Primary model failed, attempting fallback...", primaryError.message);
        
        // Check for Rate Limit specifically or just try fallback generally
        // Try Fallback Model (Faster/Cheaper)
        try {
            chatCompletion = await groq.chat.completions.create({
              messages: [{ role: "user", content: prompt }],
              model: "llama-3.1-8b-instant",
              temperature: 0.2,
              max_tokens: 4000,
              response_format: { type: "json_object" },
            });
        } catch (fallbackError: any) {
            // If both fail, throw the original or a combined error
            throw new Error(`AI Service Unavailable. Primary: ${primaryError.message}. Fallback: ${fallbackError.message}`);
        }
    }

    const text = chatCompletion.choices[0]?.message?.content || '{}';

    // 4. Clean and Parse JSON
    let dashboardData: DashboardData;
    let jsonString = text.trim();
    
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      dashboardData = JSON.parse(jsonString);
      // Inject actual record count and duplicates removed
      dashboardData.recordCount = allData.length;
      dashboardData.duplicatesRemoved = duplicatesRemoved;
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json({ 
        error: 'Failed to parse AI response.', 
        rawResponse: text 
      }, { status: 500 });
    }

    return NextResponse.json(dashboardData);

  } catch (error: any) {
    console.error('Analysis failed:', error);
    return NextResponse.json({ 
      error: error.message || 'Analysis failed.',
      details: error.toString()
    }, { status: 500 });
  }
}
