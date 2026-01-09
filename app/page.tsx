'use client';

import { useState, useEffect } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { DashboardView } from '@/components/DashboardView';
import { DashboardData } from '@/types/dashboard';
import { PageHeader, PageFooter } from '@/components/LayoutComponents';
import { User, Building2, Zap, XCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  /* Persistence Logic */
  useEffect(() => {
    const savedData = localStorage.getItem('karam_dashboard_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load saved dashboard", e);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('karam_dashboard_data', JSON.stringify(data));
    }
  }, [data]);

  const handleUpload = async (file: File, prompt?: string) => {
    setIsAnalyzing(true);
    setCurrentFile(file);
    
    // Create an abort controller for timeout (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (prompt) {
        formData.append('customPrompt', prompt);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Analysis failed');
      }

      const result = await response.json();
      // Mark initial items as NOT new to prevent badges on first load
      const cleanResult = {
         ...result,
         keyMetrics: result.keyMetrics?.map((m: any) => ({...m, isNew: false})) || [],
         dynamicCharts: result.dynamicCharts?.map((c: any) => ({...c, isNew: false})) || [],
         keyInsights: result.keyInsights?.map((i: any) => ({...i, isNew: false})) || [],
         recommendations: result.recommendations?.map((r: any) => ({...r, isNew: false})) || []
      };

      setData(cleanResult);
    } catch (error: any) {
      console.error('Error analyzing file:', error);
      if (error.name === 'AbortError') {
         alert('Request timed out. The file might be too large or the AI service is busy. Please try again.');
      } else {
         alert(error.message || 'Failed to analyze the file.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);

  /* Persistence Logic */
// ... existing imports ...

// ... inside Home component ...

  const handleRefine = async (refinePrompt: string) => {
    if (!currentFile) return;
    setIsRefining(true);
    
    try {
      // Gather current state context to help AI identify what to remove/replace
      const currentContext = {
        metrics: data?.keyMetrics.map(m => m.label).join(", "),
        charts: data?.dynamicCharts.map(c => c.title).join(", "),
        insights: data?.keyInsights.map(i => i.title).join(", "),
        recommendations: data?.recommendations.map(r => r.title).join(", ")
      };

      const formData = new FormData();
      formData.append('file', currentFile);
      // Append instruction to be additive AND context
      formData.append('customPrompt', `(ADDITIVE REQUEST): ${refinePrompt}. 
      Generate ONLY the new requested metrics/charts/insights to append to the existing dashboard. 
      Do not regenerate existing data unless replacing.
      
      CURRENT DASHBOARD ITEMS (DO NOT DUPLICATE THESE):
      - Metrics: ${currentContext.metrics}
      - Charts: ${currentContext.charts}
      - Insights: ${currentContext.insights}
      - Recommendations: ${currentContext.recommendations}

      STRICT NO DUPLICATES RULE: Check the "Charts" list above. If a requested chart matches an existing title, DO NOT generate it again. Choose a different metric or title.
      `);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Refinement failed');
      }

      const newResult = await response.json();
      
      // Mark new items and SCRUB chart data to ensure numbers
      const markNew = (items: any[]) => items.map(item => ({ ...item, isNew: true }));
      const scrubCharts = (charts: any[]) => charts.map((chart: any) => ({
        ...chart,
        isNew: true,
        chartType: chart.chartType?.toLowerCase(), // Enforce lowercase
        data: chart.data.map((d: any) => ({
          ...d,
          value: typeof d.value === 'string' ? parseFloat(d.value.replace(/[^0-9.-]/g, '')) : d.value
        }))
      }));

      const newItemSet = {
        keyMetrics: markNew(newResult.keyMetrics || []),
        dynamicCharts: scrubCharts(newResult.dynamicCharts || []),
        keyInsights: markNew(newResult.keyInsights || []),
        recommendations: markNew(newResult.recommendations || [])
      };

      // Process Removals
      const removals = newResult.removals || [];

      setData((prevData) => {
        if (!prevData) return newResult;

        // Helper to filter out removed items
        const filterRemoved = (items: any[], type: string, key: string) => {
          const removedTitles = new Set(
            removals.filter((r: any) => r.type === type).map((r: any) => r.title)
          );
          return items.filter(item => !removedTitles.has(item[key]));
        };

        // Filter valid previous data (excluding removals)
        const prevMetrics = filterRemoved(prevData.keyMetrics, 'metric', 'label');
        const prevCharts = filterRemoved(prevData.dynamicCharts, 'chart', 'title');
        const prevInsights = filterRemoved(prevData.keyInsights, 'insight', 'title');
        const prevRecs = filterRemoved(prevData.recommendations, 'recommendation', 'title');

        // Helper to remove duplicates based on a key (merging filtered prev + new)
        const mergeUnique = (prev: any[], next: any[], key: string) => {
          const existingKeys = new Set(prev.map(item => item[key]));
          return [...prev, ...next.filter(item => !existingKeys.has(item[key]))];
        };

        return {
          ...prevData,
          keyMetrics: mergeUnique(prevMetrics, newItemSet.keyMetrics, 'label'),
          dynamicCharts: mergeUnique(prevCharts, newItemSet.dynamicCharts, 'title'), 
          keyInsights: mergeUnique(prevInsights, newItemSet.keyInsights, 'title'),
          recommendations: mergeUnique(prevRecs, newItemSet.recommendations, 'title'),
          
          analysisTitle: prevData.analysisTitle, 
          analysisDescription: prevData.analysisDescription
        };
      });
      
      // Trigger Success Animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3s

    } catch (error: any) {
      console.error('Refinement error:', error);
      alert('Failed to refine analysis: ' + error.message);
    } finally {
      setIsRefining(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setCurrentFile(null);
    localStorage.removeItem('karam_dashboard_data');
  };

  const handleSessionRestore = (file: File) => {
    setCurrentFile(file);
  };

  if (isAnalyzing) {
    return <SkeletonLoader />;
  }

  if (data) {
    return (
      <DashboardView 
        data={data} 
        onReset={handleReset} 
        onRefine={handleRefine} 
        isRefining={isRefining} 
        isSessionActive={!!currentFile}
        onSessionRestore={handleSessionRestore}
        showSuccess={showSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black overflow-hidden selection:bg-blue-500/30">
      
      {/* Dynamic Aurora Background */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
         {/* Aurora Beams */}
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[500px] bg-slate-800/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
         
         {/* Subtle Grain Overlay */}
         <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05]"></div>
         
         {/* Grid Pattern (Subtle) */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <PageHeader />
        
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-5xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">
            
            {/* Ambient Glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full -z-10"></div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs font-medium text-blue-300 mb-8 backdrop-blur-md animate-in fade-in zoom-in duration-700">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Powered by AI
            </div>

            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-blue-200 tracking-tighter drop-shadow-2xl leading-none">
              <span className="text-[#F2C811] drop-shadow-md">Power BI?</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">More like Power bye.</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed tracking-tight font-light">
              Stop dragging and dropping. <strong>Power BI is dead.</strong>
              Get instant, AI-powered intelligence without the headache.
            </p>
            
          </div>
          
          {/* Value Props Grid - Moved to Top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12 px-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
               {/* User Benefit */}
               <div className="bg-[#0c111c]/80 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-blue-500/30 transition-all group hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                     <User className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Instant Analyst</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                     Get advanced insights without writing a single formula. Upload your file and let the AI interpret hidden patterns specifically for you.
                  </p>
               </div>

               {/* Business Benefit */}
               <div className="bg-[#0c111c]/80 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-emerald-500/30 transition-all group hover:-translate-y-1">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                     <Building2 className="text-emerald-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Maximize ROI</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                     Cut manual reporting time by 90%. Turn raw operational data into strategic decisions instantly, reducing analytics overhead significantly.
                  </p>
               </div>

               {/* Competitive Edge (vs Power BI) */}
               <div className="bg-[#0c111c]/80 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-orange-500/30 transition-all group hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors"></div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <Zap className="text-orange-400" size={24} fill="currentColor" />
                     Why not Power BI?
                  </h3>
                  
                  <div className="space-y-3">
                     <div className="flex items-center justify-between group/item">
                        <span className="text-xs text-slate-500 font-medium">Power BI</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-red-400 line-through decoration-red-500/50">Manual</span>
                           <XCircle size={14} className="text-red-500"/>
                        </div>
                     </div>
                     <div className="flex items-center justify-between group/item">
                        <span className="text-xs text-slate-500 font-medium">Power BI</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-red-400 line-through decoration-red-500/50">Static</span>
                           <XCircle size={14} className="text-red-500"/>
                        </div>
                     </div>
                     <div className="h-px bg-white/5 my-3"></div>
                     <div className="flex items-center justify-between">
                         <span className="text-sm text-emerald-400 font-bold">Karam A+</span>
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-white">Auto-Generated</span>
                            <CheckCircle2 size={16} className="text-emerald-500"/>
                         </div>
                     </div>
                  </div>
               </div>
            </div>

          <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl rounded-3xl p-2 border border-white/10 shadow-2xl shadow-blue-900/20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
             <FileUploader onUpload={handleUpload} isAnalyzing={isAnalyzing} />
          </div>


        </main>
        
        <PageFooter />
      </div>
    </div>
  );
}
