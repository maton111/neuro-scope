import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const viewport: Viewport = {
  themeColor: "#080808",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://neuroscope.vercel.app"
  ),
  title: "NeuroScope — Real-time Cognitive Presence Analysis",
  description:
    "Browser-based real-time system that analyzes your apparent cognitive state while you work. Face tracking, synthetic metrics, live dashboard. No data leaves your browser.",
  keywords: ["focus tracker", "productivity", "computer vision", "mediapipe", "real-time", "cognitive state"],
  authors: [{ name: "Mattia Archina" }],
  creator: "Mattia Archina",
  openGraph: {
    title: "NeuroScope — Real-time Cognitive Presence Analysis",
    description:
      "Your face. Your focus. Your dashboard. Real-time cognitive telemetry powered by computer vision — entirely in your browser.",
    type: "website",
    siteName: "NeuroScope",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroScope — Real-time Cognitive Presence Analysis",
    description:
      "Your face. Your focus. Your dashboard. Real-time cognitive telemetry powered by computer vision — entirely in your browser.",
    creator: "@mattiarchina",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}