import { Sparkles, CheckCircle, Shield } from 'lucide-react';

interface DataCleaningSummaryProps {
  duplicatesRemoved: number;
  recordCount: number;
  isDarkMode: boolean;
}

export function DataCleaningSummary({ duplicatesRemoved, recordCount, isDarkMode }: DataCleaningSummaryProps) {
  const hasDuplicates = duplicatesRemoved > 0;
  const originalCount = hasDuplicates ? recordCount + duplicatesRemoved : recordCount;
  const percentageRemoved = hasDuplicates ? ((duplicatesRemoved / originalCount) * 100).toFixed(1) : '0';

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
        <h3 className={`text-lg font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
          Data Quality Report
        </h3>
        <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
      </div>

      <div className={`
        relative overflow-hidden rounded-2xl border p-8
        ${isDarkMode 
          ? 'bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 border-emerald-500/20' 
          : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
        }
      `}>
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-start gap-6">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center
            ${isDarkMode 
              ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30' 
              : 'bg-emerald-100 ring-1 ring-emerald-200'
            }
          `}>
            {hasDuplicates ? (
              <Sparkles className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={32} />
            ) : (
              <Shield className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={32} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={20} />
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {hasDuplicates ? 'Data Automatically Cleaned' : 'Data Quality Verified'}
              </h4>
            </div>
            
            <p className={`text-sm mb-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {hasDuplicates 
                ? 'Your dataset has been automatically cleaned to ensure accurate analysis. Duplicate rows were identified and removed before processing.'
                : 'Your dataset has been scanned for quality issues. No duplicate rows were found - your data is already clean and ready for analysis.'
              }
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`
                rounded-xl p-4 border
                ${isDarkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-emerald-100'
                }
              `}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {hasDuplicates ? 'Original Rows' : 'Total Rows'}
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {originalCount.toLocaleString()}
                </div>
              </div>

              <div className={`
                rounded-xl p-4 border
                ${isDarkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-emerald-100'
                }
              `}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Duplicates {hasDuplicates ? 'Removed' : 'Found'}
                </div>
                <div className={`text-2xl font-bold ${hasDuplicates ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                  {duplicatesRemoved.toLocaleString()}
                  <span className={`text-sm ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    ({percentageRemoved}%)
                  </span>
                </div>
              </div>

              <div className={`
                rounded-xl p-4 border
                ${isDarkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-emerald-100'
                }
              `}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Clean Rows
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {recordCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className={`
              mt-4 p-4 rounded-xl border-l-4
              ${isDarkMode 
                ? 'bg-blue-950/20 border-blue-500/50' 
                : 'bg-blue-50 border-blue-400'
              }
            `}>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                <strong>What does this mean?</strong> {hasDuplicates 
                  ? 'Duplicate rows (identical entries across all columns) were automatically detected and removed. This ensures your analysis is based on unique data points, preventing skewed metrics and misleading insights.'
                  : 'Your dataset was scanned for duplicate rows (identical entries across all columns). No duplicates were detected, which means your data quality is excellent and all records represent unique entries.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
