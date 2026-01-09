"use client";

import { ReactNode } from "react";
import { StaffNav } from "@/components/staff-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top navigation */}
      <StaffNav />

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
