"use client";

import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">No user logged in.</p>
      </div>
    );
  }

  const incomplete = !user.firstName || !user.lastName;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-20">
      {/* Incomplete Profile Warning */}
      {incomplete && (
        <Card className="border-warning/50 bg-warning/10">
          <CardContent className="space-y-2 p-4">
            <h3 className="text-lg font-semibold text-warning-foreground">
              Complete Your Profile
            </h3>
            <p className="text-warning-foreground/80">
              Your profile is incomplete. Please provide your first and last
              name.
            </p>
            <Link
              href="/dashboard/profile/complete"
              className="mt-2 inline-block rounded bg-warning px-4 py-2 text-sm text-primary-foreground hover:bg-warning/90"
            >
              Complete Profile
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <header className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View your account details</p>
      </header>

      {/* Profile Card */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              First Name
            </h2>
            <p className="text-muted-foreground">{user.firstName || "—"}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">Last Name</h2>
            <p className="text-muted-foreground">{user.lastName || "—"}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">Email</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Admission ID
            </h2>
            <p className="text-muted-foreground">{user.admissionId}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Admission Year
              </h2>
              <p className="text-muted-foreground">{user.admissionYear}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Gender</h2>
              <p className="text-muted-foreground">{user.gender}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Class Name
            </h2>
            <p className="text-muted-foreground">{user.className}</p>
          </div>
        </CardContent>
      </Card>

      {/* Link to Leaderboard */}
      <div className="text-center">
        <Link href="/dashboard/leaderboard">
          <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            View Leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
}
