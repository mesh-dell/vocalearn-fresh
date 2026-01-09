"use client";

import { useAuth } from "@/Context/useAuth";
import { Card, CardContent } from "@repo/ui/card";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StaffDashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
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
    <main className="container mx-auto px-6 py-10 space-y-10">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {user.firstName} {user.lastName}!
        </h1>
        <p className="text-muted-foreground">
          Manage your courses, assignments, and interact with students.
        </p>
      </div>

      {/* User Profile Summary */}
      <Card>
        <CardContent className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="Role" value={user.role} />
          <ProfileItem label="Department" value={user.department} />
          <ProfileItem label="Phone" value={user.phoneNumber || "N/A"} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardLink
          href="/dashboard/courses"
          title="Manage Courses"
          description="Create and edit courses for your students"
        />

        <DashboardLink
          href="/dashboard/assignments"
          title="Assignments"
          description="Create, view, and grade submissions"
        />

        <DashboardLink
          href="/dashboard/chat"
          title="Student Chat"
          description="Communicate with your students in real-time"
        />
      </div>
    </main>
  );
}

/* ---------------------------------- */
/* Reusable Components                */
/* ---------------------------------- */

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function DashboardLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition">
        <CardContent className="p-6 text-center space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
