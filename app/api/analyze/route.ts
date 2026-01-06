import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import * as XLSX from 'xlsx';
import { DashboardData } from '@/types/dashboard';

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
    const allData = XLSX.utils.sheet_to_json(sheet);
    
    // --- Perform Deterministic Aggregation on Full Dataset ---
    let totalMales = 0;
    let totalFemales = 0;
    const headers = Object.keys(allData[0] || {});
    const genderKey = headers.find(h => /gender|sex/i.test(h)); // Auto-detect column

    if (genderKey) {
      allData.forEach((row: any) => {
        const val = String(row[genderKey] || '').toLowerCase().trim();
        if (val.startsWith('m')) totalMales++;
        else if (val.startsWith('f') || val.startsWith('w')) totalFemales++;
      });
    }
    
    // Fallback if no specific column found (AI will rely on sample, but we inform it)
    const realStats = {
      total: allData.length,
      gender: { Male: totalMales, Female: totalFemales },
    };
    // ---------------------------------------------------------

    const promptData = allData.slice(0, 50); // Send first 50 rows to AI (Safe limit)
    const dataString = JSON.stringify(promptData);

    // 2. Prepare Prompt
    const prompt = `
      You are a data analyst. Analyze the following dataset and generate a comprehensive dashboard report in strictly valid JSON format.
      
      IMPORTANT: I have calculated the REAL statistics for the FULL dataset (${allData.length} rows). You MUST use these for the charts/metrics where applicable, rather than counting the sample rows.
      
      REAL_STATS (Global Truths):
      - Total Records: ${realStats.total}
      - Gender Split: Male: ${realStats.gender.Male}, Female: ${realStats.gender.Female} (Use these EXACT values for genderSplit chart)

      SAMPLE DATA (First 50 rows for context/trends):
      ${dataString}

      OUTPUT SCHEMA (TypeScript Interface):
      interface ChartDataPoint { name: string; value: number; }
      interface DashboardData {
        keyMetrics: { label: string; value: string; description: string; icon: string; variant?: 'default' | 'accent'; delay?: number; }[];
        additionalMetrics: { title: string; value: string; sub: string; className: string; }[];
        
        demographics: { 
          ageDistribution: ChartDataPoint[]; 
          genderSplit: ChartDataPoint[]; 
        };
        engagement: { 
          activityTime: ChartDataPoint[]; // Hour of day (0-24) vs Activity count
          padelRank: ChartDataPoint[]; 
        };
        location: { 
          topRegions: ChartDataPoint[]; 
        };
        
        keyFindings: { title: string; desc: string; }[];
        marketing: {
          targetAudience: { label: string; text: string }[];
          recommendations: { label: string; text: string }[];
          strategies: { icon: string; title: string; desc: string; from: string; to: string }[];
          roi: { value: string; label: string; color: string }[];
        };
        dataQuality: { metric: string; result: string; status: string; }[];
      }

      INSTRUCTIONS:
      1. Analyze the sample data to calculate accurate metrics. Scale totals if necessary or use rates/averages.
      2. For 'keyMetrics', use icons: 'Users', 'TrendingUp', 'Trophy', 'MapPin'.
      3. For 'additionalMetrics', use gradient classNames.
      4. For Charts:
         - 'ageDistribution': Buckets like "18-24", "25-34", etc.
         - 'genderSplit': "Male", "Female", etc.
         - 'activityTime': "18:00", "19:00" etc mapping to activity volume.
         - 'padelRank': Levels like "1.0", "1.5", ... "5.0".
         - 'topRegions': Top 5 cities or regions.
         - Ensure 'value' is a number.
      5. Return ONLY the JSON object. No markdown formatting.
    `;

    // 3. Generate Content using Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Low temperature for consistent JSON
      response_format: { type: "json_object" }, // Enforce JSON response if model supports it (Llama 3 usually does)
    });

    const text = chatCompletion.choices[0]?.message?.content || '{}';

    // 4. Clean and Parse JSON
    let dashboardData: DashboardData;
    let jsonString = text.trim();
    
    // Remove Markdown code blocks if present (Groq/Llama might still add them)
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      dashboardData = JSON.parse(jsonString);
      // Inject actual record count
      dashboardData.recordCount = allData.length;
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
