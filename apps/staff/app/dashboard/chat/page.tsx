"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import { useEffect, useState } from "react";
import { StudentGetAPI } from "@/Services/StudentService";
import { Student } from "@/Models/Student";
import { ChatGetConversationAPI } from "@/Services/ChatService";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";

export default function ChatPage() {
  const { isLoggedIn, user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) => {
    const q = search.toLowerCase();

    return (
      student.email.toLowerCase().includes(q) ||
      student.className?.toLowerCase().includes(q) ||
      student.admissionId?.toLowerCase().includes(q)
    );
  });

  /* ---------------- Fetch students ---------------- */
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchStudents = async () => {
      const response = await StudentGetAPI();
      if (response?.data) {
        setStudents(response.data);
      }
    };

    fetchStudents();
  }, [isLoggedIn]);

  /* ---------------- Fetch unread counts ---------------- */
  useEffect(() => {
    if (!user?.email || students.length === 0) return;

    const fetchUnreadCounts = async () => {
      const counts: Record<string, number> = {};

      await Promise.all(
        students.map(async (student) => {
          const res = await ChatGetConversationAPI(user.email, student.email);

          if (res?.data) {
            counts[student.email] = res.data.filter(
              (msg) => msg.sender === student.email && msg.read === false,
            ).length;
          }
        }),
      );

      setUnreadCounts(counts);
    };

    fetchUnreadCounts();
  }, [students, user?.email]);

  return (
    <main className="container mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Chat</h1>
        <p className="text-muted-foreground">
          Start or continue conversations with your students
        </p>
      </div>

      {/* Chat with Admin */}
      <div>
        <Card className="hover:shadow-md transition cursor-pointer">
          <Link href="/dashboard/chat/admin" className="block">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-lg font-semibold">Chat with Admin</h2>
                <p className="text-sm text-muted-foreground">
                  Contact system administrator for support or issues
                </p>
              </div>

              <Button variant="outline">Open</Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Students */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Students</h2>
        <div>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-4">
          {filteredStudents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No students match your search.
            </p>
          )}
          {filteredStudents.map((student) => {
            const unread = unreadCounts[student.email] ?? 0;

            return (
              <Card key={student.admissionId}>
                <CardContent className="p-6 flex items-center justify-between gap-6">
                  {/* Student info */}
                  <div>
                    <h3 className="text-lg font-semibold">{student.email}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.className}
                    </p>
                  </div>

                  {/* Chat action */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/dashboard/chat/${encodeURIComponent(
                          student.email,
                        )}`}
                      >
                        <Button variant="default" className="relative">
                          Chat
                          {unread > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                              {unread}
                            </span>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>

                    {unread > 0 && (
                      <TooltipContent>
                        {unread} unread message
                        {unread > 1 ? "s" : ""}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
