import { Users, TrendingUp, MapPin, Trophy, Target, Lightbulb, BarChart3 } from 'lucide-react';

export const KEY_METRICS = [
  { label: "Total Users", value: "1,000", description: "Active PlaySonic users analyzed", icon: Users, variant: "accent", delay: 0.1 },
  { label: "Average Age", value: "25.50", description: "years old", icon: TrendingUp, variant: "default", delay: 0.2 },
  { label: "Avg. Padel Rank", value: "4.07", description: "on a scale of 1-7", icon: Trophy, variant: "default", delay: 0.3 },
  { label: "Avg. Total Activity", value: "50.58", description: "games and reservations", icon: MapPin, variant: "default", delay: 0.4 },
] as const;

export const ADDITIONAL_METRICS = [
  { title: "Total Reservations", value: "19,970", sub: "Across all locations", className: "bg-gradient-to-br from-teal-500 to-cyan-600 shadow-teal-500/20" },
  { title: "Matchmaking Games", value: "30,609", sub: "Total games joined", className: "bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/20" },
  { title: "Gender Split", value: "73% / 27%", sub: "Male / Female users", className: "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20" },
];

export const DEMOGRAPHICS_CHARTS = [
  { title: "Age Distribution", description: "Majority of users are under 35, with 300 users under 18, 262 aged 18-25, and 338 aged 26-35", imageSrc: "/age_distribution.png", imageAlt: "Age Distribution Histogram" },
  { title: "Gender Distribution", description: "Male-dominant user base with 730 male users (73%) and 270 female users (27%)", imageSrc: "/gender_distribution.png", imageAlt: "Gender Distribution Pie Chart" },
];

export const ENGAGEMENT_CHARTS = [
  { title: "Padel Rank Distribution", description: "Most users are intermediate to advanced: 364 intermediate (2-4), 437 advanced (4-6), 133 beginners, and 66 experts", imageSrc: "/padel_rank_distribution.png", imageAlt: "Padel Rank Distribution" },
  { title: "Activity Correlation", description: "Scatter plot showing relationship between reservations and matchmaking games", imageSrc: "/activity_correlation.png", imageAlt: "Activity Correlation Scatter Plot" },
];

export const LOCATION_CHART = {
  title: "Reservation & Matchmaking Locations",
  description: "Orthodoxi Club leads reservations (175), while Padel Arena dominates matchmaking (190)",
  imageSrc: "/location_preferences.png",
  imageAlt: "Location Preferences Charts"
};

export const KEY_FINDINGS = [
  { title: "Young User Base", desc: "The platform attracts a predominantly young audience with an average age of 25.5 years." },
  { title: "High Engagement", desc: "Users average 50.58 total activities, with matchmaking games significantly outpacing direct reservations." },
  { title: "Skill Diversity", desc: "The platform serves all skill levels with 43.7% advanced players, 36.4% intermediate, and 13.3% beginners." },
];

export const TARGET_AUDIENCE = [
  { label: "Primary:", text: "Young males aged 16-35 (73% of user base)" },
  { label: "Secondary:", text: "Female users aged 18-35 (growth opportunity - 27%)" },
  { label: "Skill Focus:", text: "Intermediate to advanced players (80% of users)" },
];

export const RECOMMENDATIONS = [
  { label: "Female Recruitment:", text: "Launch \"Ladies Padel Night\" campaigns" },
  { label: "Matchmaking Promotion:", text: "Emphasize social matchmaking features" },
  { label: "Location Partnerships:", text: "Strengthen partnerships with top venues" },
];

export const STRATEGIES = [
  { icon: BarChart3, title: "Social Media Strategy", desc: "Focus on Instagram and TikTok for the 16-25 demographic.", from: "purple-500", to: "indigo-600" },
  { icon: Users, title: "Community Building", desc: "Leverage the 30,609 matchmaking games to create user-generated content campaigns.", from: "teal-500", to: "cyan-600" },
  { icon: Trophy, title: "Skill-Based Promotions", desc: "Create tiered tournaments for different skill levels.", from: "orange-500", to: "amber-600" },
];

export const ROI_METRICS = [
  { value: "+35%", label: "User Growth Potential", color: "teal" },
  { value: "+50%", label: "Female User Target", color: "orange" },
  { value: "+25%", label: "Reservation Increase", color: "purple" },
  { value: "6", label: "Partner Venues", color: "cyan" },
];

export const DATA_QUALITY_ROWS = [
  { metric: "Total Records", result: "1,000", status: "✓ Valid" },
  { metric: "Duplicate Records", result: "0", status: "✓ Clean" },
  { metric: "Missing Values", result: "0", status: "✓ Complete" },
  { metric: "Data Consistency", result: "100%", status: "✓ Verified" },
];

export const ARCHITECTURE_AGENTS = [
  { name: 'Data Ingestion', desc: 'Load & inspect' },
  { name: 'Data Cleaning', desc: 'Quality assurance' },
  { name: 'Data Analysis', desc: 'Statistics & insights' },
  { name: 'Power BI', desc: 'Visualization' },
  { name: 'Documentation', desc: 'Reporting' },
];
