"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

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
import { ChatMessage } from "@/Models/ChatMessage";

export default function ChatStaffPage() {
  const { user, isLoggedIn } = useAuth();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredStaff = staff.filter((member) => {
    const q = search.toLowerCase();

    return (
      member.firstName.toLowerCase().includes(q) ||
      member.lastName.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.department?.toLowerCase().includes(q)
    );
  });

  /* ---------------- Load staff + unread counts ---------------- */
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const loadData = async () => {
      try {
        const staffRes = await StaffGetAPI();
        if (!staffRes?.data) return;

        setStaff(staffRes.data);

        const counts = await Promise.all(
          staffRes.data.map(async (member) => {
            const convo = await ChatGetConversationAPI(
              user.emailAddress, // admin
              member.email, // staff
            );

            const unread =
              convo?.data?.filter(
                (msg: ChatMessage) =>
                  msg.receiver === user.emailAddress && !msg.read,
              ).length ?? 0;

            return [member.email, unread] as const;
          }),
        );

        setUnreadCounts(Object.fromEntries(counts));
      } catch (err) {
        console.error("Failed to load staff chat data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, user]);

  /* ---------------- Guards ---------------- */

  if (!isLoggedIn || !user) {
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
      <div className="space-y-8 p-12">
        <header>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Chat with Staff
          </h1>
          <p className="text-muted-foreground">
            Communicate with staff members
          </p>
        </header>
        <Link className="flex items-center gap-1" href="/dashboard">
          <ArrowLeft size={16} />
          Back
        </Link>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Staff</h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-4">
            {filteredStaff.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No staff members match your search.
              </p>
            )}

            {filteredStaff.map((member) => {
              const unread = unreadCounts[member.email] ?? 0;

              return (
                <Card key={member.staffId}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                          {member.firstName} {member.lastName}
                          {unread > 0 && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                              {unread}
                            </span>
                          )}
                        </h3>
                        <p className="text-muted-foreground">
                          {member.department}
                        </p>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/dashboard/chat-staff/${encodeURIComponent(
                              member.email,
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
