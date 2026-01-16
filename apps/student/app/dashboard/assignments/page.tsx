"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Assignment } from "@/Models/Assignment";
import { assignmentsGetAPI } from "@/Services/AssignmentService";
import { useAuth } from "@/Context/useAuth";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const getClassFromAdmissionId = (admissionId: string) => {
    const parts = admissionId.split("/");
    return parts.length > 1 ? parts[1] : "";
  };

  useEffect(() => {
    if (!user?.admissionId) return;
    const className = getClassFromAdmissionId(user.admissionId);

    const fetchAssignments = async () => {
      setLoading(true);
      const res = await assignmentsGetAPI(className!);
      if (res) setAssignments(res);
      setLoading(false);
    };

    fetchAssignments();
  }, [user?.admissionId]);

  const completed = assignments.filter((a) =>
    a.questions.every((q) => q.options.length === 0)
  ).length;
  const inProgress = assignments.length - completed;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Assignments</h1>
        <p className="text-muted-foreground">
          View and attempt assignments for your class
        </p>
      </header>

      {/* Stats (optional, can be expanded) */}
      {assignments.length > 0 && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Completed: {completed}</span>
          <span>In Progress: {inProgress}</span>
        </div>
      )}

      {/* Assignments List */}
      <section>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          All Assignments
        </h2>

        {loading ? (
          <p className="text-muted-foreground">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-muted-foreground">No assignments available.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.assignmentId}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {assignment.title}
                      </h3>
                      <p className="text-muted-foreground">
                        Due:{" "}
                        <span className="font-medium text-foreground">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {assignment.description}
                      </p>
                    </div>

                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link
                        href={`/dashboard/assignments/${assignment.assignmentId}`}
                      >
                        Start
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
