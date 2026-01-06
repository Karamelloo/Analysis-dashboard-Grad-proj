import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlaySonic Dashboard | User Analysis",
  description: "Comprehensive User Analysis Dashboard for PlaySonic, featuring multi-agent data pipelines, demographics, and engagement metrics.",
  openGraph: {
    title: "PlaySonic User Analysis Dashboard",
    description: "Insights into 1,000 active PlaySonic users including demographics, engagement, and padel rank distribution.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlaySonic User Analysis",
    description: "Multi-agent data analysis of PlaySonic user base.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
