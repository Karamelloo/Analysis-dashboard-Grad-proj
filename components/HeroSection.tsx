import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 md:mb-16"
    >
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          User Insights & Analytics
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          This dashboard presents the results of a comprehensive multi-agent data analysis pipeline applied to your uploaded data.
        </p>
      </div>
    </motion.section>
  );
}
