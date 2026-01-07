import { motion } from "framer-motion";

export function PageHeader() {
  return (
    <header className="bg-white/5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl shadow-lg shadow-black/5 supports-[backdrop-filter]:bg-white/5">
      <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-1">
        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <h1 className="text-xl md:text-2xl font-black bg-[size:200%] bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent tracking-tighter animate-gradient">
              Karam A+ Grad project
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold ml-0.5"
          >
            Analysis Dashboard
          </motion.p>
        </div>
      </div>
    </header>
  );
}
export function PageFooter() {
  return (
    <footer className="mt-20 border-t border-gray-100 py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* Assuming Activity is an imported component, adding it here */}
        {/* <Activity className="text-gray-300" size={20} /> */}
        <span className="font-bold text-gray-400">Karam A+ Grad project</span>
      </div>
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} Karam A+ Grad project Analytics • Powered by Multi-Agent AI
      </p>
    </footer>
  );
}
