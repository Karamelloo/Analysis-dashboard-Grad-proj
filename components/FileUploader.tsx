'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// To save installing another dep, I'll allow simple input first, 
// OR I can write a simple custom drag-drop handler. Custom is better to avoid deps if possible.

interface FileUploaderProps {
  onUpload: (file: File, prompt?: string) => void;
  isAnalyzing: boolean;
}

export function FileUploader({ onUpload, isAnalyzing }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onUpload(file, prompt);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Upload Data</h2>
          <p className="text-gray-500">
            Upload your Excel (.xlsx) or CSV file to generate an AI-powered analysis dashboard.
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-3">
             <AnimatePresence mode="wait">
               {file ? (
                 <motion.div
                   key="file"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-2 text-blue-600 font-medium"
                 >
                   <CheckCircle size={20} />
                   <span>{file.name}</span>
                 </motion.div>
               ) : (
                 <motion.div
                   key="prompt"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col items-center gap-2"
                 >
                   <Upload size={24} className="text-gray-400" />
                   <p className="text-sm text-gray-500">
                     Drag & drop or <span className="text-blue-600 font-medium">click to browse</span>
                   </p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept=".xlsx,.csv"
            disabled={isAnalyzing}
          />
        </div>
        
        {/* Custom Prompt Input */}
        <div className="mt-6 text-left">
          <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 mb-2">
             Optional: Instructions for AI
          </label>
          <textarea
            id="custom-prompt"
            rows={3}
            className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-3 text-sm resize-none border text-black"
            placeholder="e.g., Focus on profit margins, Analyze this as a healthcare dataset..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        <button
          onClick={handleUploadClick}
          disabled={!file || isAnalyzing}
          className={`mt-6 w-full py-3 px-4 rounded-full font-bold text-white transition-all flex items-center justify-center gap-2 ${
            !file || isAnalyzing
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing Data...
            </>
          ) : (
            "Generate Analysis"
          )}
        </button>
      </motion.div>
    </div>
  );
}
