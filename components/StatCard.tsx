import React, { ReactNode } from "react";
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  variant?: "default" | "accent";
  delay?: number;
  isNew?: boolean;
  isDarkMode?: boolean;
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
}: StatCardProps) {
  const isAccent = variant === "accent";

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
        <div
          className={`p-2 rounded-lg ${
            isAccent ? "bg-white/20" : isDarkMode ? "bg-white/10 text-blue-400" : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
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
