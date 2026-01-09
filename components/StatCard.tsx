import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Info } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  variant?: "default" | "accent";
  delay?: number;
  isNew?: boolean;
  isDarkMode?: boolean;
  explanation?: string;
}

export function StatCard({
  label,
  value,
  description,
  icon,
  variant = "default",
  delay = 0,
  isNew,
  isDarkMode = true,
  explanation,
}: StatCardProps) {
  const isAccent = variant === "accent";
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl p-6 border transition-all hover:scale-[1.02] duration-300 ${
        isAccent
          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/30"
          : isDarkMode 
            ? "bg-white/5 border-white/10 text-white shadow-lg shadow-blue-900/10 backdrop-blur-sm"
            : "bg-white border-gray-100 text-gray-900 shadow-sm hover:shadow-md"
      } ${isNew ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}`}
    >
      {isNew && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full border animate-pulse ${isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
          New
        </span>
      )}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className={`text-sm font-medium ${
              isAccent ? "text-blue-50 opacity-90" : isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => explanation && setShowExplanation(!showExplanation)}
            className={`p-2 rounded-lg transition-colors ${
              isAccent ? "bg-white/20 hover:bg-white/30" : isDarkMode ? "bg-white/10 text-blue-400 hover:bg-white/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            } ${explanation ? 'cursor-help' : 'cursor-default'}`}
          >
            {icon}
          </button>
          
          <AnimatePresence>
            {showExplanation && explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-64 z-50 p-4 rounded-xl shadow-2xl border border-blue-500/20 bg-[#0f172a]/95 backdrop-blur-xl text-left"
              >
                 <div className="flex items-start gap-2 mb-2">
                    <Info size={16} className="text-blue-400 mt-0.5" />
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">AI Insight</span>
                 </div>
                 <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {explanation}
                 </p>
                 <button 
                  onClick={() => setShowExplanation(false)}
                  className="mt-3 text-[10px] text-blue-400 hover:text-white uppercase font-bold tracking-widest w-full text-center"
                 >
                   Close
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p
        className={`text-xs ${
          isAccent ? "text-blue-50 opacity-80" : isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}
