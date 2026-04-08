import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Live Session — NeuroScope",
  description: "Real-time cognitive presence analysis. Face tracking, live metrics, and commentary.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}