import { DashboardNav } from "@/components/dashboardNav";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
