import React, { ReactNode } from "react";
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  variant?: "default" | "accent";
  delay?: number;
}

export function StatCard({
  label,
  value,
  description,
  icon,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  const isAccent = variant === "accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className={`rounded-xl p-6 border shadow-sm transition-shadow hover:shadow-md ${
        isAccent
          ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-transparent"
          : "bg-white border-gray-100 text-gray-900"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className={`text-sm font-medium ${
              isAccent ? "text-teal-50 opacity-90" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div
          className={`p-2 rounded-lg ${
            isAccent ? "bg-white/20" : "bg-teal-50 text-teal-600"
          }`}
        >
          {icon}
        </div>
      </div>
      <p
        className={`text-xs ${
          isAccent ? "text-teal-50 opacity-80" : "text-gray-500"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}
