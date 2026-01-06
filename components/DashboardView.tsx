import { useRef } from 'react';
import { ChartCard, SimpleBarChart, SimplePieChart, SimpleAreaChart } from '@/components/ChartComponents';
import { PageHeader, PageFooter } from '@/components/LayoutComponents';
import { HeroSection } from '@/components/HeroSection';
import { StatCard } from '@/components/StatCard';
import { KeyFindings } from '@/components/KeyFindings';
import { MarketingConclusion } from '@/components/MarketingConclusion';
import { Methodology, MultiAgentArchitecture, DataQualitySummary, Conclusion } from '@/components/AnalysisSections';
import { ScrollToTop } from '@/components/ScrollToTop';
import { DashboardData } from '@/types/dashboard';
import { Users, TrendingUp, MapPin, Trophy, Target, Megaphone, BarChart3, Lightbulb, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Icon mapping helper
const IconMap: Record<string, any> = {
  Users, TrendingUp, MapPin, Trophy, Target, Megaphone, BarChart3, Lightbulb, Download
};

interface DashboardViewProps {
  data: DashboardData;
  onReset: () => void;
}

export function DashboardView({ data, onReset }: DashboardViewProps) {
  
  const { keyMetrics, additionalMetrics, demographics, engagement, location, keyFindings, marketing, dataQuality } = data;
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1, 
        useCORS: true, 
        logging: true,
        windowWidth: 1440 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const contentHeightMm = (imgHeight * pdfWidth) / imgWidth;
      const longPdf = new jsPDF('p', 'mm', [pdfWidth, contentHeightMm]);
      
      longPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, contentHeightMm);
      longPdf.save('PlaySonic-Analysis-Report.pdf');
      
    } catch (err: any) {
      console.error("PDF Export failed", err);
      alert("PDF Error: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative" ref={dashboardRef}>
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm" data-html2canvas-ignore>
        <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">PlaySonic Analytics</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
             <Download size={16} />
             Export PDF
          </button>
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Lightbulb size={16} />
            New Analysis
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <HeroSection />
        
        {/* Key Metrics */}
        <section className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Key Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => {
              const IconComponent = IconMap[metric.icon] || Users;
              return (
                <StatCard
                  key={index}
                  label={metric.label}
                  value={metric.value}
                  description={metric.description}
                  icon={<IconComponent size={24} />}
                  variant={metric.variant}
                  delay={metric.delay}
                />
              );
            })}
          </div>
        </section>

        {/* Additional Metrics */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 md:mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalMetrics.map((metric, index) => (
              <motion.div 
                key={index}
                className={clsx("rounded-xl p-6 text-white shadow-lg bg-slate-800", metric.className)}
              >
                <h4 className="text-lg font-bold mb-2">{metric.title}</h4>
                <p className="text-4xl font-bold">{metric.value}</p>
                <p className="text-sm opacity-80 mt-1">{metric.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Demographics */}
        <section className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">User Demographics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Age Distribution" description="Breakdown of users by age group">
              <SimpleBarChart data={demographics.ageDistribution} color="#0d9488" />
            </ChartCard>
            <ChartCard title="Gender Overview" description="User distribution by gender">
              <SimplePieChart data={demographics.genderSplit} />
            </ChartCard>
          </div>
        </section>

        {/* Engagement */}
        <section className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Engagement & Skills</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Activity Correlation" description="Peak activity hours">
              <SimpleAreaChart data={engagement.activityTime} color="#2563eb" />
            </ChartCard>
            <ChartCard title="Rank Level Distribution" description="User skill levels">
               <SimpleBarChart data={engagement.padelRank} color="#4f46e5" />
            </ChartCard>
          </div>
        </section>

        {/* Location */}
        <section className="mb-12 md:mb-16">
           <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Location Insights</h3>
           <div className="grid grid-cols-1">
             <ChartCard title="Top Regions" description="Most active user locations">
               <SimpleBarChart data={location.topRegions} color="#0891b2" />
             </ChartCard>
           </div>
        </section>

        {/* Key Findings - Note: KeyFindings component needs to be made dynamic or we just inline it here for now to save edits */}
        <section className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Key Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {keyFindings.map((finding, index) => (
               <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <h4 className="font-bold text-gray-900 mb-3">{finding.title}</h4>
                 <p className="text-sm text-gray-700">{finding.desc}</p>
               </div>
             ))}
          </div>
        </section>
        
        {/* We reuse static components for Marketing/Methodology for now as they are complex to fully dynamic without massive JSON */}
        <MarketingConclusion data={marketing} />
        <Methodology recordCount={data.recordCount} />
        <MultiAgentArchitecture />
        <DataQualitySummary data={dataQuality} />
        <Conclusion recordCount={data.recordCount} />
        
        <PageFooter />
      </main>
      
      <ScrollToTop />
    </div>
  );
}
