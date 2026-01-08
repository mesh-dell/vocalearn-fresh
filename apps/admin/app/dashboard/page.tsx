"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Users, GraduationCap, Settings } from "lucide-react";
import { Button } from "@repo/ui/button";
import { useAuth } from "@/Context/useAuth";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminDashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user || user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [token, user, router]);

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage staff, classes, and system settings for your LMS.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Dashboard Cards */}
      <main className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Staff Management */}
        <Card className="hover:shadow-md transition border border-border">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Staff</CardTitle>
            <Users className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View, add, and manage all staff members in the system.
            </p>
            <Link href="/dashboard/staff">
              <Button variant="default" className="w-full">
                Manage Staff
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Institution Management */}
        <Card className="hover:shadow-md transition border border-border">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Institutions</CardTitle>
            <GraduationCap className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create and manage Institutions
            </p>
            <Link href="/dashboard/institutions">
              <Button variant="default" className="w-full">
                Manage Institutions
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Optional Settings Card */}
        <Card className="hover:shadow-md transition border border-border">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Settings</CardTitle>
            <Settings className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configure system-wide preferences and LMS options.
            </p>
            <Link href="/dashboard/settings">
              <Button variant="default" className="w-full">
                Go to Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
