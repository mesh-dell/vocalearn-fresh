"use client";

import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import { useEffect, useState } from "react";
import { leaderboardGetAPI } from "@/Services/LeaderboardService";
import { LeaderboardEntry } from "@/Models/Leaderboard";

export default function LeaderboardPage() {
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

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20">
      {/* Header */}
      <header className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performers ranked by total points
        </p>
      </header>

      {/* Leaderboard */}
      <div className="mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        <div className="bg-primary p-6 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">Rankings</h2>
          <p className="mt-1 text-sm uppercase tracking-widest text-primary-foreground/80">
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
            {leaderboard.map((student, index) => {
              return (
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
                            ? "text-yellow-500"
                            : index === 1
                              ? "text-gray-400"
                              : index === 2
                                ? "text-orange-600"
                                : "text-muted-foreground"
                        }`}
                      >
                        {index === 0
                          ? "🥇"
                          : index === 1
                            ? "🥈"
                            : index === 2
                              ? "🥉"
                              : `${index + 1}`}
                      </span>
                    </div>

                    {/* Avatar Placeholder */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted font-semibold text-foreground">
                      {student.studentName.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <div>
                      <span className="font-semibold text-foreground">
                        {student.studentName}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <span className="block text-lg font-bold text-foreground">
                      {student.totalPoints.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      Points
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}