# Playsonic - AI-Powered Analytics Dashboard

Playsonic is an advanced data analytics dashboard that leverages Generative AI to transform raw CSV/Excel data into actionable strategic insights, visualizations, and predictions. Built with Next.js 16 and Groq AI (Llama 3.3).

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Functional Requirements](#functional-requirements)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## 🔭 Project Overview
This project serves as an intelligent business intelligence tool. Users upload raw datasets (Sales, HR, Marketing, etc.), and the system automatically:
1.  **Analyzes** the data structure to infer the domain.
2.  **Calculates** key high-level metrics.
3.  **Visualizes** trends and distributions using dynamic charts.
4.  **Generates** strategic insights and actionable recommendations.
5.  **Predicts** future trends based on historical data points.

## ✨ Key Features

### 1. Intelligent Data Ingestion
-   **Multi-format Support**: Drag-and-drop support for `.xlsx`, `.xls`, and `.csv` files.
-   **Smart Parsing**: Automatically detects headers and data types using `xlsx`.
-   **Sampling**: Efficiently samples data (top 15 rows) to minimize token usage while maintaining analysis accuracy.

### 2. AI-Driven Analysis
-   **Context Awareness**: Identifies if data is Sales, HR, or Marketing related without manual input.
-   **Hallucination Prevention**: Strict validation ensures charts (like Line/Area charts) are only generated if time-series data (Date/Year/Time columns) exists.
-   **Dyna-Prompting**: Uses sophisticated prompt engineering to enforce strict JSON schemas for consistent UI rendering.

### 3. Interactive Dashboard
-   **Key Metrics Display**: High-level KPIs with calculated values and descriptions.
-   **Dynamic Visualizations**: Automatically selects appropriate chart types:
    -   *Bar Charts* for categorical distributions.
    -   *Pie Charts* for composition.
    -   *Line/Area Charts* for time-series trends.
    -   *Scatter Plots* for correlations.
-   **Strategic Insights**: AI-generated text explaining "Why this matters."
-   **Recommendations**: Actionable steps categorized by impact (High/Medium/Low).
-   **Predictions**: Forward-looking forecasts with confidence levels.

### 4. Refinement System
-   **Additive/Edit Mode**: Users can chat with the dashboard to:
    -   "Remove the demographic chart."
    -   "Add a metric for Average Order Value."
    -   "Replace the pie chart with a bar chart."
-   The system intelligently updates *only* the requested parts of the state.

### 5. Persistence & Export
-   **Auto-Save**: Dashboard state persists in `localStorage`.
-   **PDF/Print Export**: Built-in capability to export the analysis for reporting.

## 🛠 Tech Stack

### Frontend
-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **UI Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Charting**: Recharts

### Backend & AI
-   **API Runtime**: Next.js Server Routes (Node.js)
-   **AI Operations**: Groq SDK
-   **Models**:
    -   Primary: `llama-3.3-70b-versatile` (Complex logic)
    -   Fallback: `llama-3.1-8b-instant` (Speed/Redundancy)
-   **File Processing**: `xlsx` (SheetJS)

## 📋 Functional Requirements

### User Capabilities
1.  **Upload Data**: User shall be able to upload a valid Excel or CSV file.
2.  **View Analysis**: User shall see a generated dashboard within 60 seconds.
3.  **Refine Results**: User shall be able to textual prompts to modify the dashboard.
4.  **Reset**: User shall be able to clear data and start over.
5.  **Export**: User shall be able to print or save the dashboard view.

### System Behaviors
1.  **Validation**: System must reject files without sheets or empty files.
2.  **Error Handling**: System must gracefully handle API timeouts (60s limit) or AI service failures.
3.  **Schema Enforcement**: System must ensure AI output strictly adheres to `DashboardData` type.

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+ installed.
-   A Groq API Key (or Gemini API Key as backup).

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd grad-project-karam
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration
1.  Create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=gsk_your_groq_api_key_here
    # Optional fallback
    GEMINI_API_KEY=your_gemini_key_here
    ```

### Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
├── app/
│   ├── api/analyze/route.ts  # Main AI processing logic
│   ├── page.tsx              # Main dashboard controller
│   ├── layout.tsx            # Global layout wrapper
│   └── globals.css           # Global styles
├── components/
│   ├── DashboardView.tsx     # Main dashboard presentation
│   ├── AnalysisSections.tsx  # Insights, Recommendations, Predictions
│   ├── ChartComponents.tsx   # Recharts wrappers
│   └── FileUploader.tsx      # Drag & Drop input
├── types/
│   └── dashboard.ts          # TypeScript interfaces for API response
├── data/                     # Mock data (if any)
└── lib/                      # Utility functions
```

## 📡 API Documentation

### POST `/api/analyze`
Analyzes an uploaded file and returns a JSON dashboard structure.

**Request:**
-   `Multipart/Form-Data`
-   `file`: The binary file (Excel/CSV).
-   `customPrompt` (Optional): String for refinement instructions.

**Response (JSON):**
```json
{
  "analysisTitle": "Sales Performance Q3",
  "keyMetrics": [...],
  "dynamicCharts": [...],
  "keyInsights": [...],
  "recommendations": [...]
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|Str|Str|
| **Analysis Fails / Timeout** | The dataset might be too large or the AI service is busy. Retry the request. |
| **Charts Missing** | The AI determined your data lacks the specific columns (e.g., Dates) needed for that chart type. |
| **API Key Error** | Ensure `GROQ_API_KEY` is set in `.env.local` and you have restarted the server. |
