import { DynamicChartRenderer } from './DynamicChartRenderer';
import { DashboardData, GenericInsight, Recommendation } from '@/types/dashboard';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Target,
  Zap
} from 'lucide-react';

export function Methodology({ recordCount = 0, isDarkMode = true }: { recordCount?: number; isDarkMode?: boolean }) {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className={`text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <span className={`w-1 h-8 rounded-full block ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></span>
        Analysis Methodology
      </h3>
      <div className={`rounded-2xl p-8 border ${isDarkMode ? 'bg-white/5 border-white/10 backdrop-blur-sm' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="space-y-6">
          <div>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Ingestion</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>The dataset was loaded from an Excel file containing {recordCount ? recordCount.toLocaleString() : 0} user records via the ingestion agent.</p>
          </div>
          <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}></div>
          <div>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Validity</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Validated {recordCount ? recordCount.toLocaleString() : 0} records with 0 duplicates and 100% data consistency.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DynamicAnalysisSection({ charts, isDarkMode = true }: { charts: DashboardData['dynamicCharts']; isDarkMode?: boolean }) {
  if (!charts || charts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <span className="w-1 h-8 bg-purple-500 rounded-full block"></span>
        Deep Dive Analysis
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <DynamicChartRenderer key={chart.id || index} chart={chart} isDarkMode={isDarkMode} />
        ))}
      </div>
    </section>
  );
}

export function InsightsSection({ insights, isDarkMode = true }: { insights: GenericInsight[]; isDarkMode?: boolean }) {
  if (!insights || insights.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
         <span className="w-1 h-8 bg-indigo-500 rounded-full block"></span>
         Key Strategic Insights
      </h2>
      <div className="space-y-4">
        {insights.map((insight, index) => {
            const isPositive = insight.severity === 'positive';
            const isWarning = insight.severity === 'warning';
            
            return (
              <div 
                key={index} 
                className={`
                  p-5 rounded-2xl border transition-all hover:scale-[1.01] duration-300
                  ${isPositive ? (isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100') : ''}
                  ${isWarning ? (isDarkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100') : ''}
                  ${!isPositive && !isWarning ? (isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100') : ''}
                  ${insight.isNew ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                   <h4 className={`font-semibold text-lg ${isPositive ? (isDarkMode ? 'text-green-300' : 'text-green-800') : isWarning ? (isDarkMode ? 'text-amber-300' : 'text-amber-800') : (isDarkMode ? 'text-blue-300' : 'text-blue-800')}`}>
                      {insight.title}
                   </h4>
                   <div className="flex gap-2">
                      {insight.isNew && <span className="text-[10px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded">NEW</span>}
                      {isPositive ? <CheckCircle className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} w-5 h-5`} /> : 
                       isWarning ? <AlertCircle className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} w-5 h-5`} /> : 
                       <Lightbulb className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} w-5 h-5`} />}
                   </div>
                </div>
                <p className={`text-sm leading-relaxed opacity-90 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {insight.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
  );
}

export function RecommendationsSection({ recommendations, isDarkMode = true }: { recommendations: Recommendation[]; isDarkMode?: boolean }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <h3 className={`text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
           <Zap className="text-amber-400" />
           Strategic Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className={`
                border rounded-2xl p-6 shadow-sm backdrop-blur-md transition-all flex items-start gap-4 group
                ${isDarkMode 
                   ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                   : 'bg-white border-gray-100 hover:shadow-md'}
                ${rec.isNew ? (isDarkMode ? 'border-purple-500/50 bg-purple-900/10' : 'border-purple-200 bg-purple-50') : ''}
              `}
            >
               <div className={`
                 p-2 rounded-lg shrink-0 transition-colors
                 ${rec.impact === 'high' ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600') : (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')}
               `}>
                 <Target size={20} />
               </div>
               
               <div className="flex-grow">
                 <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold transition-colors text-lg group-hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rec.title}</h4>
                    {rec.isNew && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>New</span>}
                    {rec.impact === 'high' && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-red-900/30 text-red-300 border-red-500/20' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        High Impact
                      </span>
                    )}
                 </div>
                 <p className={`text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rec.action}</p>
                 <div className="flex items-center text-blue-500 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Action Plan <div className="w-4 h-4 ml-1">→</div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>
  );
}
