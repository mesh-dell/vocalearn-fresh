"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";

import { useAuth } from "@/Context/useAuth";
import { StaffGetAPI } from "@/Services/StaffService";
import { ChatGetConversationAPI } from "@/Services/ChatService";

import type { Staff } from "@/Models/Staff";
import type { ChatMessage } from "@/Models/ChatMessage";

export default function ChatPage() {
  const { user, isLoggedIn } = useAuth();
  const isAuthenticated = isLoggedIn();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadData = async () => {
      try {
        const staffRes = await StaffGetAPI();
        if (!staffRes?.data) return;

        setStaff(staffRes.data);

        const counts = await Promise.all(
          staffRes.data.map(async (instructor) => {
            const convo = await ChatGetConversationAPI(
              user.email,
              instructor.email
            );

            const unread =
              convo?.data?.filter(
                (msg: ChatMessage) => msg.receiver === user.email && !msg.read
              ).length ?? 0;

            return [instructor.email, unread] as const;
          })
        );

        setUnreadCounts(Object.fromEntries(counts));
      } catch (err) {
        console.error("Failed to load chat data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  /* ---------------- Guards ---------------- */

  if (!isAuthenticated || !user) {
    return (
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Chat</h1>
        <p className="mt-4 text-muted-foreground">
          Please{" "}
          <Link href="/login" className="underline">
            log in
          </Link>{" "}
          to access chat.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <header>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Chat</h1>
          <p className="text-muted-foreground">
            Communicate and ask questions to your instructors
          </p>
        </header>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Instructors
          </h2>

          <div className="space-y-4">
            {staff.map((instructor) => {
              const unread = unreadCounts[instructor.email] ?? 0;

              return (
                <Card key={instructor.staffId}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                          {instructor.firstName} {instructor.lastName}
                          {unread > 0 && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                              {unread}
                            </span>
                          )}
                        </h3>
                        <p className="text-muted-foreground">
                          {instructor.department}
                        </p>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/dashboard/chat/${encodeURIComponent(
                              instructor.email
                            )}`}
                          >
                            <Button>Chat</Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {unread > 0
                            ? `${unread} unread message${unread > 1 ? "s" : ""}`
                            : "No unread messages"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
