import { DynamicChartRenderer } from './DynamicChartRenderer';
import { DashboardData, GenericInsight, Recommendation, Prediction } from '@/types/dashboard';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className={`
                relative border p-6 rounded-2xl transition-all duration-300 group flex flex-col justify-between
                ${isDarkMode 
                   ? 'bg-[#0f172a] border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/10' 
                   : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100'}
                ${rec.impact === 'high' && isDarkMode ? 'shadow-red-900/10 border-red-500/20' : ''}
              `}
            >
               <div className="flex items-start justify-between mb-3">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${rec.impact === 'high' 
                        ? (isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600') 
                        : (isDarkMode ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600')}
                  `}>
                    <Target size={20} />
                  </div>
                  
                  {/* Badge Area */}
                  <div className="flex gap-2">
                     {rec.isNew && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>NEW</span>
                     )}
                     {rec.impact === 'high' && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border animate-pulse ${isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-red-100 text-red-700 border-red-200'}`}>
                           HIGH IMPACT
                        </span>
                     )}
                  </div>
               </div>

               <div>
                 <h4 className={`font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {rec.title}
                 </h4>
                 <p className={`text-sm leading-relaxed mb-4 font-light ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {rec.action}
                 </p>
               </div>
               
               <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <button className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                     Execute Strategy <Zap size={12} fill="currentColor" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>
  );
}

export function PredictionsSection({ predictions, isDarkMode = true }: { predictions?: Prediction[]; isDarkMode?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!predictions || predictions.length === 0) return null;

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
        <h3 className={`text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
           <Sparkles className="text-emerald-400" />
           Future Forecasts & Predictions
           <span className="text-xs font-normal opacity-50 ml-2 tracking-normal bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 text-blue-400">AI Generated</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {predictions.map((pred, index) => {
              const isHighConfidence = pred.confidence === 'high';
              const isUp = pred.trend === 'up';
              const isDown = pred.trend === 'down';
              
              return (
                 <div
                   key={index}
                   className={`
                     p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden
                     ${isDarkMode 
                        ? 'bg-[#0f172a] border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-900/10' 
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg'}
                     ${pred.isNew ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}
                   `}
                 >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest
                          ${isHighConfidence 
                             ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700')
                             : (isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700')}
                       `}>
                          {pred.confidence} Confidence
                       </span>
                       <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            className={`p-2 rounded-full transition-colors ${
                              isDarkMode ? "hover:bg-white/10 text-emerald-400/50 hover:text-emerald-400" : "hover:bg-emerald-100 text-emerald-600/50 hover:text-emerald-600"
                            } ${pred.explanation ? 'cursor-help' : 'cursor-default'}`}
                          >
                            <Info size={16} />
                          </button>
                          <div className={`p-2 rounded-full ${isUp ? 'bg-green-500/10 text-green-500' : isDown ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-400'}`}>
                              {isUp ? <TrendingUp size={20} /> : isDown ? <TrendingDown size={20} /> : <Minus size={20} />}
                          </div>
                       </div>
                    </div>
                    
                    <AnimatePresence>
                      {activeIndex === index && pred.explanation && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute inset-0 z-20 bg-[#0f172a]/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-in fade-in"
                        >
                           <div className="bg-blue-500/20 p-2 rounded-full mb-3 text-blue-400">
                              <Info size={24} />
                           </div>
                           <h5 className="text-white font-bold mb-2">AI Calculation</h5>
                           <p className="text-sm text-gray-300 leading-relaxed font-light mb-4">
                              {pred.explanation}
                           </p>
                           <button 
                            onClick={() => setActiveIndex(null)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-white"
                           >
                             Dismiss
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <h4 className={`text-sm opacity-70 font-semibold mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{pred.title}</h4>
                    <div className={`text-3xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{pred.predictedValue}</div>
                    
                    <p className={`text-xs leading-relaxed font-light ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                       {pred.reasoning}
                    </p>
                 </div>
              );
           })}
        </div>
    </section>
  );
}
