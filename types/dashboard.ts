export interface Metric {
  label: string;
  value: string;
  description: string;
  icon: string; // We'll store icon name as string and map it in component
  variant?: 'default' | 'accent';
  delay?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface AdditionalMetric {
  title: string;
  value: string;
  sub: string;
  className: string;
}

export interface Finding {
  title: string;
  desc: string;
}

export interface MarketingData {
  targetAudience: { label: string; text: string }[];
  recommendations: { label: string; text: string }[];
  strategies: { icon: string; title: string; desc: string; from: string; to: string }[];
  roi: { value: string; label: string; color: string }[];
}

export interface KeyFinding extends Finding {} // Alias if needed, or just use Finding

export interface DataQualityRow {
  metric: string;
  result: string;
  status: string;
}

export interface DashboardData {
  keyMetrics: Metric[];
  additionalMetrics: AdditionalMetric[];
  
  // Charts Data
  demographics: {
    ageDistribution: ChartDataPoint[];
    genderSplit: ChartDataPoint[];
  };
  
  engagement: {
    activityTime: ChartDataPoint[];
    padelRank: ChartDataPoint[];
  };
  
  location: {
    topRegions: ChartDataPoint[];
  };
  keyFindings: Finding[];
  marketing: MarketingData;
  dataQuality: DataQualityRow[];
  recordCount?: number;
}
