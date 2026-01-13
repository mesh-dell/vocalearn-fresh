"use client";

import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { leaderboardGetAPI } from "@/Services/LeaderboardService";
import { LeaderboardEntry } from "@/Models/Leaderboard";

export default function ProfilePage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard on mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await leaderboardGetAPI();
        const sorted = data
          .map((entry) => ({
            ...entry,
            studentName: entry.studentName || "Unknown",
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints);
        setLeaderboard(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

      {/* Leaderboard */}
      <div className="mx-auto my-10 max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow">
        <div className="bg-primary p-6 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
          <p className="mt-1 text-sm tracking-widest uppercase text-primary/80">
            Top Performers
          </p>
        </div>

        {loading ? (
          <p className="p-6 text-center text-muted-foreground">
            Loading leaderboard...
          </p>
        ) : leaderboard.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground">
            No leaderboard data found.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {leaderboard.map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 transition-colors hover:bg-accent/5"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="flex w-10 justify-center">
                    <span
                      className={`font-bold ${
                        index === 0
                          ? "text-warning-foreground"
                          : index === 1
                            ? "text-muted-foreground"
                            : index === 2
                              ? "text-accent-foreground"
                              : "text-muted-foreground"
                      }`}
                    >
                      {index === 0
                        ? "1st"
                        : index === 1
                          ? "2nd"
                          : index === 2
                            ? "3rd"
                            : `${index + 1}th`}
                    </span>
                  </div>

                  {/* Avatar Placeholder */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted font-semibold text-foreground">
                    {student.studentName.charAt(0)}
                  </div>

                  {/* Name */}
                  <span className="font-semibold text-foreground">
                    {student.studentName}
                  </span>
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="block text-lg font-bold text-foreground">
                    {student.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Points
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
