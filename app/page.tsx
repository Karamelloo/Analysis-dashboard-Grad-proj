'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { DashboardView } from '@/components/DashboardView';
import { DashboardData } from '@/types/dashboard';
import { PageHeader, PageFooter } from '@/components/LayoutComponents';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Analysis failed');
      }

      const result = await response.json();
      setData(result);
    } catch (error: any) {
      console.error('Error analyzing file:', error);
      alert(error.message || 'Failed to analyze the file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setData(null);
  };

  if (isAnalyzing) {
    return <SkeletonLoader />;
  }

  if (data) {
    return <DashboardView data={data} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      <main className="flex-grow flex items-center justify-center">
        <FileUploader onUpload={handleUpload} isAnalyzing={isAnalyzing} />
      </main>
      <PageFooter />
    </div>
  );
}
