import { useRef, useState } from 'react';
import { PageFooter } from '@/components/LayoutComponents';
import { HeroSection } from '@/components/HeroSection';
import { StatCard } from '@/components/StatCard';
import { 
  Methodology,
  DynamicAnalysisSection,
  InsightsSection,
  RecommendationsSection
} from '@/components/AnalysisSections';
import { ScrollToTop } from '@/components/ScrollToTop';
import { DashboardData } from '@/types/dashboard';
import { Users, TrendingUp, MapPin, Trophy, Target, Megaphone, BarChart3, Lightbulb, Download, Activity, DollarSign, PieChart, AlertCircle, CheckCircle, Sparkles, X, Upload, Sun, Moon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

// Icon mapping helper
const IconMap: Record<string, any> = {
  Users, TrendingUp, MapPin, Trophy, Target, Megaphone, BarChart3, Lightbulb, Download, Activity, DollarSign, PieChart, AlertCircle, CheckCircle, Zap: Activity, Sparkles 
};

interface DashboardViewProps {
  data: DashboardData;
  onReset: () => void;
  onRefine: (prompt: string) => void;
  isRefining: boolean;
  isSessionActive: boolean;
  onSessionRestore: (file: File) => void;
  showSuccess?: boolean;
}

export function DashboardView({ data, onReset, onRefine, isRefining, isSessionActive, onSessionRestore, showSuccess }: DashboardViewProps) {
  
  const { keyMetrics, dynamicCharts, keyInsights, recommendations, recordCount, analysisTitle, analysisDescription } = data;
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [showRefineDialog, setShowRefineDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [refinePrompt, setRefinePrompt] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitRefine = () => {
    if (!refinePrompt.trim()) return;
    onRefine(refinePrompt);
    setShowRefineDialog(false);
    setRefinePrompt('');
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSessionRestore(e.target.files[0]);
    }
  };

  return (

    <div className={`min-h-screen relative flex flex-col font-sans overflow-hidden selection:bg-indigo-500/30 transition-colors duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`} ref={dashboardRef}>
      
      {/* Backgrounds */}
      {isDarkMode ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob"></div>
          <div className="absolute top-[20%] right-[-20%] w-[600px] h-[600px] bg-blue-900/40 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
      ) : (
         <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50"></div>
      )}

       {/* Success Overlay Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
          <div className={`${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'} backdrop-blur-xl rounded-3xl p-8 shadow-2xl border flex flex-col items-center animate-in zoom-in duration-300`}>
             <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500 ring-1 ring-green-500/50 animate-in zoom-in delay-150 duration-500">
                <CheckCircle size={48} strokeWidth={3} />
             </div>
             <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis Updated</h3>
             <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Your requested changes have been added</p>
          </div>
        </div>
      )}

      {/* Refine Dialog */}
      {showRefineDialog && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`${isDarkMode ? 'bg-gray-900/90 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'} flex justify-between items-center`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {isSessionActive ? (
                  <>
                    <Sparkles className="text-blue-400" size={20} />
                    Ask AI to Refine Analysis
                  </>
                ) : (
                  <>
                    <RefreshCcw className="text-amber-400" size={20} />
                    Restore Session
                  </>
                )}
              </h3>
              <button onClick={() => setShowRefineDialog(false)} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {!isSessionActive ? (
                <div className="text-center py-6">
                  <div className="bg-amber-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-500/30">
                    <AlertCircle className="text-amber-500" size={24} />
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Source File Needed</h4>
                  <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Because the page was refreshed, your file session was reset for security. 
                    <br/>Please <strong>re-select your file</strong> to continue refining.
                  </p>
                  <label className="inline-flex cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors items-center gap-2">
                    <Upload size={18} />
                    Select File to Restore
                    <input type="file" className="hidden" onChange={handleFileRestore} accept=".xlsx,.xls,.csv" />
                  </label>
                </div>
              ) : (
                <>
                  <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add or refine anything to your dashboard!
                  </p>
                  <textarea 
                    className={`w-full border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                    placeholder="Type your request here (e.g. 'Remove the pie chart', 'Add a sales trend')..."
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    autoFocus
                    disabled={isRefining}
                  />
                </>
              )}
            </div>
            
            {isSessionActive && (
              <div className={`p-4 flex justify-end gap-3 rounded-b-2xl border-t ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Button variant="ghost" onClick={() => setShowRefineDialog(false)} disabled={isRefining} className={`${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-200'}`}>Cancel</Button>
                <Button onClick={handleSubmitRefine} className="bg-blue-600 hover:bg-blue-500 text-white gap-2 rounded-full px-6" disabled={isRefining}>
                  {isRefining ? <Activity className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isRefining ? 'Refining...' : 'Update Analysis'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}

      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b px-4 py-3 flex justify-between items-center shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white/80 border-gray-200'}`} data-html2canvas-ignore>
        <div className="flex items-center gap-2">
           <BarChart3 className="text-blue-500 w-6 h-6" />
           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
             {analysisTitle || 'Karam A+ Grad project Analytics'}
           </h1>
        </div>
        
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="outline"
            className={`flex items-center gap-2 border shadow-sm transition-all hover:scale-105 ${isDarkMode ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'border-indigo-600/30 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="font-bold hidden md:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>

          <Button 
            onClick={handlePrint}
            variant="outline" 
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
             <Download className="w-4 h-4" />
             <span className="hidden md:inline">Save PDF</span>
          </Button>
          <Button 
            onClick={onReset}
            variant="outline"
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <RefreshCcw size={16} />
            <span className="hidden md:inline">New Analysis</span>
          </Button>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Dynamic Hero Section */}
        <section className="mb-12 text-center">
            <h2 className={`text-4xl md:text-5xl font-black mb-6 drop-shadow-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{analysisTitle}</h2>
            <p className={`text-xl max-w-2xl mx-auto font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{analysisDescription}</p>
        </section>
        
        {/* Key Metrics */}
        <section className="mb-12 md:mb-16">
          <h3 className={`text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
             <span className="w-1 h-8 bg-blue-500 rounded-full block"></span>
             Key Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => {
              const IconComponent = IconMap[metric.icon] || BarChart3;
              return (
                <StatCard
                  key={index}
                  label={metric.label}
                  value={metric.value}
                  description={metric.description}
                  icon={<IconComponent size={24} />}
                  variant={metric.variant}
                  delay={metric.delay}
                  isNew={metric.isNew}
                  isDarkMode={isDarkMode}
                />
              );
            })}
          </div>
        </section>

        {/* Dynamic & Generic Analysis Sections */}
        <Methodology recordCount={recordCount} isDarkMode={isDarkMode} />

        <InsightsSection insights={keyInsights} isDarkMode={isDarkMode} />

        <DynamicAnalysisSection charts={dynamicCharts} isDarkMode={isDarkMode} />

        <RecommendationsSection recommendations={recommendations} isDarkMode={isDarkMode} />
        
        <PageFooter />
      </main>
      
      {/* Scroll To Top */}
      <ScrollToTop />

      {/* Bottom Floating Refine Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-1000">
        <div className={`${isDarkMode ? 'bg-black/40 border-white/10 shadow-blue-500/10 hover:bg-black/60' : 'bg-white/80 border-blue-200 shadow-blue-900/5 hover:bg-white'} backdrop-blur-2xl border shadow-2xl rounded-full p-2 pl-6 pr-2 flex items-center gap-4 transition-all hover:scale-105`}>
           <div className="flex flex-col">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Want deeper insights?</span>
              <span className="text-xs text-blue-300">Ask the AI to uncover more</span>
           </div>
           <Button 
            onClick={() => setShowRefineDialog(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-blue-500/20"
            disabled={isRefining}
          >
             {isRefining ? <Activity className="animate-spin" size={16} /> : <Sparkles size={16} />}
             {isRefining ? 'Refining...' : 'Refine Analysis'}
          </Button>
        </div>
      </div>

    </div>
  );
}
